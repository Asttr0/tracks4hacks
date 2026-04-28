import type { AttackEvent, CorrelationBand } from '@/types/attack'
import type { WazuhAlert } from '@/types/wazuh'

export interface CorrelateOptions {
  windowSec?: number
}

function severityFor(level: number): CorrelationBand['severity'] {
  if (level >= 12) return 'critical'
  if (level >= 9) return 'high'
  if (level >= 6) return 'med'
  if (level >= 3) return 'low'
  return 'info'
}

function shareTechnique(attack: AttackEvent, alert: WazuhAlert): boolean {
  const atkT = new Set(attack.mitre ?? [])
  const alertT = new Set(alert.rule.mitre?.id ?? [])
  for (const t of atkT) {
    if (alertT.has(t)) return true
    for (const at of alertT) if (at.startsWith(t) || t.startsWith(at)) return true
  }
  return false
}

export function correlate(
  attacks: AttackEvent[],
  alerts: WazuhAlert[],
  opts: CorrelateOptions = {}
): CorrelationBand[] {
  const windowMs = (opts.windowSec ?? 120) * 1000
  const bands: CorrelationBand[] = []

  for (const atk of attacks) {
    const atkTs = Date.parse(atk.timestamp)
    if (Number.isNaN(atkTs)) continue
    const matched: WazuhAlert[] = []
    let maxLevel = 0

    for (const al of alerts) {
      const alTs = Date.parse(al.timestamp)
      if (Number.isNaN(alTs)) continue
      const dt = alTs - atkTs
      if (dt < -5_000 || dt > windowMs) continue
      if (shareTechnique(atk, al)) {
        matched.push(al)
        if (al.rule.level > maxLevel) maxLevel = al.rule.level
      }
    }

    if (matched.length) {
      const endTs = Math.max(atkTs, ...matched.map((m) => Date.parse(m.timestamp)))
      bands.push({
        start: new Date(atkTs).toISOString(),
        end: new Date(endTs).toISOString(),
        attackId: atk.id,
        matchedAlertIds: matched.map((m) => m.id),
        severity: severityFor(maxLevel)
      })
    }
  }

  return bands
}
