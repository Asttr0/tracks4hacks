import { useEffect, useMemo, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Swords, ShieldCheck, ShieldAlert } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { AttackEvent } from '@/types/attack'
import {
  TOOL_META,
  SEVERITY_HEX,
  formatLag,
  reactionLabel,
  tellAttack,
  type TimelineModel,
  type TimelineAlert,
  type TimelinePhase,
} from '@/lib/timeline'
import {
  arcPath,
  buildViewport,
  formatTick,
  generateTicks,
  tToX,
  xToT,
  type Viewport,
} from './geometry'
import type { TimelineState } from './state'
import { TOOL_ICON_COMPONENT } from './TimelineIcons'

interface Props {
  model: TimelineModel
  state: TimelineState
}

const LAYOUT = {
  phaseY:    32,   // phase chip rect: y 22..40, text baseline at y=35
  attackY:   146,  // attack card center; body y 122..170
  attackR:   24,
  // tool tag above body  : y = 112
  // headline below body  : y = 192
  // target  below body   : y = 210
  arcStartY: 232,  // arc origin (22px BELOW target text)
  arcMidY:   314,
  arcEndY:   396,  // arc end (just above defense card top at y=400)
  defenseY:  424,  // defense card center; body y 400..448
  defenseR:  24,
  // "Détecté"          : y = 466
  // "X alertes · …"    : y = 482
  bottomY:   540,  // axis line at y=508, tick label at y=528
}
const LEFT_GUTTER = 168
const CANVAS_H = 560

