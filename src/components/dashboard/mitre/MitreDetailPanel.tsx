import { motion, AnimatePresence } from 'framer-motion'
import { X, ExternalLink, Activity, ShieldAlert, Clock } from 'lucide-react'
import { tacticById } from '@/data/mitre-matrix'
import { NeonEdge } from '@/components/ui/NeonEdge'
import type { CellStat } from './types'

interface DetailProps {
  cell: CellStat | null
  onClose: () => void
}

const fmtAge = (ts: number | null): string => {
  if (ts == null) return '—'
  const d = Date.now() - ts
  if (d < 60_000) return `${Math.floor(d / 1000)} s`
  if (d < 3_600_000) return `${Math.floor(d / 60_000)} min`
  if (d < 86_400_000) return `${Math.floor(d / 3_600_000)} h`
  return `${Math.floor(d / 86_400_000)} j`
}

const sevLabel = (n: number): string =>
  n >= 12 ? 'Critique' : n >= 9 ? 'Haute' : n >= 6 ? 'Moyenne' : n >= 3 ? 'Basse' : '—'

const sevTone = (n: number): string =>
  n >= 12 ? 'text-red-300' : n >= 9 ? 'text-red-300' : n >= 6 ? 'text-amber-300' : n >= 3 ? 'text-emerald-300' : 'text-white/55'

export const MitreDetailPanel = ({ cell, onClose }: DetailProps) => {
  return (
    <AnimatePresence>
      {cell && (
        <motion.section
          key="mitre-detail"
          initial={{ opacity: 0, y: 16, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="relative overflow-hidden rounded-lg border border-red-500/30 bg-gradient-to-br from-purple-950/40 via-black/60 to-red-950/40 p-5"
        >
          <NeonEdge color="#ef4444" intensity="bright" />
          <div className="absolute -right-20 -top-20 size-60 rounded-full bg-red-500/15 blur-3xl" />
          <div className="absolute -bottom-24 -left-20 size-60 rounded-full bg-purple-500/15 blur-3xl" />

          {/* fixed close button — sits outside the cross-fading region */}
          <button
            onClick={onClose}
            aria-label="Fermer"
            className="absolute right-4 top-4 z-10 rounded-sm p-1 text-gray-500 hover:bg-white/5 hover:text-white"
          >
            <X size={14} />
          </button>

          {/* cell-specific content cross-fades when user clicks another square */}
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={cell.technique.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
              className="relative"
            >
              <header className="mb-5 pr-8">
                <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-red-300">
                  {tacticById(cell.technique.tactic)?.name}
                </p>
                <h3 className="mt-1 font-cinematic text-xl uppercase tracking-wide text-white">
                  {cell.technique.name}
                </h3>
                <p className="mt-0.5 font-mono text-[11px] text-white/40">{cell.technique.id}</p>
              </header>

              <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                <Card
                  icon={<Activity size={14} className="text-red-400" />}
                  kicker="alertes"
                  kickerTone="text-red-300"
                >
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="font-mono text-4xl tabular-nums text-white">
                      {cell.alertCount}
                    </span>
                    {cell.alertCount > 0 && (
                      <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/50">
                        détectées
                      </span>
                    )}
                  </div>
                  <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.2em] text-gray-500">
                    {cell.redTeamHits > 0
                      ? `red-team · ${cell.redTeamHits} run(s)`
                      : 'pas d’exercice associé'}
                  </p>
                </Card>

                <Card
                  icon={<ShieldAlert size={14} className="text-amber-400" />}
                  kicker="sévérité max"
                  kickerTone="text-amber-300"
                >
                  <div className={`mt-2 font-mono text-3xl tabular-nums ${sevTone(cell.severityMax)}`}>
                    {sevLabel(cell.severityMax)}
                  </div>
                  <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.2em] text-gray-500">
                    niveau wazuh · {cell.severityMax || '—'}
                  </p>
                </Card>

                <Card
                  icon={<Clock size={14} className="text-purple-300" />}
                  kicker="dernière"
                  kickerTone="text-purple-300"
                  accent={cell.redTeamHits > 0 && cell.alertCount === 0}
                >
                  <div className="mt-2 font-mono text-3xl tabular-nums text-white">
                    {fmtAge(cell.lastHitAt)}
                  </div>
                  <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.2em] text-gray-500">
                    {cell.redTeamHits > 0 && cell.alertCount === 0 ? 'angle mort détecté' : 'depuis dernier hit'}
                  </p>
                </Card>
              </div>

              {(cell.topRule || cell.topSrcIps.length > 0) && (
                <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
                  {cell.topRule && (
                    <div className="rounded-md border border-white/5 bg-black/40 p-3 md:col-span-2">
                      <p className="mb-1.5 font-mono text-[9px] uppercase tracking-[0.3em] text-white/40">
                        Règle exemple
                      </p>
                      <p className="font-mono text-[12px] leading-relaxed text-white/85">
                        {cell.topRule}
                      </p>
                    </div>
                  )}
                  {cell.topSrcIps.length > 0 && (
                    <div className="rounded-md border border-white/5 bg-black/40 p-3">
                      <p className="mb-1.5 font-mono text-[9px] uppercase tracking-[0.3em] text-white/40">
                        Sources
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {cell.topSrcIps.map((ip) => (
                          <span
                            key={ip}
                            className="rounded bg-white/[0.04] px-2 py-0.5 font-mono text-[11px] text-white/80"
                          >
                            {ip}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="mt-4 flex flex-wrap items-center gap-2">
                <a
                  href={`https://attack.mitre.org/techniques/${cell.technique.id.replace('.', '/')}/`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-md border border-red-500/60 bg-red-500/15 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.25em] text-red-200 hover:border-red-400 hover:bg-red-500/25"
                >
                  attack.mitre.org
                  <ExternalLink size={11} />
                </a>
                <button
                  onClick={onClose}
                  className="inline-flex items-center gap-1.5 rounded-md border border-white/10 bg-white/[0.03] px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.25em] text-gray-300 hover:border-white/25 hover:text-white"
                >
                  Fermer
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </motion.section>
      )}
    </AnimatePresence>
  )
}

interface CardProps {
  icon: React.ReactNode
  kicker: string
  kickerTone: string
  accent?: boolean
  children: React.ReactNode
}

const Card = ({ icon, kicker, kickerTone, accent, children }: CardProps) => (
  <div
    className={`rounded-md border p-4 ${
      accent ? 'border-red-500/30 bg-red-500/10' : 'border-white/5 bg-black/40'
    }`}
  >
    <div className="flex items-center gap-2">
      {icon}
      <span className={`font-mono text-[9px] uppercase tracking-[0.3em] ${kickerTone}`}>
        {kicker}
      </span>
    </div>
    {children}
  </div>
)
