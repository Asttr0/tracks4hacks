// Five-step heat ramp, single bordeaux hue. Outliers flip to a dark callout.
// Calibrated so even step-1 (1-2 alerts) reads clearly on dark backgrounds.

export interface HeatStep {
  bg: string
  fg: string
  invert: boolean
  /** 0 (empty) — 4 (hottest). Lets components scale glow / pulse intensity. */
  level: number
}

const RAMP_DARK: HeatStep[] = [
  { bg: 'rgba(148, 163, 184, 0.07)', fg: 'rgba(255,255,255,0.55)', invert: false, level: 0 }, // empty
  { bg: 'linear-gradient(135deg, rgba(159, 28, 36, 0.38), rgba(110, 20, 28, 0.28))', fg: 'rgba(255,255,255,0.92)', invert: false, level: 1 }, // 1-2
  { bg: 'linear-gradient(135deg, rgba(140, 22, 30, 0.78), rgba( 90, 14, 22, 0.62))', fg: '#ffffff', invert: false, level: 2 }, // 3-7
  { bg: 'linear-gradient(135deg, rgba(112, 18, 24, 0.95), rgba( 58, 10, 14, 0.88))', fg: '#ffffff', invert: false, level: 3 }, // 8-24
  { bg: 'linear-gradient(135deg, #5b0b10, #1a0508)',                                  fg: '#ffffff', invert: true,  level: 4 }, // 25+
]

const RAMP_LIGHT: HeatStep[] = [
  { bg: '#eef0f4', fg: 'rgba(15,23,42,0.55)',  invert: false, level: 0 },
  { bg: '#fbcaca', fg: '#7f1d1d',              invert: false, level: 1 },
  { bg: '#f87171', fg: '#ffffff',              invert: false, level: 2 },
  { bg: '#dc2626', fg: '#ffffff',              invert: false, level: 3 },
  { bg: '#1f1015', fg: '#ffffff',              invert: true,  level: 4 },
]

const stepIndex = (count: number): number => {
  if (count <= 0) return 0
  if (count <= 2) return 1
  if (count <= 7) return 2
  if (count <= 24) return 3
  return 4
}

export const heatStep = (count: number, mode: 'dark' | 'light' = 'dark'): HeatStep => {
  const ramp = mode === 'dark' ? RAMP_DARK : RAMP_LIGHT
  return ramp[stepIndex(count)]!
}

/** Threshold above which we render the count number inside the cell. */
export const SHOW_COUNT_AT = 5

/** Brand color for accent bars / focused elements. */
export const ACCENT = '#c43b3b'