export const TimelineCanvas = ({ model, state }: Props) => {
  const wrapRef = useRef<HTMLDivElement>(null)
  const [size, setSize] = useState({ w: 1400, h: CANVAS_H })

  useEffect(() => {
    const el = wrapRef.current
    if (!el) return
    const ro = new ResizeObserver((entries) => {
      const entry = entries[0]
      if (!entry) return
      setSize({ w: entry.contentRect.width, h: entry.contentRect.height })
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const vp = useMemo(
    () => {
      const v = buildViewport(model.windowStart, model.windowEnd, state.range, size.w, size.h)
      return { ...v, x0: LEFT_GUTTER }
    },
    [model.windowStart, model.windowEnd, state.range, size.w, size.h],
  )

  const ticks = useMemo(() => generateTicks(vp), [vp])
  const [hoverId, setHoverId] = useState<string | null>(null)

  const playheadX = state.playhead == null ? null : vp.x0 + (vp.x1 - vp.x0) * state.playhead
  const beamT = playheadX != null ? xToT(vp, playheadX) : Infinity

  // STRICT visibility — events not yet reached by the playhead are NOT rendered.
  // (Live mode = playhead null = show everything.)
  const visibleAttacks = useMemo(() => {
    return model.attacks
      .filter((a) => {
        const t = Date.parse(a.timestamp)
        if (t < vp.t0 || t > vp.t1) return false
        if (playheadX == null) return true
        return t <= beamT
      })
      .sort((a, b) => a.timestamp.localeCompare(b.timestamp))
  }, [model.attacks, vp.t0, vp.t1, playheadX, beamT])

  // map: attackId → its phase label (for per-event chips)
  const phaseByAttack = useMemo(() => {
    const m = new Map<string, TimelinePhase>()
    for (const p of model.phases) for (const id of p.attackIds) m.set(id, p)
    return m
  }, [model.phases])

  return (
    <div ref={wrapRef} className="relative h-[560px] w-full overflow-hidden">
      <LaneBadge
        title="ATTAQUANT" sub="ce qu'il fait"
        icon={Swords} tint="#ef4444"
        topPx={LAYOUT.attackY}
      />
      <LaneBadge
        title="DÉFENSEUR" sub="ce que voit le SOC"
        icon={ShieldCheck} tint="#3b82f6"
        topPx={LAYOUT.defenseY}
      />

      <svg className="h-full w-full" viewBox={`0 0 ${size.w} ${size.h}`} preserveAspectRatio="none">
        <defs>
          <linearGradient id="attackZone" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#7f1d1d" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#7f1d1d" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="defenseZone" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#0c4a6e" stopOpacity="0" />
            <stop offset="100%" stopColor="#0c4a6e" stopOpacity="0.20" />
          </linearGradient>
          <radialGradient id="hoverHalo" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0%" stopColor="#fff" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#fff" stopOpacity="0" />
          </radialGradient>
          <pattern id="bgGrid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.025)" strokeWidth="1" />
          </pattern>
        </defs>

        {/* zone backgrounds */}
        <rect x={vp.x0} y={LAYOUT.phaseY + 24} width={vp.x1 - vp.x0}
              height={LAYOUT.arcMidY - LAYOUT.phaseY - 24}
              fill="url(#attackZone)" />
        <rect x={vp.x0} y={LAYOUT.arcMidY} width={vp.x1 - vp.x0}
              height={LAYOUT.bottomY - LAYOUT.arcMidY}
              fill="url(#defenseZone)" />
        <rect x={vp.x0} y={LAYOUT.phaseY + 24} width={vp.x1 - vp.x0}
              height={LAYOUT.bottomY - LAYOUT.phaseY - 24}
              fill="url(#bgGrid)" />

        {/* TIME AXIS — strong vertical gridlines + labels */}
        <g>
          {ticks.map((t) => {
            const x = tToX(vp, t)
            return (
              <g key={`tick-${t}`}>
                <line
                  x1={x} x2={x}
                  y1={LAYOUT.phaseY + 24} y2={LAYOUT.bottomY - 30}
                  stroke="rgba(255,255,255,0.06)"
                />
              </g>
            )
          })}
          {/* axis bar near the bottom */}
          <line
            x1={vp.x0} x2={vp.x1}
            y1={LAYOUT.bottomY - 32} y2={LAYOUT.bottomY - 32}
            stroke="rgba(255,255,255,0.22)"
          />
          {ticks.map((t) => {
            const x = tToX(vp, t)
            return (
              <g key={`tk-${t}`}>
                <line x1={x} x2={x}
                      y1={LAYOUT.bottomY - 32} y2={LAYOUT.bottomY - 25}
                      stroke="rgba(255,255,255,0.6)" />
                <text x={x} y={LAYOUT.bottomY - 10}
                      fill="rgba(255,255,255,0.8)"
                      fontFamily="ui-monospace, monospace" fontSize="11.5"
                      textAnchor="middle" letterSpacing="2" fontWeight="500">
                  {formatTick(t, vp.t1 - vp.t0).toUpperCase()}
                </text>
              </g>
            )
          })}
        </g>

        {/* arcs + cards — rendered per visible attack with cascading enter */}
        <AnimatePresence>
          {visibleAttacks.map((atk) => (
            <EventGroup
              key={atk.id}
              atk={atk}
              vp={vp}
              model={model}
              state={state}
              hoverId={hoverId}
              setHoverId={setHoverId}
              phase={phaseByAttack.get(atk.id) ?? null}
              animateCascade={playheadX != null}
            />
          ))}
        </AnimatePresence>

        {/* PLAYHEAD — clean: thin line + dot only, NO glow */}
        {playheadX != null && (
          <g pointerEvents="none">
            <line x1={playheadX} x2={playheadX}
                  y1={LAYOUT.phaseY - 6} y2={LAYOUT.bottomY - 28}
                  stroke="#ef4444" strokeWidth="1.2" strokeOpacity="0.85" />
            <circle cx={playheadX} cy={LAYOUT.bottomY - 32} r="3.5" fill="#ef4444" />
            <circle cx={playheadX} cy={LAYOUT.phaseY - 6} r="3.5" fill="#ef4444" />
          </g>
        )}
      </svg>

      <AnimatePresence>
        {hoverId && <Tooltip model={model} hoverId={hoverId} vp={vp} />}
      </AnimatePresence>
    </div>
  )
}

/* ---------------- per-event group (cascading) ---------------- */

const EventGroup = ({
  atk, vp, model, state, hoverId, setHoverId, phase, animateCascade,
}: {
  atk: AttackEvent
  vp: Viewport
  model: TimelineModel
  state: TimelineState
  hoverId: string | null
  setHoverId: (s: string | null) => void
  phase: TimelinePhase | null
  animateCascade: boolean
}) => {
  const corr = model.correlations.get(atk.id)
  const atkX = tToX(vp, Date.parse(atk.timestamp))

  // delays for cascade — only when story-mode is driving things
  const D = animateCascade
    ? { attack: 0,    arc: 0.30, defense: 0.85, pill: 1.05 }
    : { attack: 0,    arc: 0,    defense: 0,    pill: 0    }

  const story = tellAttack(atk)
  const selectedAtk = state.selection?.kind === 'attack' && state.selection.id === atk.id
  const dimAtk = state.phantom && model.detected.has(atk.id)

  return (
    <motion.g
      key={atk.id}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      {/* attack card */}
      <motion.g
        initial={{ opacity: 0, y: -10, scale: 0.85 }}
        animate={{ opacity: dimAtk ? 0.3 : 1, y: 0, scale: 1 }}
        transition={{ duration: 0.35, delay: D.attack, ease: 'easeOut' }}
        onMouseEnter={() => setHoverId(atk.id)}
        onMouseLeave={() => setHoverId(hoverId === atk.id ? null : hoverId)}
        onClick={(e) => { e.stopPropagation(); state.select({ kind: 'attack', id: atk.id }) }}
        style={{ cursor: 'pointer' }}
      >
        <AttackCard
          x={atkX}
          y={LAYOUT.attackY}
          attack={atk}
          headline={story.headline}
          phaseLabel={phase?.label ?? null}
          selected={selectedAtk}
          hover={hoverId === atk.id}
        />
      </motion.g>

      {/* arc + defense — render only if correlated, OR a missed-defense card */}
      {corr ? (
        <CorrelatedHalf
          atkX={atkX}
          atk={atk}
          corr={corr}
          model={model}
          vp={vp}
          state={state}
          hoverId={hoverId}
          setHoverId={setHoverId}
          delays={D}
        />
      ) : (
        <MissedHalf
          atkX={atkX}
          atkId={atk.id}
          state={state}
          hoverId={hoverId}
          setHoverId={setHoverId}
          delays={D}
        />
      )}
    </motion.g>
  )
}

const CorrelatedHalf = ({
  atkX, atk, corr, model, vp, state, hoverId, setHoverId, delays,
}: {
  atkX: number
  atk: AttackEvent
  corr: NonNullable<ReturnType<TimelineModel['correlations']['get']>>
  model: TimelineModel
  vp: Viewport
  state: TimelineState
  hoverId: string | null
  setHoverId: (s: string | null) => void
  delays: { attack: number; arc: number; defense: number; pill: number }
}) => {
  const anchor = corr.alertIds
    .map((id) => model.alerts.find((a) => a.id === id))
    .filter((a): a is TimelineAlert => !!a)
    .sort((a, b) => b.level - a.level)[0]
  if (!anchor) return null

  const bx = tToX(vp, Date.parse(anchor.ts))
  const color = SEVERITY_HEX[corr.severity]
  const dim = state.phantom
  const selectedAlert = state.selection?.kind === 'alert' && state.selection.id === anchor.id
  const arcD = arcPath(atkX, LAYOUT.arcStartY, bx, LAYOUT.arcEndY)

  return (
    <>
      {/* arc — animates pathLength 0→1 */}
      <g opacity={dim ? 0.25 : 1}>
        <motion.path
          d={arcD}
          fill="none"
          stroke={color}
          strokeWidth={6}
          strokeOpacity="0.20"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.55, delay: delays.arc, ease: 'easeOut' }}
        />
        <motion.path
          d={arcD}
          fill="none"
          stroke={color}
          strokeWidth={hoverId === atk.id ? 2.6 : 1.8}
          strokeOpacity={0.95}
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.55, delay: delays.arc, ease: 'easeOut' }}
        />
      </g>

      {/* reaction pill — appears with the defense */}
      <motion.g
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: dim ? 0.4 : 1, scale: 1 }}
        transition={{ duration: 0.3, delay: delays.pill, ease: 'easeOut' }}
      >
        <ReactionPill x={(atkX + bx) / 2} y={LAYOUT.arcMidY} lagMs={corr.lagMs} />
      </motion.g>

      {/* defense card */}
      <motion.g
        initial={{ opacity: 0, y: 10, scale: 0.85 }}
        animate={{ opacity: dim ? 0.3 : 1, y: 0, scale: 1 }}
        transition={{ duration: 0.35, delay: delays.defense, ease: 'easeOut' }}
        style={{ cursor: 'pointer' }}
        onMouseEnter={() => setHoverId(anchor.id)}
        onMouseLeave={() => setHoverId(hoverId === anchor.id ? null : hoverId)}
        onClick={(e) => { e.stopPropagation(); state.select({ kind: 'alert', id: anchor.id }) }}
      >
        <DefenseCard
          x={bx}
          y={LAYOUT.defenseY}
          severity={corr.severity}
          count={corr.alertIds.length}
          selected={selectedAlert}
          hover={hoverId === anchor.id}
        />
      </motion.g>
    </>
  )
}

