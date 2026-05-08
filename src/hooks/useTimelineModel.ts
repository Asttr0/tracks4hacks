import { useMemo } from 'react'
import { useUiStore } from '@/store/useUiStore'
import { useStreamStore } from '@/store/streamStore'
import { useLogStore } from '@/store/useLogStore'
import { DEMO_ATTACKS } from '@/data/demo-attacks'
import { DEMO_ALERTS } from '@/data/demo-alerts'
import {
  buildWindow,
  computePhases,
  correlateTimeline,
  normalizedToTimeline,
  wazuhToTimeline,
  type TimelineModel,
  type TimelineAlert,
} from '@/lib/timeline'
import type { AttackEvent } from '@/types/attack'
import type { Severity } from '@/types/Alert'

export interface TimelineFilters {
  severities: Set<Severity>
  search: string
  agent: string | null
  technique: string | null
  missedOnly: boolean
}

const empty: TimelineFilters = {
  severities: new Set(), search: '', agent: null, technique: null, missedOnly: false,
}

const matchesTechnique = (techs: string[], filter: string | null) => {
  if (!filter) return true
  return techs.some((t) => t === filter || t.startsWith(filter + '.') || filter.startsWith(t))
}

export const useTimelineModel = (filters: TimelineFilters = empty): TimelineModel & { liveEmpty: boolean } => {
  const demoMode = useUiStore((s) => s.demoMode)
  const liveAttacks = useUiStore((s) => s.attackLog)
  const liveWazuh = useLogStore((s) => s.alerts)
  const streamAlerts = useStreamStore((s) => s.alerts)

  return useMemo(() => {
    const rawAttacks = demoMode ? DEMO_ATTACKS : liveAttacks
    const rawAlerts = demoMode
      ? DEMO_ALERTS.map(wazuhToTimeline)
      : liveWazuh.length
        ? liveWazuh.map(wazuhToTimeline)
        : streamAlerts.map(normalizedToTimeline)

    const liveEmpty = !demoMode && rawAttacks.length === 0 && rawAlerts.length === 0

    // Detect correlations on the un-filtered set so missed-only filtering works.
    const fullCorr = correlateTimeline(rawAttacks, rawAlerts)
    const detected = new Set([...fullCorr.keys()])

    // Apply filters
    const q = filters.search.trim().toLowerCase()
    const matchAttack = (a: AttackEvent): boolean => {
      if (filters.technique && !matchesTechnique(a.mitre ?? [], filters.technique)) return false
      if (filters.missedOnly && detected.has(a.id)) return false
      if (q) {
        const hay = (a.tool + ' ' + a.command + ' ' + a.target + ' ' + (a.mitre ?? []).join(' ')).toLowerCase()
        if (!hay.includes(q)) return false
      }
      return true
    }
    const matchAlert = (a: TimelineAlert): boolean => {
      if (filters.severities.size && !filters.severities.has(a.severity)) return false
      if (filters.agent && a.agent !== filters.agent) return false
      if (filters.technique && !matchesTechnique(a.techniques, filters.technique)) return false
      if (q) {
        const hay = (a.description + ' ' + a.ruleId + ' ' + (a.srcIp ?? '') + ' ' + (a.agent ?? '') + ' ' + a.techniques.join(' ')).toLowerCase()
        if (!hay.includes(q)) return false
      }
      return true
    }

    const attacks = rawAttacks.filter(matchAttack)
    const alerts = rawAlerts.filter(matchAlert)

    // Re-correlate on the filtered set so the canvas only links what's visible.
    const correlations = correlateTimeline(attacks, alerts)
    const filteredDetected = new Set([...correlations.keys()])
    const phases = computePhases(attacks)
    const { start, end } = buildWindow(attacks.length || alerts.length ? attacks : rawAttacks, alerts.length ? alerts : rawAlerts)

    return {
      attacks,
      alerts,
      correlations,
      detected: filteredDetected,
      phases,
      windowStart: start,
      windowEnd: end,
      liveEmpty,
    }
  }, [
    demoMode, liveAttacks, liveWazuh, streamAlerts,
    filters.severities, filters.search, filters.agent, filters.technique, filters.missedOnly,
  ])
}
