import type { MitreTactic, MitreTechnique } from '@/types/mitre'

export type Timeframe = '1h' | '6h' | '24h' | '7d'

export const TIMEFRAME_MS: Record<Timeframe, number> = {
  '1h':  1   * 60 * 60 * 1000,
  '6h':  6   * 60 * 60 * 1000,
  '24h': 24  * 60 * 60 * 1000,
  '7d':  168 * 60 * 60 * 1000,
}

export interface CellStat {
  technique: MitreTechnique
  alertCount: number
  redTeamHits: number
  severityMax: number
  lastHitAt: number | null
  topRule: string | null
  topSrcIps: string[]
}

export interface TacticStat {
  tactic: MitreTactic
  totalAlerts: number
  techniquesTouched: number
  techniquesTotal: number
}

export interface BucketStat {
  /** ms epoch of the bucket start */
  ts: number
  /** human label (e.g. "14h", "Mer", "10/05") */
  label: string
  count: number
}