const MissedHalf = ({
  atkX, atkId, state, hoverId, setHoverId, delays,
}: {
  atkX: number
  atkId: string
  state: TimelineState
  hoverId: string | null
  setHoverId: (s: string | null) => void
  delays: { attack: number; arc: number; defense: number; pill: number }
}) => {
  const arcD = arcPath(atkX, LAYOUT.arcStartY, atkX, LAYOUT.arcEndY)
  return (
    <>
      <motion.path
        d={arcD}
        fill="none"
        stroke="#ef4444"
        strokeWidth="1.5"
        strokeDasharray="4 6"
        strokeOpacity="0.65"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.55, delay: delays.arc, ease: 'easeOut' }}
      />
      <motion.g
        initial={{ opacity: 0, y: 10, scale: 0.85 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.35, delay: delays.defense, ease: 'easeOut' }}
        onMouseEnter={() => setHoverId(atkId)}
        onMouseLeave={() => setHoverId(hoverId === atkId ? null : hoverId)}
        onClick={(e) => { e.stopPropagation(); state.select({ kind: 'attack', id: atkId }) }}
        style={{ cursor: 'pointer' }}
      >
        <DefenseMissed x={atkX} y={LAYOUT.defenseY} pulse={hoverId === atkId} />
      </motion.g>
    </>
  )
}

