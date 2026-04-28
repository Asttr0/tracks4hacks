export type MitreTacticId =
  | 'TA0043' | 'TA0042' | 'TA0001' | 'TA0002' | 'TA0003'
  | 'TA0004' | 'TA0005' | 'TA0006' | 'TA0007' | 'TA0008'
  | 'TA0009' | 'TA0011' | 'TA0010' | 'TA0040'

export interface MitreTactic {
  id: MitreTacticId
  name: string
  short: string
}

export interface MitreTechnique {
  id: string
  name: string
  tactic: MitreTacticId
}

export interface MitreCellStat {
  technique: MitreTechnique
  alertCount: number
  redTeamHits: number
  detected: boolean
}
