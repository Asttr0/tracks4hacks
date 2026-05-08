import { useCallback, useEffect, useRef, useState } from 'react'
import type { Severity } from '@/types/Alert'

export type SelectionKind = 'attack' | 'alert'
export interface Selection { kind: SelectionKind; id: string }

export interface TimelineState {
  range: [number, number]
  setRange: (r: [number, number]) => void
  zoomTo: (a: number, b: number) => void
  resetZoom: () => void

  selection: Selection | null
  select: (s: Selection | null) => void

  technique: string | null
  setTechnique: (t: string | null) => void

  phantom: boolean
  togglePhantom: () => void

  /** replay 0..1 across the visible range. null = live edge. */
  playhead: number | null
  setPlayhead: (p: number | null) => void
  playing: boolean
  setPlaying: (p: boolean) => void
  speed: number
  setSpeed: (s: number) => void

  missedOnly: boolean
  toggleMissedOnly: () => void

  /** Pause the playhead briefly when it crosses a missed attack. */
  autoPauseOnMissed: boolean
  toggleAutoPause: () => void

  /* -------- filter bar -------- */
  severityFilter: Set<Severity>
  toggleSeverity: (s: Severity) => void
  clearSeverityFilter: () => void

  searchQuery: string
  setSearchQuery: (q: string) => void

  agentFilter: string | null
  setAgentFilter: (a: string | null) => void
}

export const useTimelineState = (): TimelineState => {
  const [range, setRange] = useState<[number, number]>([0, 1])
  const [selection, select] = useState<Selection | null>(null)
  const [technique, setTechnique] = useState<string | null>(null)
  const [phantom, setPhantom] = useState(false)
  const [playhead, setPlayhead] = useState<number | null>(null)
  const [playing, setPlaying] = useState(false)
  const [speed, setSpeed] = useState(1)
  const [missedOnly, setMissedOnly] = useState(false)
  const [autoPauseOnMissed, setAutoPause] = useState(true)

  const [severityFilter, setSeverityFilter] = useState<Set<Severity>>(new Set())
  const [searchQuery, setSearchQuery] = useState('')
  const [agentFilter, setAgentFilter] = useState<string | null>(null)

  const rafRef = useRef<number | null>(null)
  const lastRef = useRef<number>(0)

  useEffect(() => {
    if (!playing) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      return
    }
    lastRef.current = performance.now()
    const tick = (now: number) => {
      const dt = now - lastRef.current
      lastRef.current = now
      setPlayhead((p) => {
        const cur = p ?? 0
        const next = cur + (dt / 30_000) * speed // 30s per full sweep at 1×
        if (next >= 1) { setPlaying(false); return 1 }
        return next
      })
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current) }
  }, [playing, speed])

  const zoomTo = useCallback((a: number, b: number) => {
    const lo = Math.max(0, Math.min(a, b))
    const hi = Math.min(1, Math.max(a, b))
    if (hi - lo < 0.02) return
    setRange([lo, hi])
  }, [])

  const resetZoom = useCallback(() => setRange([0, 1]), [])

  return {
    range, setRange, zoomTo, resetZoom,
    selection, select,
    technique, setTechnique,
    phantom, togglePhantom: () => setPhantom((v) => !v),
    playhead, setPlayhead,
    playing, setPlaying,
    speed, setSpeed,
    missedOnly, toggleMissedOnly: () => setMissedOnly((v) => !v),
    autoPauseOnMissed, toggleAutoPause: () => setAutoPause((v) => !v),
    severityFilter,
    toggleSeverity: (s) => setSeverityFilter((cur) => {
      const next = new Set(cur)
      if (next.has(s)) next.delete(s); else next.add(s)
      return next
    }),
    clearSeverityFilter: () => setSeverityFilter(new Set()),
    searchQuery, setSearchQuery,
    agentFilter, setAgentFilter,
  }
}
