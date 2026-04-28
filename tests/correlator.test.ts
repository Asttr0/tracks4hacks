import { describe, it, expect } from 'vitest'
import { correlate } from '@/lib/correlator'
import type { AttackEvent } from '@/types/attack'
import type { WazuhAlert } from '@/types/wazuh'

const makeAlert = (id: string, offsetSec: number, mitre: string[], level = 5): WazuhAlert => ({
  id, timestamp: new Date(1_700_000_000_000 + offsetSec * 1000).toISOString(),
  rule: { id: 'r', level, description: 'x', mitre: { id: mitre } },
  agent: { name: 'lab' }
})

const makeAttack = (id: string, offsetSec: number, mitre: string[]): AttackEvent => ({
  id, timestamp: new Date(1_700_000_000_000 + offsetSec * 1000).toISOString(),
  tool: 'nmap', command: 'x', target: 'x', mitre
})

describe('correlate', () => {
  it('matches alerts within window on shared technique', () => {
    const atk = [makeAttack('a1', 0, ['T1046'])]
    const alerts = [makeAlert('al1', 10, ['T1046']), makeAlert('al2', 400, ['T1046'])]
    const bands = correlate(atk, alerts, { windowSec: 120 })
    expect(bands).toHaveLength(1)
    expect(bands[0]!.matchedAlertIds).toEqual(['al1'])
  })

  it('ignores alerts outside window', () => {
    const atk = [makeAttack('a1', 0, ['T1046'])]
    const alerts = [makeAlert('al1', 500, ['T1046'])]
    expect(correlate(atk, alerts, { windowSec: 120 })).toHaveLength(0)
  })

  it('requires shared technique', () => {
    const atk = [makeAttack('a1', 0, ['T1046'])]
    const alerts = [makeAlert('al1', 10, ['T1110'])]
    expect(correlate(atk, alerts)).toHaveLength(0)
  })

  it('sub-technique prefix matches parent', () => {
    const atk = [makeAttack('a1', 0, ['T1110'])]
    const alerts = [makeAlert('al1', 10, ['T1110.001'])]
    expect(correlate(atk, alerts)).toHaveLength(1)
  })

  it('severity scales with max alert level', () => {
    const atk = [makeAttack('a1', 0, ['T1046'])]
    const alerts = [makeAlert('al1', 10, ['T1046'], 12)]
    expect(correlate(atk, alerts)[0]!.severity).toBe('critical')
  })
})
