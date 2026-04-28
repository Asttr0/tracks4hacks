export type AttackTool = 'nmap' | 'hydra' | 'gobuster' | 'sqlmap' | 'curl' | 'metasploit' | 'other'

export interface AttackEvent {
  id: string
  timestamp: string
  tool: AttackTool
  command: string
  target: string
  mitre?: string[]
  notes?: string
}

export interface CorrelationBand {
  start: string
  end: string
  attackId: string
  matchedAlertIds: string[]
  severity: 'info' | 'low' | 'med' | 'high' | 'critical'
}

export interface CoverageReport {
  totalAttacks: number
  detectedAttacks: number
  missedAttacks: number
  detectionRate: number
  byTool: Record<AttackTool, { launched: number; detected: number }>
  byTechnique: { techniqueId: string; launched: number; detected: number }[]
}
