import { Activity, Play, RefreshCw } from 'lucide-react'
import { motion } from 'framer-motion'
import { useStreamStore } from '@/store/streamStore'
import { useUiStore } from '@/store/useUiStore'
import { useLogStore } from '@/store/useLogStore'

interface Props {
  /** show the prominent CTA — true when there are no attacks loaded yet. */
  prominent?: boolean
}

export const LiveStatusBanner = ({ prominent }: Props) => {
  const status = useStreamStore((s) => s.status)
  const injectScenario = useUiStore((s) => s.injectScenario)
  const streamAlerts = useStreamStore((s) => s.alerts.length)
  const wazuhAlerts = useLogStore((s) => s.alerts.length)
  const totalAlerts = streamAlerts + wazuhAlerts

  const statusLabel =
    status === 'open' ? 'connecté'
    : status === 'connecting' ? 'connexion…'
    : status === 'error' ? 'erreur connexion'
    : status === 'closed' ? 'flux fermé'
    : 'inactif'

  const statusTint =
    status === 'open' ? '#22c55e'
    : status === 'connecting' ? '#f59e0b'
    : status === 'error' ? '#ef4444'
    : '#6b7280'

  return (
    <motion.div
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className={`relative overflow-hidden rounded-lg border backdrop-blur-sm ${prominent ? 'border-red-500/40 bg-gradient-to-r from-red-950/30 via-black/20 to-purple-950/30 p-5' : 'border-white/[0.06] bg-black/20 p-3'}`}
    >
      <div className="flex flex-wrap items-center gap-4">
        <div className="grid size-10 shrink-0 place-items-center rounded-full border border-red-500/40 bg-red-500/10">
          <Activity size={16} className="text-red-400" />
        </div>

        <div className="min-w-0 flex-1">
          {prominent ? (
            <>
              <div className="font-cinematic text-base uppercase tracking-wide text-white">
                Mode live · prêt
              </div>
              <p className="mt-1 text-sm leading-snug text-gray-400">
                Wazuh est connecté à votre VM Azure. Lancez un scénario d'attaque pour voir les corrélations en direct.
              </p>
            </>
          ) : (
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
              <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-red-400">
                Mode live
              </span>
              <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-gray-400">
                wazuh · <span style={{ color: statusTint }}>{statusLabel}</span>
              </span>
              <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-gray-500">
                {totalAlerts} alerte{totalAlerts !== 1 ? 's' : ''} reçues
              </span>
            </div>
          )}
        </div>

        {prominent && (
          <div className="flex flex-wrap items-center gap-2">
            <span
              className="inline-flex items-center gap-1.5 rounded-full border bg-black/40 px-2.5 py-1 font-mono text-[9.5px] uppercase tracking-[0.25em]"
              style={{ borderColor: `${statusTint}55`, color: statusTint }}
            >
              <span className="size-1.5 rounded-full" style={{ background: statusTint, boxShadow: `0 0 8px ${statusTint}` }} />
              wazuh · {statusLabel}
            </span>
            <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-gray-500">
              {totalAlerts} alerte{totalAlerts !== 1 ? 's' : ''}
            </span>
          </div>
        )}

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => injectScenario('demo-' + Date.now().toString(36))}
            className="inline-flex items-center gap-1.5 rounded-md border border-red-500/60 bg-red-500/15 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.25em] text-red-200 hover:border-red-400 hover:bg-red-500/25"
          >
            <Play size={11} />
            {prominent ? "Lancer un scénario" : 'Recharger'}
          </button>
          {prominent && (
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center gap-1.5 rounded-md border border-white/10 bg-white/[0.03] px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.25em] text-gray-300 hover:border-white/25 hover:text-white"
              title="Reconnecter le flux Wazuh"
            >
              <RefreshCw size={11} />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  )
}
