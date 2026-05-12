import { motion, AnimatePresence } from 'framer-motion'
import {
  X, ShieldAlert, ShieldCheck,
  Copy, Check, FileCode, MapPin, GitBranch, Server,
  CheckCircle2, Circle,
} from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { SEVERITY_HEX, formatLag, lagTone, tellAttack, type TimelineModel } from '@/lib/timeline'
import { useUiStore } from '@/store/useUiStore'
import { TOOL_ICON_COMPONENT } from './TimelineIcons'
import type { TimelineState } from './state'

interface Props {
  model: TimelineModel
  state: TimelineState
}

export const TimelineDetail = ({ model, state }: Props) => {
  const sel = state.selection
  const atk = sel?.kind === 'attack' ? model.attacks.find((a) => a.id === sel.id) : null
  const al = sel?.kind === 'alert' ? model.alerts.find((a) => a.id === sel.id) : null
  const corr = atk ? model.correlations.get(atk.id) : null
  const reverseCorr = al
    ? [...model.correlations.values()].find((c) => c.alertIds.includes(al.id))
    : null
  const counterpartAttack = reverseCorr
    ? model.attacks.find((a) => a.id === reverseCorr.attackId)
    : null

  // Keep the aside mounted across selection changes so re-clicks don't unmount
  // the entire panel. Only the inner content crossfades.
  return (
    <AnimatePresence initial={false}>
      {sel && (
        <motion.aside
          key="detail-panel"
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 24 }}
          transition={{ duration: 0.32, ease: [0.32, 0.72, 0, 1] }}
          className="flex w-full flex-col rounded-lg border border-white/[0.06] bg-black/20 backdrop-blur-sm lg:w-[420px]"
        >
          <header className="flex items-center justify-between border-b border-white/5 px-4 py-3">
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={atk ? 'h-attack' : 'h-alert'}
                initial={{ opacity: 0, y: -2 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 2 }}
                transition={{ duration: 0.16 }}
                className="font-mono text-[10px] tracking-[0.3em] uppercase text-red-400"
              >
                {atk ? 'attaque' : 'détection'}
              </motion.span>
            </AnimatePresence>
            <button
              onClick={() => state.select(null)}
              className="rounded-sm p-1 text-gray-500 transition-colors hover:bg-white/5 hover:text-white"
              aria-label="Fermer"
            >
              <X size={14} />
            </button>
          </header>

          <div className="relative flex-1 overflow-auto">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={sel.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.18, ease: [0.22, 0.61, 0.36, 1] }}
                className="space-y-5 px-4 py-4"
              >
                {atk && (
                  <AttackDetailBody
                    attack={atk}
                    corr={corr ?? undefined}
                    model={model}
                    state={state}
                  />
                )}
                {al && (
                  <AlertDetailBody
                    alert={al}
                    reverseCorr={reverseCorr ?? null}
                    counterpartAttack={counterpartAttack ?? undefined}
                    state={state}
                    model={model}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  )
}

/* ---------- attack body ---------- */

const AttackDetailBody = ({ attack, corr, model, state }: {
  attack: NonNullable<ReturnType<TimelineModel['attacks']['find']>>
  corr: ReturnType<TimelineModel['correlations']['get']>
  model: TimelineModel
  state: TimelineState
}) => {
  const Icon = TOOL_ICON_COMPONENT[attack.tool]
  const story = tellAttack(attack)
  const navigate = useNavigate()
  const authorized = useUiStore((s) => s.authorizedAttackIds.has(attack.id))
  const toggleAuth = useUiStore((s) => s.toggleAuthorized)
  const [showRaw, setShowRaw] = useState(false)
  const tint = corr ? SEVERITY_HEX[corr.severity] : '#a855f7'

  // Try to enrich from the dominant matched alert (for srcIp / agent display)
  const dominantAlert = corr?.alertIds
    .map((id) => model.alerts.find((a) => a.id === id))
    .find((a) => a?.srcIp)

  return (
    <>
      {/* header */}
      <div className="flex items-start gap-3">
        <div
          className="grid size-12 shrink-0 place-items-center rounded-md border"
          style={{ borderColor: `${tint}66`, background: `${tint}16` }}
        >
          <Icon color={tint} size={26} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="font-cinematic text-base uppercase tracking-wide text-white">{story.headline}</div>
          <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-gray-500">
            {attack.tool} · cible {attack.target}
          </div>
          <div className="mt-1 font-mono text-[10px] text-gray-400">
            {new Date(attack.timestamp).toLocaleString('fr-FR')}
          </div>
        </div>
        {authorized && (
          <span className="rounded-sm bg-purple-500/20 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.18em] text-purple-300">
            exercice
          </span>
        )}
      </div>

      <p className="text-[12.5px] leading-relaxed text-gray-300">{story.blurb}</p>

      {corr
        ? <DetectionVerdict lag={corr.lagMs} reasons={corr.reasons} />
        : <BlindspotVerdict mitre={attack.mitre} />}

      {/* command */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[9.5px] uppercase tracking-[0.28em] text-gray-500">commande</span>
          <CopyButton text={attack.command} />
        </div>
        <pre className="overflow-x-auto rounded-md border border-white/10 bg-black/60 px-3 py-2 font-mono text-[11px] leading-relaxed text-gray-200">
          {attack.command}
        </pre>
        <button
          onClick={() => setShowRaw((v) => !v)}
          className="inline-flex items-center gap-1.5 font-mono text-[9.5px] uppercase tracking-[0.22em] text-gray-500 transition-colors hover:text-white"
        >
          <FileCode size={11} />
          {showRaw ? 'Masquer JSON' : 'JSON brut'}
        </button>
        {showRaw && (
          <pre className="max-h-48 overflow-auto rounded-md border border-white/10 bg-black/60 p-3 font-mono text-[10px] leading-relaxed text-gray-300">
            {JSON.stringify(attack, null, 2)}
          </pre>
        )}
      </div>

      {/* mitre + alerts inline */}
      {attack.mitre?.length ? (
        <div className="flex flex-wrap gap-1.5">
          {attack.mitre.map((t) => (
            <button
              key={t}
              onClick={() => state.setTechnique(t.split('.')[0] ?? null)}
              className="rounded-sm border border-purple-500/30 bg-purple-500/15 px-1.5 py-0.5 font-mono text-[10px] text-purple-300 transition-colors hover:border-purple-400/60 hover:bg-purple-500/25"
              title="Filtrer la timeline"
            >
              {t}
            </button>
          ))}
        </div>
      ) : null}

      {corr && (
        <div className="space-y-1.5">
          <span className="font-mono text-[9.5px] uppercase tracking-[0.28em] text-gray-500">
            {corr.alertIds.length} alerte{corr.alertIds.length > 1 ? 's' : ''}
          </span>
          <div className="space-y-1">
            {corr.alertIds.map((id) => {
              const a = model.alerts.find((x) => x.id === id)
              if (!a) return null
              return (
                <button
                  key={id}
                  onClick={() => state.select({ kind: 'alert', id })}
                  className="flex w-full items-start gap-2 rounded-sm border border-white/5 bg-white/[0.02] px-2 py-1.5 text-left transition-colors hover:border-white/15 hover:bg-white/[0.05]"
                >
                  <span
                    className="mt-1 size-2 shrink-0 rounded-full"
                    style={{ background: SEVERITY_HEX[a.severity] }}
                  />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[11px] text-gray-200">{a.description}</span>
                    <span className="font-mono text-[9px] tracking-wider text-gray-500">
                      {a.ruleId} · {a.severity}
                    </span>
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* actions — no header */}
      <div className="grid grid-cols-2 gap-1.5 border-t border-white/5 pt-3">
        {dominantAlert?.srcIp && (
          <ActionBtn icon={MapPin} label="Carte" onClick={() => navigate(`/dashboard/map?ip=${dominantAlert.srcIp}`)} />
        )}
        {attack.mitre?.[0] && (
          <ActionBtn icon={GitBranch} label="MITRE" onClick={() => navigate(`/dashboard/mitre?t=${attack.mitre![0]}`)} />
        )}
        <ActionBtn icon={Server} label="Couverture" onClick={() => navigate(`/dashboard/coverage?host=${attack.target}`)} />
        <ActionBtn
          icon={authorized ? CheckCircle2 : Circle}
          label={authorized ? 'Autorisé' : 'Marquer autorisé'}
          onClick={() => toggleAuth(attack.id)}
          active={authorized}
        />
      </div>
    </>
  )
}

/* ---------- alert body ---------- */

const AlertDetailBody = ({ alert, reverseCorr, counterpartAttack, state, model }: {
  alert: NonNullable<ReturnType<TimelineModel['alerts']['find']>>
  reverseCorr: ReturnType<typeof Array.prototype.find> | null
  counterpartAttack: ReturnType<TimelineModel['attacks']['find']>
  state: TimelineState
  model: TimelineModel
}) => {
  void model
  const navigate = useNavigate()
  const tint = SEVERITY_HEX[alert.severity]
  const [showRaw, setShowRaw] = useState(false)

  return (
    <>
      <div className="flex items-start gap-3">
        <div className="grid size-12 shrink-0 place-items-center rounded-md border" style={{ borderColor: `${tint}66`, background: `${tint}16`, color: tint }}>
          <ShieldAlert size={22} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-sm font-medium leading-tight text-white">{alert.description}</div>
          <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-gray-500">
            règle {alert.ruleId} · {alert.severity}
          </div>
          <div className="mt-1 font-mono text-[10px] text-gray-400">
            {new Date(alert.ts).toLocaleString('fr-FR')}
          </div>
        </div>
      </div>

      {counterpartAttack && reverseCorr ? (
        <DetectionVerdict
          lag={(reverseCorr as { lagMs: number }).lagMs}
          reasons={(reverseCorr as { reasons?: string[] }).reasons}
        />
      ) : (
        <p className="font-mono text-[11px] leading-relaxed text-gray-400">
          Alerte autonome — sans attaque corrélée.
        </p>
      )}

      <Meta items={[
        ['Agent', alert.agent ?? '—'],
        ['Source IP', alert.srcIp ?? '—'],
        ['Niveau', String(alert.level)],
        ['Règle', alert.ruleId],
      ]} />

      {alert.techniques.length ? (
        <div className="flex flex-wrap gap-1.5">
          {alert.techniques.map((t) => (
            <button
              key={t}
              onClick={() => state.setTechnique(t.split('.')[0] ?? null)}
              className="rounded-sm border border-purple-500/30 bg-purple-500/15 px-1.5 py-0.5 font-mono text-[10px] text-purple-300 transition-colors hover:border-purple-400/60"
            >
              {t}
            </button>
          ))}
        </div>
      ) : null}

      {counterpartAttack && (
        <button
          onClick={() => state.select({ kind: 'attack', id: counterpartAttack.id })}
          className="flex w-full items-start gap-2 rounded-sm border border-white/5 bg-white/[0.02] px-2 py-1.5 text-left transition-colors hover:border-white/15 hover:bg-white/[0.05]"
        >
          <span className="font-mono text-[10px] text-purple-300">{counterpartAttack.tool}</span>
          <span className="min-w-0 flex-1 truncate font-mono text-[10px] text-gray-300">
            {counterpartAttack.command}
          </span>
        </button>
      )}

      <button
        onClick={() => setShowRaw((v) => !v)}
        className="inline-flex items-center gap-1.5 font-mono text-[9.5px] uppercase tracking-[0.22em] text-gray-500 transition-colors hover:text-white"
      >
        <FileCode size={11} />
        {showRaw ? 'Masquer JSON' : 'JSON brut'}
      </button>
      {showRaw && (
        <pre className="max-h-56 overflow-auto rounded-md border border-white/10 bg-black/60 p-3 font-mono text-[10px] leading-relaxed text-gray-300">
          {JSON.stringify(alert.raw ?? alert, null, 2)}
        </pre>
      )}

      {/* actions */}
      <div className="grid grid-cols-2 gap-1.5 border-t border-white/5 pt-3">
        {alert.srcIp && (
          <ActionBtn icon={MapPin} label="Carte" onClick={() => navigate(`/dashboard/map?ip=${alert.srcIp}`)} />
        )}
        {alert.techniques[0] && (
          <ActionBtn icon={GitBranch} label="MITRE" onClick={() => navigate(`/dashboard/mitre?t=${alert.techniques[0]}`)} />
        )}
        {alert.agent && (
          <ActionBtn icon={Server} label="Couverture" onClick={() => navigate(`/dashboard/coverage?host=${alert.agent}`)} />
        )}
        <ActionBtn icon={Copy} label="Copier règle" onClick={() => navigator.clipboard?.writeText(alert.ruleId)} />
      </div>
    </>
  )
}

/* ---------- shared ---------- */

const DetectionVerdict = ({ lag, reasons }: { lag: number; reasons?: string[] }) => {
  const tone = lagTone(lag)
  const tint = tone === 'fast' ? '#22c55e' : tone === 'ok' ? '#84cc16' : tone === 'slow' ? '#f59e0b' : '#ef4444'
  const label = tone === 'fast' ? 'Rapide' : tone === 'ok' ? 'Acceptable' : tone === 'slow' ? 'Lente' : 'Très lente'
  const ratio = Math.min(1, lag / 30_000)
  return (
    <section className="space-y-2 rounded-md border border-green-500/20 bg-green-500/[0.05] px-3 py-2.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <ShieldCheck size={13} className="text-green-400" />
          <span className="font-mono text-[10px] tracking-[0.28em] uppercase text-green-300">{label}</span>
        </div>
        <span className="font-mono text-xs tabular-nums text-white">{formatLag(lag)}</span>
      </div>
      <div className="relative h-1.5 overflow-hidden rounded-full bg-white/5">
        <div
          className="absolute inset-y-0 left-0 rounded-full transition-[width] duration-500"
          style={{ width: `${ratio * 100}%`, background: `linear-gradient(90deg, #22c55e, ${tint})` }}
        />
      </div>
      {reasons?.length ? (
        <p className="font-mono text-[9.5px] leading-snug text-gray-500">
          {reasons.join(' · ')}
        </p>
      ) : null}
    </section>
  )
}

const BlindspotVerdict = ({ mitre }: { mitre?: string[] }) => (
  <section className="rounded-md border border-red-500/30 bg-red-500/[0.07] px-3 py-3">
    <div className="flex items-center gap-1.5">
      <ShieldAlert size={14} className="text-red-400" />
      <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-red-300">angle mort</span>
    </div>
    <p className="mt-2 text-[11px] leading-relaxed text-red-200/80">
      Aucune alerte corrélée dans la fenêtre de détection.
      {mitre?.[0] ? ` Vérifier les règles couvrant ${mitre[0]}.` : ' Vérifier la couverture des règles.'}
    </p>
  </section>
)

const Meta = ({ items }: { items: [string, string][] }) => (
  <dl className="grid grid-cols-2 gap-1.5">
    {items.map(([k, v]) => (
      <div key={k} className="rounded-sm border border-white/5 bg-white/[0.02] px-2 py-1.5">
        <dt className="font-mono text-[9px] uppercase tracking-[0.25em] text-gray-500">{k}</dt>
        <dd className="mt-0.5 truncate font-mono text-[11px] text-gray-200">{v}</dd>
      </div>
    ))}
  </dl>
)

const CopyButton = ({ text }: { text: string }) => {
  const [copied, setCopied] = useState(false)
  const onCopy = async () => {
    try { await navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 1500) }
    catch { /* clipboard blocked */ }
  }
  return (
    <button
      onClick={onCopy}
      className="inline-flex items-center gap-1 rounded-sm border border-white/10 bg-white/[0.03] px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.22em] text-gray-300 hover:border-white/25 hover:text-white"
    >
      {copied ? <Check size={10} className="text-green-400" /> : <Copy size={10} />}
      {copied ? 'copié' : 'copier'}
    </button>
  )
}

const ActionBtn = ({ icon: Icon, label, onClick, active }: {
  icon: React.ComponentType<{ size?: number; className?: string }>
  label: string
  onClick: () => void
  active?: boolean
}) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-1.5 rounded-md border px-2 py-1.5 font-mono text-[10px] uppercase tracking-[0.18em] transition-colors ${
      active
        ? 'border-purple-500/50 bg-purple-500/15 text-purple-200'
        : 'border-white/10 bg-white/[0.03] text-gray-300 hover:border-white/25 hover:text-white'
    }`}
  >
    <Icon size={11} />
    <span className="truncate">{label}</span>
  </button>
)
