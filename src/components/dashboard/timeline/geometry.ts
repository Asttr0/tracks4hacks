/** Pure projection helpers — no React. */

export interface Viewport {
  /** viewport time-range in ms (post-zoom) */
  t0: number
  t1: number
  /** drawable plot area in svg coords */
  x0: number
  x1: number
  y: { attackLane: number; ruler: number; alertLane: number; bottom: number }
}

export const buildViewport = (
  windowStart: number,
  windowEnd: number,
  range: [number, number],
  width: number,
  height: number,
): Viewport => {
  const span = windowEnd - windowStart
  const t0 = windowStart + span * range[0]
  const t1 = windowStart + span * range[1]
  const x0 = 84
  const x1 = Math.max(x0 + 100, width - 16)

  // Lanes — top/bottom pads, big middle
  const top = 28
  const bot = 24
  const drawH = Math.max(160, height - top - bot)
  const attackLaneH = drawH * 0.42
  const alertLaneH = drawH * 0.42

  return {
    t0, t1,
    x0, x1,
    y: {
      attackLane: top + attackLaneH * 0.5,
      ruler: top + attackLaneH + (drawH - attackLaneH - alertLaneH) * 0.5,
      alertLane: top + drawH - alertLaneH * 0.5,
      bottom: top + drawH,
    },
  }
}

export const tToX = (vp: Viewport, t: number): number => {
  const ratio = (t - vp.t0) / (vp.t1 - vp.t0)
  return vp.x0 + ratio * (vp.x1 - vp.x0)
}

export const xToT = (vp: Viewport, x: number): number => {
  const ratio = (x - vp.x0) / (vp.x1 - vp.x0)
  return vp.t0 + ratio * (vp.t1 - vp.t0)
}

/** Vertical sub-row by severity rank within a lane (0 → top, 1 → bottom). */
export const severityOffset = (severity: string, laneY: number, half: number): number => {
  const r: Record<string, number> = { critical: -0.7, high: -0.35, medium: 0, low: 0.35, info: 0.7 }
  return laneY + (r[severity] ?? 0) * half * 0.6
}

/** Cubic bezier path from (x1,y1) to (x2,y2) with vertical control bias. */
export const arcPath = (x1: number, y1: number, x2: number, y2: number): string => {
  const midY = (y1 + y2) / 2
  const c1y = y1 + (midY - y1) * 1.1
  const c2y = y2 + (midY - y2) * 1.1
  return `M ${x1} ${y1} C ${x1} ${c1y}, ${x2} ${c2y}, ${x2} ${y2}`
}

/** Format a tick label. */
export const formatTick = (t: number, span: number): string => {
  const d = new Date(t)
  if (span < 60_000) return `:${String(d.getSeconds()).padStart(2, '0')}`
  if (span < 60 * 60_000) return `${String(d.getMinutes()).padStart(2, '0')}:${String(d.getSeconds()).padStart(2, '0')}`
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

/** Pick a "nice" tick interval in ms covering ~6-10 ticks. */
export const niceTickInterval = (span: number): number => {
  const candidates = [
    1_000, 2_000, 5_000, 10_000, 15_000, 30_000,
    60_000, 2 * 60_000, 5 * 60_000, 10 * 60_000, 15 * 60_000, 30 * 60_000,
    60 * 60_000,
  ]
  const target = span / 8
  let best = candidates[0] ?? 60_000
  for (const c of candidates) if (Math.abs(c - target) < Math.abs(best - target)) best = c
  return best
}

export const generateTicks = (vp: Viewport): number[] => {
  const span = vp.t1 - vp.t0
  const step = niceTickInterval(span)
  const start = Math.ceil(vp.t0 / step) * step
  const out: number[] = []
  for (let t = start; t <= vp.t1; t += step) out.push(t)
  return out
}
