import { TACTICS } from '@/data/mitre-matrix'
import type { MitreTacticId } from '@/types/mitre'
import { MitreColumn } from './MitreColumn'
import type { CellStat, TacticStat } from './types'

interface MatrixProps {
  cellsByTactic: Map<MitreTacticId, CellStat[]>
  tacticStats: TacticStat[]
  selectedTechniqueId: string | null
  onSelect: (id: string) => void
}

/**
 * 14 fluid columns via CSS grid. Each column is `minmax(0, 1fr)` so the matrix
 * stretches to fill its container — no horizontal overflow at typical laptop
 * widths. Container has a min-width fallback so very narrow viewports scroll.
 */
export const MitreMatrix = ({
  cellsByTactic,
  tacticStats,
  selectedTechniqueId,
  onSelect,
}: MatrixProps) => {
  return (
    <div className="w-full overflow-x-auto p-3 lg:p-4">
      <div
        className="grid min-w-[980px] gap-1.5"
        style={{ gridTemplateColumns: `repeat(${TACTICS.length}, minmax(0, 1fr))` }}
      >
        {TACTICS.map((tactic, i) => (
          <MitreColumn
            key={tactic.id}
            stats={tacticStats[i]!}
            cells={cellsByTactic.get(tactic.id) ?? []}
            selectedId={selectedTechniqueId}
            onSelect={onSelect}
          />
        ))}
      </div>
    </div>
  )
}
