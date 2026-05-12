import type { BucketStat, Timeframe } from './types'

interface Props {
  buckets: BucketStat[]
  timeframe: Timeframe
}

const SUBTITLE: Record<Timeframe, string> = {
  '1h':  '5-min',
  '6h':  '30-min',
  '24h': 'horaire',
  '7d':  'journalier',
}

/**
 * Lollipop pulse-chart. Each non-zero bucket is a thin vertical filament
 * rooted on the baseline with a glowing dot at its head. The most recent
 * non-zero bucket emits a radar pulse to feel alive; the peak gets its value
 * labeled. Empty buckets just take baseline space — no chunky blocks to drown
 * out sparse data, but every event is clearly readable.
 */
export const ChartByTime = ({ buckets, timeframe }: Props) => {
  const max = Math.max(...buckets.map((b) => b.count), 1)
  const n = buckets.length
  const stride = Math.ceil(n / 8)

  const peakVal = max
  const lastActiveIdx = (() => {
    for (let i = buckets.length - 1; i >= 0; i--) {
      if ((buckets[i]?.count ?? 0) > 0) return i
    }
    return -1
  })()

  return (
    <div className="flex h-full flex-col">
      <header className="mb-3 flex items-baseline justify-between">
        <h3 className="font-cinematic text-sm uppercase tracking-wide text-white">
          Dans le temps
        </h3>
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">
          pic · {max} · {SUBTITLE[timeframe]}
        </span>
      </header>

      <div className="relative flex min-h-0 flex-1 gap-2">
        {/* y-axis ticks */}
        <div className="flex w-8 flex-col justify-between pb-6 pt-3 text-right">
          <span className="font-mono text-[9px] tabular-nums text-white/40">{max}</span>
          <span className="font-mono text-[9px] tabular-nums text-white/30">{Math.round(max / 2)}</span>
          <span className="font-mono text-[9px] tabular-nums text-white/25">0</span>
        </div>

        {/* plot area */}
        <div className="relative min-w-0 flex-1">
          {/* faint horizontal grid */}
          <div className="absolute inset-x-0 top-3 bottom-6 flex flex-col justify-between">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="h-px w-full"
                style={{ background: 'rgba(255,255,255,0.04)' }}
              />
            ))}
          </div>

          {/* baseline (the x-axis line itself) */}
          <div
            className="absolute inset-x-0 h-px"
            style={{
              bottom: 'calc(1.5rem - 0.5px)',
              background:
                'linear-gradient(90deg, rgba(239,68,68,0) 0%, rgba(239,68,68,0.45) 12%, rgba(239,68,68,0.45) 88%, rgba(239,68,68,0) 100%)',
              boxShadow: '0 0 6px rgba(239,68,68,0.35)',
            }}
          />

          {/* lollipops */}
          <div className="absolute inset-x-0 top-3 bottom-6 flex items-end">
            {buckets.map((b, i) => {
              const hot = b.count > 0
              const heightPct = max > 0 ? (b.count / max) * 100 : 0
              const isPeak = hot && b.count === peakVal
              const isLast = i === lastActiveIdx
              return (
                <div
                  key={b.ts}
                  className="relative flex h-full flex-1 items-end justify-center"
                >
                  {hot && (
                    <>
                      {/* stem */}
                      <span
                        aria-hidden
                        className="absolute bottom-0 left-1/2 -translate-x-1/2 transition-all duration-500"
                        style={{
                          height: `${Math.max(heightPct, 8)}%`,
                          width: '2px',
                          background:
                            'linear-gradient(180deg, #ef4444 0%, #b91c1c 60%, rgba(127,29,29,0) 100%)',
                          boxShadow: '0 0 6px rgba(239,68,68,0.55)',
                          borderRadius: '2px',
                        }}
                      />
                      {/* live radar ring on the most recent active bucket */}
                      {isLast && (
                        <span
                          aria-hidden
                          className="mitre-dot-radar absolute left-1/2 size-3 -translate-x-1/2 rounded-full"
                          style={{
                            bottom: `calc(${Math.max(heightPct, 8)}% - 6px)`,
                            background: 'transparent',
                            border: '2px solid rgba(239,68,68,0.55)',
                          }}
                        />
                      )}
                      {/* head dot */}
                      <span
                        aria-hidden
                        className={`absolute left-1/2 -translate-x-1/2 rounded-full ring-2 ${
                          isPeak
                            ? 'size-3 bg-red-300 ring-red-500/55'
                            : 'size-2 bg-red-400 ring-red-500/40'
                        }`}
                        style={{
                          bottom: `calc(${Math.max(heightPct, 8)}% - ${isPeak ? 6 : 4}px)`,
                          boxShadow: isPeak
                            ? '0 0 14px rgba(239,68,68,0.75)'
                            : '0 0 8px rgba(239,68,68,0.45)',
                        }}
                      />
                      {/* value label on peaks */}
                      {isPeak && (
                        <span
                          className="mitre-kpi-glow absolute left-1/2 -translate-x-1/2 font-mono text-[10px] tabular-nums text-white"
                          style={{ bottom: `calc(${Math.max(heightPct, 8)}% + 8px)` }}
                        >
                          {b.count}
                        </span>
                      )}
                    </>
                  )}
                </div>
              )
            })}
          </div>

          {/* x-axis labels */}
          <div className="absolute inset-x-0 bottom-0 flex h-5 items-center">
            {buckets.map((b, i) => {
              const show = i % stride === 0 || i === n - 1
              return (
                <span
                  key={b.ts}
                  className="flex-1 truncate text-center font-mono text-[9px] uppercase tracking-wider text-white/40"
                >
                  {show ? b.label : ''}
                </span>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