/* ---------------- HTML lane badge ---------------- */

const LaneBadge = ({ title, sub, icon: Icon, tint, topPx }: {
  title: string; sub: string; icon: LucideIcon; tint: string; topPx: number;
}) => (
  <div
    className="pointer-events-none absolute left-3 z-[1] flex w-[150px] -translate-y-1/2 items-center gap-2.5 rounded-md border bg-black/45 px-2.5 py-2 backdrop-blur-sm"
    style={{ top: `${topPx}px`, borderColor: `${tint}55` }}
  >
    <div
      className="grid size-8 shrink-0 place-items-center rounded-full"
      style={{ background: `${tint}22`, color: tint, border: `1px solid ${tint}80` }}
    >
      <Icon size={15} strokeWidth={1.9} />
    </div>
    <div className="min-w-0 leading-tight">
      <div className="font-mono text-[10px] tracking-[0.18em] uppercase font-semibold" style={{ color: tint }}>
        {title}
      </div>
      <div className="mt-0.5 truncate font-mono text-[9px] tracking-[0.06em] uppercase text-gray-400">
        {sub}
      </div>
    </div>
  </div>
)

/* ---------------- attack card ---------------- */

const AttackCard = ({ x, y, attack, headline, phaseLabel, selected, hover }: {
  x: number; y: number; attack: AttackEvent; headline: string;
  phaseLabel: string | null;
  selected: boolean; hover: boolean;
}) => {
  const tint = TOOL_META[attack.tool].tint
  const Icon = TOOL_ICON_COMPONENT[attack.tool]
  const r = LAYOUT.attackR
  const lit = selected || hover
  return (
    <g>
      {/* per-event phase chip — sized to label, renders ABOVE the tool tag */}
      {phaseLabel && (() => {
        const upper = phaseLabel.toUpperCase()
        const chipW = Math.max(96, upper.length * 6.6 + 20)
        return (
          <g>
            <rect
              x={x - chipW / 2} y={LAYOUT.phaseY - 10} width={chipW} height={18} rx={9}
              fill="rgba(168,85,247,0.16)"
              stroke="rgba(168,85,247,0.5)"
              strokeWidth="0.8"
            />
            <text
              x={x} y={LAYOUT.phaseY + 3}
              fill="rgba(233,213,255,0.95)"
              fontFamily="ui-monospace, monospace" fontSize="9"
              fontWeight="700" letterSpacing="1.8"
              textAnchor="middle"
            >
              {upper}
            </text>
          </g>
        )
      })()}

      {/* halos */}
      {lit && <circle cx={x} cy={y} r={r + 18} fill="url(#hoverHalo)" />}
      <circle cx={x} cy={y} r={r + 4} fill="none" stroke={tint}
              strokeOpacity={lit ? 0.75 : 0.3} />
      {/* card body */}
      <circle cx={x} cy={y} r={r} fill="#0a0e1a" stroke={tint} strokeWidth="1.7" />
      <circle cx={x} cy={y} r={r} fill={tint} fillOpacity="0.16" />
      {/* custom tool icon */}
      <foreignObject x={x - 14} y={y - 14} width="28" height="28">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
          <Icon color={tint} size={24} />
        </div>
      </foreignObject>
      {/* tool tag (above card) */}
      <text x={x} y={y - r - 10} fill={tint}
            fontFamily="ui-monospace, monospace" fontSize="9.5" textAnchor="middle"
            letterSpacing="1.6" fontWeight="700">
        {attack.tool.toUpperCase()}
      </text>
      {/* headline (below card) */}
      <text x={x} y={y + r + 22} fill="#fff"
            fontFamily="ui-sans-serif, system-ui" fontSize="12.5" textAnchor="middle" fontWeight="600">
        {headline}
      </text>
      {/* target (below headline, but ABOVE arc origin so no crossing) */}
      <text x={x} y={y + r + 40} fill="rgba(255,255,255,0.65)"
            fontFamily="ui-monospace, monospace" fontSize="10" textAnchor="middle" letterSpacing="0.6">
        cible · {attack.target}
      </text>
    </g>
  )
}

