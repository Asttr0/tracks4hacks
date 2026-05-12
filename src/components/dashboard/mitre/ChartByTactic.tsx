import type { TacticStat } from './types'

interface Props {
  stats: TacticStat[]
}

/**
 * Horizontal kill-chain leaderboard. Each row is:
 *   [idx] [tactic name cell] [bar track] [count]
 * Name is in its own left-aligned, vertically-centered slot (no overlap with
 * the bar). The bar uses a dark-red gradient and the top tactic carries a
 * subtle red glow.
 */
export const ChartByTactic = ({ stats }: Props) => {
  const max = Math.max(...stats.map((s) => s.totalAlerts), 1)
  const total = stats.reduce((acc, s) => acc + s.totalAlerts, 0)

  return (
    <div className="flex h-full flex-col">
      <header className="mb-4 flex items-baseline justify-between">
        <h3 className="font-cinematic text-sm uppercase tracking-wide text-white">
          Par tactique
        </h3>
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">
          {total} alertes · 14 tactiques
        </span>
      </header>

      <div className="flex min-h-0 flex-1 flex-col justify-between gap-1.5">
        {stats.map((s, idx) => {
          const widthPct = max > 0 ? (s.totalAlerts / max) * 100 : 0
          const isTop = s.totalAlerts === max && max > 0
          const hot = s.totalAlerts > 0
          return (
            <div
              key={s.tactic.id}
              className="grid grid-cols-[16px_minmax(0,160px)_minmax(0,1fr)_30px] items-center gap-3"
            >
              {/* kill-chain index */}
              <span className="text-right font-mono text-[9px] tabular-nums text-white/30">
                {String(idx + 1).padStart(2, '0')}
              </span>

              {/* name slot — left-aligned, vertically centered, glowing */}
              <span
                className={`truncate font-mono text-[10.5px] uppercase tracking-[0.14em] ${
                  hot ? 'mitre-kpi-glow text-white/95' : 'text-white/35'
                }`}
                title={s.tactic.name}
              >
                {s.tactic.name}
              </span>

              {/* bar track */}
              <div className="relative h-5 overflow-hidden rounded-sm bg-white/[0.04]">
                {!hot && (
                  <span className="absolute inset-y-1/2 left-0 right-0 h-px bg-white/[0.08]" />
                )}
                {hot && (
                  <div
                    className="absolute inset-y-0 left-0 rounded-sm transition-all duration-500"
                    style={{
                      width: `${Math.max(widthPct, 2)}%`,
                      background:
                        'linear-gradient(90deg, rgba(58,10,14,0.95) 0%, rgba(127,29,29,0.95) 60%, rgba(180,40,46,0.95) 100%)',
                      boxShadow: isTop
                        ? 'inset 0 0 14px rgba(40,5,8,0.85), 0 0 12px rgba(196,59,59,0.45)'
                        : 'inset 0 0 10px rgba(40,5,8,0.65)',
                    }}
                  />
                )}
              </div>

              {/* value */}
              <span
                className={`text-right font-mono text-[11px] tabular-nums ${
                  isTop ? 'mitre-total-glow' : hot ? 'text-white/85' : 'text-white/25'
                }`}
              >
                {hot ? s.totalAlerts : '·'}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
