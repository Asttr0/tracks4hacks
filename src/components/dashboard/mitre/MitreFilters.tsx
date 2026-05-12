import type { Timeframe } from './types'

const TIMEFRAMES: { id: Timeframe; label: string }[] = [
  { id: '1h',  label: '1 h'  },
  { id: '6h',  label: '6 h'  },
  { id: '24h', label: '24 h' },
  { id: '7d',  label: '7 j'  },
]

interface FiltersProps {
  timeframe: Timeframe
  onTimeframe: (v: Timeframe) => void
}

export const MitreFilters = ({ timeframe, onTimeframe }: FiltersProps) => (
  <div className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.02] p-0.5">
    {TIMEFRAMES.map((tf) => (
      <button
        key={tf.id}
        onClick={() => onTimeframe(tf.id)}
        className={`rounded-full px-3.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.18em] transition-colors ${
          timeframe === tf.id
            ? 'mitre-pill-pulse bg-white text-slate-900'
            : 'text-white/55 hover:text-white/85'
        }`}
      >
        {tf.label}
      </button>
    ))}
  </div>
)