const DefenseCard = ({ x, y, severity, count, selected, hover }: {
  x: number; y: number; severity: keyof typeof SEVERITY_HEX; count: number;
  selected: boolean; hover: boolean;
}) => {
  const tint = SEVERITY_HEX[severity]
  const w = LAYOUT.defenseR
  const lit = selected || hover
  return (
    <g>
      {lit && <circle cx={x} cy={y} r={w + 18} fill="url(#hoverHalo)" />}
      <path d={shieldPath(x, y, w)} fill="#0a0e1a" stroke={tint} strokeWidth="1.7" />
      <path d={shieldPath(x, y, w)} fill={tint} fillOpacity="0.20" />
      <foreignObject x={x - 11} y={y - 11} width="22" height="22">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
          <ShieldCheck size={18} color={tint} strokeWidth={2.2} />
        </div>
      </foreignObject>
      <text x={x} y={y + w + 18} fill="#fff"
            fontFamily="ui-sans-serif, system-ui" fontSize="12" textAnchor="middle" fontWeight="600">
        Détecté
      </text>
      <text x={x} y={y + w + 34} fill="rgba(255,255,255,0.68)"
            fontFamily="ui-monospace, monospace" fontSize="10" textAnchor="middle" letterSpacing="0.6">
        {count} alerte{count > 1 ? 's' : ''} · {severity}
      </text>
    </g>
  )
}

const DefenseMissed = ({ x, y, pulse }: { x: number; y: number; pulse: boolean }) => {
  const w = LAYOUT.defenseR - 2
  return (
    <g>
      {pulse && <circle cx={x} cy={y} r={w + 14} fill="url(#hoverHalo)" />}
      <circle cx={x} cy={y} r={w} fill="#0a0e1a" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="3 3" />
      <foreignObject x={x - 11} y={y - 11} width="22" height="22">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
          <ShieldAlert size={18} color="#ef4444" strokeWidth={2.2} />
        </div>
      </foreignObject>
      <motion.circle
        cx={x} cy={y} r={w}
        fill="none" stroke="#ef4444" strokeWidth="1"
        animate={{ r: [w, w + 8], opacity: [0.6, 0] }}
        transition={{ duration: 1.4, repeat: Infinity, ease: 'easeOut' }}
      />
      <text x={x} y={y + w + 18} fill="#fca5a5"
            fontFamily="ui-sans-serif, system-ui" fontSize="12" textAnchor="middle" fontWeight="600">
        Non détecté
      </text>
      <text x={x} y={y + w + 34} fill="rgba(252,165,165,0.78)"
            fontFamily="ui-monospace, monospace" fontSize="10" textAnchor="middle" letterSpacing="0.6">
        angle mort
      </text>
    </g>
  )
}

