import type { CellStat, TacticStat } from './types'
import { MitreCell } from './MitreCell'

interface ColumnProps {
  stats: TacticStat
  cells: CellStat[]
  selectedId: string | null
  onSelect: (id: string) => void
}

export const MitreColumn = ({ stats, cells, selectedId, onSelect }: ColumnProps) => {
  const hot = stats.totalAlerts > 0
  return (
    <div className="flex min-w-0 flex-col gap-1.5">
      <div className="mb-0.5 flex flex-col px-1 pb-1">
        <p className="line-clamp-2 font-cinematic text-[11px] leading-tight text-white/85">
          {stats.tactic.name}
        </p>
        <p
          className={`mt-1 font-mono text-[11px] font-semibold tabular-nums ${
            hot ? 'mitre-total-glow' : 'text-white/25'
          }`}
        >
          {hot ? stats.totalAlerts : '·'}
        </p>
      </div>

      {cells.map((cell) => (
        <MitreCell
          key={cell.technique.id}
          cell={cell}
          selected={selectedId === cell.technique.id}
          onClick={() => onSelect(cell.technique.id)}
        />
      ))}
    </div>
  )
}
