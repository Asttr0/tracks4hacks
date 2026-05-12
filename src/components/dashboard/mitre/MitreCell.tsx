import { memo, useEffect, useRef, useState } from 'react'
import type { CellStat } from './types'
import { heatStep, SHOW_COUNT_AT, ACCENT } from './heat'

const PULSE_MS = 1500

interface CellProps {
  cell: CellStat
  selected: boolean
  onClick: () => void
}

const MitreCellInner = ({ cell, selected, onClick }: CellProps) => {
  const { technique, alertCount, redTeamHits, lastHitAt } = cell
  const [pulseKey, setPulseKey] = useState(0)
  const lastHitRef = useRef<number | null>(lastHitAt)

  useEffect(() => {
    if (lastHitAt && lastHitAt !== lastHitRef.current) {
      lastHitRef.current = lastHitAt
      setPulseKey((k) => k + 1)
    }
  }, [lastHitAt])

  const isFresh = lastHitAt != null && Date.now() - lastHitAt < PULSE_MS
  const step = heatStep(alertCount, 'dark')
  const missed = redTeamHits > 0 && alertCount === 0
  const showCount = alertCount >= SHOW_COUNT_AT
  const isHot = step.level >= 3

  // Subtle red glow on lower levels (1-2). Hot levels (3-4) get the dark inset
  // pulse instead — set via the .mitre-dark-pulse keyframe.
  const glowSpread = [0, 4, 7, 0, 0][step.level] ?? 0
  const glowAlpha  = [0, 0.22, 0.38, 0, 0][step.level] ?? 0
  const baseShadow =
    !isHot && glowSpread > 0
      ? `0 0 ${glowSpread}px rgba(196, 59, 59, ${glowAlpha}), inset 0 0 8px rgba(127, 29, 29, ${glowAlpha * 0.5})`
      : 'none'

  return (
    <button
      onClick={onClick}
      title={`${technique.id} — ${technique.name} · ${alertCount} alertes`}
      style={{
        background: missed ? 'rgba(239,68,68,0.10)' : step.bg,
        color: step.fg,
        outline: selected ? `1.5px solid ${ACCENT}` : 'none',
        outlineOffset: -1.5,
        boxShadow: isHot ? undefined : baseShadow,
      }}
      className={`group relative h-[58px] w-full overflow-hidden rounded-md text-left transition-all duration-150 hover:brightness-125 ${
        isHot ? 'mitre-dark-pulse' : ''
      }`}
    >
      {/* missed: thin red top edge */}
      {missed && (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-[2px]"
          style={{ background: '#ef4444' }}
        />
      )}

      {/* fresh-hit pulse */}
      {isFresh && (
        <span
          key={pulseKey}
          aria-hidden
          className="mitre-pulse-ring pointer-events-none absolute inset-0 rounded-md"
          style={{ borderColor: ACCENT }}
        />
      )}

      <div className="relative flex h-full flex-col justify-between p-2">
        <div className="flex items-start justify-between gap-1">
          <span className="font-mono text-[10px] tracking-wider opacity-90">
            {technique.id}
          </span>
          {showCount && (
            <span className="font-mono text-[11px] font-semibold tabular-nums">
              {alertCount > 999 ? '999+' : alertCount}
            </span>
          )}
        </div>
        <span className="line-clamp-2 text-[10.5px] leading-tight opacity-95">
          {technique.name}
        </span>
      </div>
    </button>
  )
}

export const MitreCell = memo(MitreCellInner)
