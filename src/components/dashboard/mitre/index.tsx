import { useMemo, useState } from 'react'
import { useUiStore } from '@/store/useUiStore'
import { NeonEdge } from '@/components/ui/NeonEdge'
import { useMitreModel } from './useMitreModel'
import { MitreFilters } from './MitreFilters'
import { MitreMatrix } from './MitreMatrix'
import { MitreDetailPanel } from './MitreDetailPanel'
import { ChartByTactic } from './ChartByTactic'
import { ChartByTime } from './ChartByTime'
import type { Timeframe } from './types'

const NEON_RED = '#ef4444'

const TF_LABEL: Record<Timeframe, string> = {
  '1h': 'Dernière heure',
  '6h': 'Dernières 6 heures',
  '24h': 'Dernières 24 heures',
  '7d': '7 derniers jours',
}

export const MitreView = () => {
  const [timeframe, setTimeframe] = useState<Timeframe>('24h')
  const selectedTechnique = useUiStore((s) => s.selectedTechnique)
  const selectTechnique = useUiStore((s) => s.selectTechnique)

  const model = useMitreModel({ timeframe })
  const selectedCell = useMemo(
    () => (selectedTechnique ? (model.cellsByTechnique.get(selectedTechnique) ?? null) : null),
    [selectedTechnique, model.cellsByTechnique],
  )

  return (
    <div className="flex flex-col gap-6">
      {/* compact summary strip + timeframe picker */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex items-baseline gap-6">
          <Stat value={model.totalAlerts} label="alertes" />
          <Stat value={`${model.techniquesTouched}/${model.techniquesTotal}`} label="techniques touchées" />
        </div>
        <div className="flex flex-col items-end gap-1.5">
          <p className="mitre-kpi-glow font-mono text-[10px] uppercase tracking-[0.2em] text-white/70">
            {TF_LABEL[timeframe]}
          </p>
          <MitreFilters timeframe={timeframe} onTimeframe={setTimeframe} />
        </div>
      </div>

      {/* main heatmap — always full-width */}
      <div className="relative overflow-hidden rounded-lg border border-white/[0.06] bg-black/20 backdrop-blur-sm">
        <NeonEdge color={NEON_RED} intensity="bright" />
        <MitreMatrix
          cellsByTactic={model.cellsByTactic}
          tacticStats={model.tacticStats}
          selectedTechniqueId={selectedTechnique}
          onSelect={(id) => selectTechnique(selectedTechnique === id ? null : id)}
        />
      </div>

      {/* horizontal detail banner — slides in BELOW the matrix */}
      <MitreDetailPanel
        cell={selectedCell}
        onClose={() => selectTechnique(null)}
      />

      {/* distribution charts */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="relative h-[480px] overflow-hidden rounded-lg border border-white/[0.06] bg-black/20 backdrop-blur-sm p-5">
          <NeonEdge color={NEON_RED} intensity="bright" />
          <ChartByTactic stats={model.tacticStats} />
        </div>
        <div className="relative h-[480px] overflow-hidden rounded-lg border border-white/[0.06] bg-black/20 backdrop-blur-sm p-5">
          <NeonEdge color={NEON_RED} intensity="bright" />
          <ChartByTime buckets={model.buckets} timeframe={timeframe} />
        </div>
      </div>
    </div>
  )
}

const Stat = ({ value, label }: { value: number | string; label: string }) => (
  <div className="flex flex-col">
    <span className="mitre-kpi-glow font-mono text-2xl tabular-nums text-white">{value}</span>
    <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/45">{label}</span>
  </div>
)
