import { useMemo } from 'react'
import type { TimelineModel } from '@/lib/timeline'

interface Props { model: TimelineModel }

export const Heatstrip = ({ model }: Props) => {
  const cells = useMemo(() => {
    const buckets = 64
    const span = model.windowEnd - model.windowStart
    const launched = new Array(buckets).fill(0)
    const detected = new Array(buckets).fill(0)
    for (const a of model.attacks) {
      const t = Date.parse(a.timestamp)
      const i = Math.min(buckets - 1, Math.floor(((t - model.windowStart) / span) * buckets))
      launched[i] += 1
      if (model.detected.has(a.id)) detected[i] += 1
    }
    return launched.map((l, i) => ({
      l,
      ratio: l ? detected[i] / l : -1, // -1 = empty
    }))
  }, [model])

  return (
    <div className="flex h-1.5 overflow-hidden rounded-sm">
      {cells.map((c, i) => (
        <div
          key={i}
          className="flex-1"
          style={{ background: cellColor(c.ratio) }}
          title={c.l ? `${Math.round(c.ratio * 100)}%` : ''}
        />
      ))}
    </div>
  )
}

const cellColor = (ratio: number): string => {
  if (ratio === -1) return 'rgba(255,255,255,0.04)'
  if (ratio >= 0.99) return 'rgba(34, 197, 94, 0.85)'
  if (ratio >= 0.66) return 'rgba(132, 204, 22, 0.8)'
  if (ratio >= 0.33) return 'rgba(245, 158, 11, 0.85)'
  if (ratio > 0)     return 'rgba(251, 146, 60, 0.85)'
  return 'rgba(239, 68, 68, 0.9)'
}
