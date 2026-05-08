import { useMemo } from 'react'
import { Search, X } from 'lucide-react'
import { SEVERITY_HEX, type TimelineModel } from '@/lib/timeline'
import type { Severity } from '@/types/Alert'
import type { TimelineState } from './state'

interface Props { model: TimelineModel; state: TimelineState }

const SEV_LIST: Severity[] = ['critical', 'high', 'medium', 'low', 'info']
const SEV_LABEL: Record<Severity, string> = {
  critical: 'Critique', high: 'Élevé', medium: 'Moyen', low: 'Faible', info: 'Info',
}

export const TimelineFilters = ({ model, state }: Props) => {
  const agents = useMemo(() => {
    const s = new Set<string>()
    for (const a of model.alerts) if (a.agent) s.add(a.agent)
    return [...s].sort()
  }, [model.alerts])

  const hasFilter =
    state.severityFilter.size > 0 ||
    state.searchQuery.length > 0 ||
    state.agentFilter ||
    state.technique ||
    state.missedOnly

  return (
    <div className="flex flex-wrap items-center gap-2 rounded-md border border-soc-border bg-black/30 p-2.5">
      {/* severity chips */}
      <div className="flex items-center gap-1">
        <span className="mr-1 font-mono text-[9px] uppercase tracking-[0.25em] text-gray-500">sévérité</span>
        {SEV_LIST.map((s) => {
          const active = state.severityFilter.has(s)
          return (
            <button
              key={s}
              onClick={() => state.toggleSeverity(s)}
              className="rounded-sm border px-2 py-1 font-mono text-[10px] uppercase tracking-[0.18em] transition-colors"
              style={{
                borderColor: active ? SEVERITY_HEX[s] : 'rgba(255,255,255,0.1)',
                background: active ? `${SEVERITY_HEX[s]}28` : 'rgba(255,255,255,0.02)',
                color: active ? SEVERITY_HEX[s] : 'rgba(255,255,255,0.55)',
              }}
            >
              {SEV_LABEL[s]}
            </button>
          )
        })}
      </div>

      <div className="h-6 w-px bg-white/10" />

      {/* search */}
      <div className="relative flex min-w-[180px] flex-1 items-center">
        <Search size={12} className="pointer-events-none absolute left-2 text-gray-500" />
        <input
          value={state.searchQuery}
          onChange={(e) => state.setSearchQuery(e.target.value)}
          placeholder="Rechercher (commande, IP, règle…)"
          className="w-full rounded-sm border border-white/10 bg-black/40 py-1.5 pl-7 pr-7 font-mono text-[11px] text-white placeholder:text-gray-600 focus:border-red-500/60 focus:outline-none"
        />
        {state.searchQuery && (
          <button
            onClick={() => state.setSearchQuery('')}
            className="absolute right-2 text-gray-500 hover:text-white"
            aria-label="Effacer"
          >
            <X size={12} />
          </button>
        )}
      </div>

      {/* agent */}
      {agents.length > 1 && (
        <>
          <div className="h-6 w-px bg-white/10" />
          <div className="flex items-center gap-1.5">
            <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-gray-500">hôte</span>
            <select
              value={state.agentFilter ?? ''}
              onChange={(e) => state.setAgentFilter(e.target.value || null)}
              className="rounded-sm border border-white/10 bg-black/40 px-2 py-1 font-mono text-[11px] text-gray-200 focus:border-red-500/60 focus:outline-none"
            >
              <option value="">tous</option>
              {agents.map((a) => <option key={a} value={a}>{a}</option>)}
            </select>
          </div>
        </>
      )}

      {hasFilter && (
        <>
          <div className="h-6 w-px bg-white/10" />
          <button
            onClick={() => {
              state.clearSeverityFilter()
              state.setSearchQuery('')
              state.setAgentFilter(null)
              state.setTechnique(null)
              if (state.missedOnly) state.toggleMissedOnly()
            }}
            className="rounded-sm border border-white/15 bg-white/[0.05] px-2 py-1 font-mono text-[10px] uppercase tracking-[0.22em] text-gray-300 hover:border-white/30 hover:text-white"
          >
            Effacer filtres
          </button>
        </>
      )}
    </div>
  )
}