const ReactionPill = ({ x, y, lagMs }: { x: number; y: number; lagMs: number }) => {
  const r = reactionLabel(lagMs)
  const tint =
    r.tone === 'fast' ? '#22c55e' :
    r.tone === 'ok'   ? '#84cc16' :
    r.tone === 'slow' ? '#f59e0b' : '#ef4444'
  const text = formatLag(lagMs)
  const w = 64
  return (
    <g>
      <rect x={x - w / 2} y={y - 10} width={w} height={20} rx={10}
            fill="#0a0e1a" stroke={tint} strokeWidth="1.3" />
      <rect x={x - w / 2} y={y - 10} width={w} height={20} rx={10}
            fill={tint} fillOpacity="0.22" />
      <text x={x} y={y + 4.5} fill="#fff"
            fontFamily="ui-monospace, monospace" fontSize="11"
            textAnchor="middle" fontWeight="700">
        {r.emoji} {text}
      </text>
    </g>
  )
}

const shieldPath = (x: number, y: number, r: number): string =>
  `M ${x} ${y - r}
   L ${x + r * 0.95} ${y - r * 0.4}
   L ${x + r * 0.7} ${y + r * 0.85}
   L ${x} ${y + r}
   L ${x - r * 0.7} ${y + r * 0.85}
   L ${x - r * 0.95} ${y - r * 0.4}
   Z`

const Tooltip = ({ model, hoverId, vp }: { model: TimelineModel; hoverId: string; vp: Viewport }) => {
  const atk = model.attacks.find((a) => a.id === hoverId)
  const al = atk ? null : model.alerts.find((a) => a.id === hoverId)
  if (!atk && !al) return null

  const t = atk ? Date.parse(atk.timestamp) : Date.parse(al!.ts)
  const x = Math.min(vp.x1 - 240, Math.max(vp.x0, tToX(vp, t) - 110))
  const y = atk ? LAYOUT.attackY - 130 : LAYOUT.defenseY + 70
  const corr = atk ? model.correlations.get(atk.id) : null
  const story = atk ? tellAttack(atk) : null

  return (
    <motion.div
      key={hoverId}
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.12 }}
      style={{ position: 'absolute', left: x, top: y, pointerEvents: 'none' }}
      className="z-10 w-60 rounded-md border border-white/10 bg-black/90 p-3 shadow-xl backdrop-blur-sm"
    >
      {atk && story && (
        <div className="space-y-2">
          <div className="text-[12px] font-semibold leading-tight text-white">{story.headline}</div>
          <div className="text-[11px] leading-snug text-gray-300">{story.blurb}</div>
          {corr ? (
            <div className="flex items-center justify-between rounded-sm bg-green-500/10 px-2 py-1">
              <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-green-300">détecté en</span>
              <span className="font-mono text-[10px] tabular-nums text-white">{formatLag(corr.lagMs)}</span>
            </div>
          ) : (
            <div className="rounded-sm bg-red-500/10 px-2 py-1 font-mono text-[9px] uppercase tracking-[0.25em] text-red-300">
              non détecté
            </div>
          )}
          <div className="border-t border-white/10 pt-1 font-mono text-[9px] text-gray-400 break-all">{atk.command}</div>
        </div>
      )}
      {al && (
        <div className="space-y-1.5">
          <div className="font-mono text-[9px] uppercase tracking-[0.3em]" style={{ color: SEVERITY_HEX[al.severity] }}>
            alerte · {al.severity}
          </div>
          <div className="text-[11px] leading-snug text-gray-200">{al.description}</div>
        </div>
      )}
    </motion.div>
  )
}
