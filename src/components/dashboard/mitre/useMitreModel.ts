import { useMemo } from 'react'
import { useLogStore } from '@/store/useLogStore'
import { useUiStore } from '@/store/useUiStore'
import { TACTICS, TECHNIQUES } from '@/data/mitre-matrix'
import type { MitreTacticId } from '@/types/mitre'
import {
  TIMEFRAME_MS,
  type Timeframe,
  type CellStat,
  type TacticStat,
  type BucketStat,
} from './types'

interface ModelArgs {
  timeframe: Timeframe
}

export interface MitreModel {
  cellsByTechnique: Map<string, CellStat>
  cellsByTactic: Map<MitreTacticId, CellStat[]>
  tacticStats: TacticStat[]
  buckets: BucketStat[]
  totalAlerts: number
  techniquesTouched: number
  techniquesTotal: number
  maxCount: number
}

const matchTechniqueId = (alertIds: string[] | undefined, target: string): boolean => {
  if (!alertIds || alertIds.length === 0) return false
  for (const a of alertIds) {
    if (a === target) return true
    if (a.startsWith(target + '.')) return true
    if (target.startsWith(a + '.')) return true
  }
  return false
}

const bucketize = (alerts: { ts: number }[], cutoff: number, now: number, tf: Timeframe): BucketStat[] => {
  // 24 buckets over the window — gives 24 bars at 24h, 7 bars at 7d (one per day).
  let nBuckets: number
  let labelFmt: (date: Date) => string
  if (tf === '7d') {
    nBuckets = 7
    labelFmt = (d) => d.toLocaleDateString('fr-FR', { weekday: 'short' }).replace('.', '')
  } else if (tf === '24h') {
    nBuckets = 24
    labelFmt = (d) => `${d.getHours().toString().padStart(2, '0')}h`
  } else if (tf === '6h') {
    nBuckets = 12 // 30-min buckets
    labelFmt = (d) => `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes() < 30 ? '00' : '30'}`
  } else {
    nBuckets = 12 // 5-min buckets over 1h
    labelFmt = (d) => `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`
  }

  const span = now - cutoff
  const step = span / nBuckets
  const out: BucketStat[] = Array.from({ length: nBuckets }, (_, i) => {
    const start = cutoff + i * step
    return { ts: start, label: labelFmt(new Date(start)), count: 0 }
  })
  for (const a of alerts) {
    const idx = Math.min(nBuckets - 1, Math.max(0, Math.floor((a.ts - cutoff) / step)))
    out[idx]!.count += 1
  }
  return out
}

export function useMitreModel({ timeframe }: ModelArgs): MitreModel {
  const alerts = useLogStore((s) => s.alerts)
  const attackLog = useUiStore((s) => s.attackLog)

  return useMemo(() => {
    const now = Date.now()
    const cutoff = now - TIMEFRAME_MS[timeframe]
    const inWindow = alerts
      .map((a) => ({ alert: a, ts: Date.parse(a.timestamp) }))
      .filter((x) => x.ts >= cutoff)

    // per-technique cells
    const cellsByTechnique = new Map<string, CellStat>()
    for (const t of TECHNIQUES) {
      cellsByTechnique.set(t.id, {
        technique: t,
        alertCount: 0,
        redTeamHits: 0,
        severityMax: 0,
        lastHitAt: null,
        topRule: null,
        topSrcIps: [],
      })
    }

    const ipFreq = new Map<string, Map<string, number>>()
    const ruleSample = new Map<string, string>()

    for (const { alert: al, ts } of inWindow) {
      const ids = al.rule.mitre?.id ?? []
      for (const t of TECHNIQUES) {
        if (!matchTechniqueId(ids, t.id)) continue
        const cell = cellsByTechnique.get(t.id)!
        cell.alertCount += 1
        if (al.rule.level > cell.severityMax) cell.severityMax = al.rule.level
        if (cell.lastHitAt == null || ts > cell.lastHitAt) cell.lastHitAt = ts
        if (!ruleSample.has(t.id)) ruleSample.set(t.id, al.rule.description)
        const ip = al.data?.srcip
        if (ip) {
          const m = ipFreq.get(t.id) ?? new Map<string, number>()
          m.set(ip, (m.get(ip) ?? 0) + 1)
          ipFreq.set(t.id, m)
        }
      }
    }

    for (const [tid, ipMap] of ipFreq) {
      const cell = cellsByTechnique.get(tid)!
      cell.topSrcIps = Array.from(ipMap.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([ip]) => ip)
    }
    for (const [tid, desc] of ruleSample) {
      const cell = cellsByTechnique.get(tid)
      if (cell) cell.topRule = desc
    }

    for (const atk of attackLog) {
      for (const tid of atk.mitre ?? []) {
        const cell = cellsByTechnique.get(tid)
        if (cell) cell.redTeamHits += 1
      }
    }

    // group by tactic
    const cellsByTactic = new Map<MitreTacticId, CellStat[]>()
    for (const cell of cellsByTechnique.values()) {
      const arr = cellsByTactic.get(cell.technique.tactic) ?? []
      arr.push(cell)
      cellsByTactic.set(cell.technique.tactic, arr)
    }

    // tactic distribution stats
    const tacticStats: TacticStat[] = TACTICS.map((tactic) => {
      const cells = cellsByTactic.get(tactic.id) ?? []
      const totalAlerts = cells.reduce((a, c) => a + c.alertCount, 0)
      const touched = cells.filter((c) => c.alertCount > 0).length
      return {
        tactic,
        totalAlerts,
        techniquesTouched: touched,
        techniquesTotal: cells.length,
      }
    })

    const buckets = bucketize(inWindow, cutoff, now, timeframe)

    let maxCount = 0
    for (const c of cellsByTechnique.values()) if (c.alertCount > maxCount) maxCount = c.alertCount

    const totalAlerts = inWindow.length
    const techniquesTouched = Array.from(cellsByTechnique.values()).filter((c) => c.alertCount > 0).length

    return {
      cellsByTechnique,
      cellsByTactic,
      tacticStats,
      buckets,
      totalAlerts,
      techniquesTouched,
      techniquesTotal: TECHNIQUES.length,
      maxCount,
    }
  }, [alerts, attackLog, timeframe])
}
