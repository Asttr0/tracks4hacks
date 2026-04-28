import type { AttackEvent, CoverageReport, AttackTool } from '@/types/attack'
import type { WazuhAlert } from '@/types/wazuh'
import { correlate } from './correlator'

const EMPTY_BY_TOOL = (): Record<AttackTool, { launched: number; detected: number }> => ({
  nmap:       { launched: 0, detected: 0 },
  hydra:      { launched: 0, detected: 0 },
  gobuster:   { launched: 0, detected: 0 },
  sqlmap:     { launched: 0, detected: 0 },
  curl:       { launched: 0, detected: 0 },
  metasploit: { launched: 0, detected: 0 },
  other:      { launched: 0, detected: 0 }
})

export function coverageReport(attacks: AttackEvent[], alerts: WazuhAlert[]): CoverageReport {
  const bands = correlate(attacks, alerts)
  const detectedIds = new Set(bands.map((b) => b.attackId))

  const byTool = EMPTY_BY_TOOL()
  const techCount = new Map<string, { launched: number; detected: number }>()

  for (const a of attacks) {
    byTool[a.tool].launched += 1
    if (detectedIds.has(a.id)) byTool[a.tool].detected += 1

    for (const t of a.mitre ?? []) {
      const row = techCount.get(t) ?? { launched: 0, detected: 0 }
      row.launched += 1
      if (detectedIds.has(a.id)) row.detected += 1
      techCount.set(t, row)
    }
  }

  const detected = detectedIds.size
  return {
    totalAttacks: attacks.length,
    detectedAttacks: detected,
    missedAttacks: attacks.length - detected,
    detectionRate: attacks.length ? detected / attacks.length : 0,
    byTool,
    byTechnique: Array.from(techCount.entries()).map(([techniqueId, v]) => ({
      techniqueId, launched: v.launched, detected: v.detected
    }))
  }
}
