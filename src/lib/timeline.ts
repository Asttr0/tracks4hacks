import type { AttackEvent, AttackTool } from '@/types/attack'
import type { WazuhAlert } from '@/types/wazuh'
import type { Alert, Severity } from '@/types/Alert'

export interface TimelineAlert {
  id: string
  ts: string
  level: number
  severity: Severity
  description: string
  ruleId: string
  techniques: string[]
  agent?: string
  srcIp?: string
  raw?: unknown
}

export interface TimelineCorrelation {
  attackId: string
  alertIds: string[]
  severity: Severity
  /** ms between attack start and first matched alert */
  lagMs: number
  /** match heuristics that fired */
  reasons: string[]
}

export interface TimelinePhase {
  id: string
  /** attack ids included (chronological) */
  attackIds: string[]
  /** inferred kill-chain label (FR) */
  label: string
  start: string
  end: string
}

export interface TimelineModel {
  attacks: AttackEvent[]
  alerts: TimelineAlert[]
  correlations: Map<string, TimelineCorrelation> // by attackId
  detected: Set<string>                          // attackIds with at least one match
  phases: TimelinePhase[]
  windowStart: number
  windowEnd: number
}

/* -------- adapters -------- */

const SEVERITY_FROM_LEVEL = (lvl: number): Severity => {
  if (lvl >= 12) return 'critical'
  if (lvl >= 9) return 'high'
  if (lvl >= 6) return 'medium'
  if (lvl >= 3) return 'low'
  return 'info'
}

const LEVEL_FROM_SEVERITY: Record<Severity, number> = {
  info: 1, low: 4, medium: 7, high: 10, critical: 13,
}

export const wazuhToTimeline = (a: WazuhAlert): TimelineAlert => ({
  id: a.id,
  ts: a.timestamp,
  level: a.rule.level,
  severity: SEVERITY_FROM_LEVEL(a.rule.level),
  description: a.rule.description,
  ruleId: a.rule.id,
  techniques: a.rule.mitre?.id ?? [],
  agent: a.agent.name,
  srcIp: a.data?.srcip,
  raw: a,
})

export const normalizedToTimeline = (a: Alert): TimelineAlert => ({
  id: a.id,
  ts: a.ts,
  level: LEVEL_FROM_SEVERITY[a.severity],
  severity: a.severity,
  description: a.ruleDesc,
  ruleId: a.ruleId,
  techniques: a.techniqueIds ?? [],
  agent: a.agent?.name,
  srcIp: a.srcIp,
  raw: a,
})

/* -------- correlation -------- */

const sharesTechnique = (atk: AttackEvent, al: TimelineAlert): boolean => {
  const A = atk.mitre ?? []
  const B = al.techniques
  for (const a of A) for (const b of B) {
    if (a === b) return true
    if (a.startsWith(b) || b.startsWith(a)) return true // T1110 ↔ T1110.001
  }
  return false
}

const peakSeverity = (alerts: TimelineAlert[]): Severity => {
  let best: Severity = 'info'
  const order: Severity[] = ['info', 'low', 'medium', 'high', 'critical']
  for (const a of alerts) if (order.indexOf(a.severity) > order.indexOf(best)) best = a.severity
  return best
}

export const correlateTimeline = (
  attacks: AttackEvent[],
  alerts: TimelineAlert[],
  windowSec = 120,
): Map<string, TimelineCorrelation> => {
  const out = new Map<string, TimelineCorrelation>()
  const windowMs = windowSec * 1000

  for (const atk of attacks) {
    const atkTs = Date.parse(atk.timestamp)
    if (Number.isNaN(atkTs)) continue
    const matched: TimelineAlert[] = []
    const reasons = new Set<string>()
    let firstMs = Infinity

    for (const al of alerts) {
      const alTs = Date.parse(al.ts)
      if (Number.isNaN(alTs)) continue
      const dt = alTs - atkTs
      if (dt < -5_000 || dt > windowMs) continue

      const techHit = sharesTechnique(atk, al)
      const targetHit = al.agent && atk.target.includes(al.agent)
      if (!techHit && !targetHit) continue

      matched.push(al)
      if (techHit) reasons.add('Technique MITRE partagée')
      if (targetHit) reasons.add('Même hôte ciblé')
      if (dt >= 0 && dt < 30_000) reasons.add('Fenêtre temporelle < 30s')
      if (alTs - atkTs < firstMs) firstMs = alTs - atkTs
    }

    if (matched.length) {
      out.set(atk.id, {
        attackId: atk.id,
        alertIds: matched.map((m) => m.id),
        severity: peakSeverity(matched),
        lagMs: Math.max(0, firstMs),
        reasons: [...reasons],
      })
    }
  }

  return out
}

/* -------- phases (kill-chain heuristic) -------- */

const TACTIC_ORDER: { ids: RegExp; label: string }[] = [
  { ids: /^T15(95|46|82|08)/, label: 'Reconnaissance' },
  { ids: /^T11(90|89|33)/,    label: 'Accès initial' },
  { ids: /^T10(59|68)|^T1190/, label: 'Exécution' },
  { ids: /^T1110|^T1178/,     label: 'Identifiants' },
  { ids: /^T1083|^T1057|^T1018/, label: 'Découverte' },
  { ids: /^T1505|^T1136|^T1098/, label: 'Persistance' },
  { ids: /^T1548|^T1068|^T1078/, label: 'Privilèges' },
  { ids: /^T1041|^T1567/,     label: 'Exfiltration' },
]

const tacticFor = (mitre: string[] | undefined): string | null => {
  if (!mitre) return null
  for (const t of mitre) for (const p of TACTIC_ORDER) if (p.ids.test(t)) return p.label
  return null
}

export const computePhases = (attacks: AttackEvent[]): TimelinePhase[] => {
  const sorted = [...attacks].sort((a, b) => a.timestamp.localeCompare(b.timestamp))
  const phases: TimelinePhase[] = []
  let bucket: AttackEvent[] = []
  let currentLabel: string | null = null

  const flush = () => {
    if (!bucket.length || !currentLabel) return
    const first = bucket[0]!
    const last = bucket[bucket.length - 1]!
    phases.push({
      id: `phase-${phases.length}`,
      attackIds: bucket.map((a) => a.id),
      label: currentLabel,
      start: first.timestamp,
      end: last.timestamp,
    })
    bucket = []
  }

  for (const atk of sorted) {
    const label: string = tacticFor(atk.mitre) ?? currentLabel ?? 'Activité'
    if (label !== currentLabel) { flush(); currentLabel = label }
    bucket.push(atk)
  }
  flush()
  return phases.filter((p) => p.attackIds.length >= 1)
}

/* -------- window -------- */

export const buildWindow = (
  attacks: AttackEvent[],
  alerts: TimelineAlert[],
  paddingSec = 30,
): { start: number; end: number } => {
  const all: number[] = []
  for (const a of attacks) all.push(Date.parse(a.timestamp))
  for (const a of alerts) all.push(Date.parse(a.ts))
  if (!all.length) {
    const now = Date.now()
    return { start: now - 5 * 60_000, end: now }
  }
  const min = Math.min(...all)
  const max = Math.max(...all)
  const pad = paddingSec * 1000
  return { start: min - pad, end: max + pad }
}

/* -------- lag formatting -------- */

export const formatLag = (ms: number): string => {
  if (ms < 1000) return `T+${ms}ms`
  if (ms < 60_000) return `T+${(ms / 1000).toFixed(1)}s`
  return `T+${Math.floor(ms / 60_000)}m${Math.round((ms % 60_000) / 1000)}s`
}

export const lagTone = (ms: number): 'fast' | 'ok' | 'slow' | 'critical' => {
  if (ms < 5_000) return 'fast'
  if (ms < 15_000) return 'ok'
  if (ms < 30_000) return 'slow'
  return 'critical'
}

/* -------- tool meta -------- */

export const TOOL_META: Record<AttackTool, { label: string; tint: string }> = {
  nmap:       { label: 'nmap',       tint: '#a855f7' },
  hydra:      { label: 'hydra',      tint: '#ef4444' },
  gobuster:   { label: 'gobuster',   tint: '#f59e0b' },
  sqlmap:     { label: 'sqlmap',     tint: '#fb7185' },
  curl:       { label: 'curl',       tint: '#22d3ee' },
  metasploit: { label: 'metasploit', tint: '#ef4444' },
  other:      { label: 'shell',      tint: '#a855f7' },
}

export const SEVERITY_HEX: Record<Severity, string> = {
  info:     '#3b82f6',
  low:      '#22c55e',
  medium:   '#f59e0b',
  high:     '#fb923c',
  critical: '#ef4444',
}

/* -------- plain-French storytelling -------- */

export interface AttackStory {
  /** short headline shown under the node */
  headline: string
  /** longer one-liner explaining what's happening, non-technical */
  blurb: string
  /** narrator caption used during story-mode autoplay */
  narration: string
}

const hasMitre = (atk: AttackEvent, prefix: string): boolean =>
  (atk.mitre ?? []).some((t) => t === prefix || t.startsWith(prefix + '.') || t.startsWith(prefix))

export const tellAttack = (atk: AttackEvent): AttackStory => {
  if (atk.tool === 'nmap') return {
    headline: 'Scan de ports',
    blurb: 'L\'intrus cartographie les services exposés sur la machine.',
    narration: 'Étape 1 — l\'attaquant scanne le serveur pour repérer quelles portes sont ouvertes.',
  }
  if (atk.tool === 'hydra') return {
    headline: 'Force brute SSH',
    blurb: 'Tentatives massives de mots de passe pour entrer par SSH.',
    narration: 'L\'attaquant essaie des milliers de mots de passe pour ouvrir une session.',
  }
  if (atk.tool === 'gobuster') return {
    headline: 'Pages cachées',
    blurb: 'L\'intrus liste les fichiers et dossiers du site web.',
    narration: 'Il cherche des pages d\'administration laissées sans protection.',
  }
  if (atk.tool === 'sqlmap') return {
    headline: 'Injection SQL',
    blurb: 'Tente de voler le contenu de la base de données.',
    narration: 'L\'attaquant manipule un formulaire pour aspirer la base de données.',
  }
  if (atk.tool === 'curl' && hasMitre(atk, 'T1190')) return {
    headline: 'Dépôt d\'un webshell',
    blurb: 'Installation d\'une porte dérobée sur le serveur web.',
    narration: 'Il téléverse un programme malveillant pour reprendre la main à distance.',
  }
  if (atk.tool === 'metasploit') return {
    headline: 'Exploitation',
    blurb: 'Lancement d\'un exploit prêt-à-l\'emploi contre le serveur.',
    narration: 'Il déclenche un exploit pour prendre le contrôle de la machine.',
  }
  if (atk.tool === 'other' && hasMitre(atk, 'T1548')) return {
    headline: 'Élévation de privilèges',
    blurb: 'L\'intrus tente de devenir administrateur.',
    narration: 'Une fois entré, il cherche à devenir administrateur du système.',
  }
  if (atk.tool === 'other' && hasMitre(atk, 'T1136')) return {
    headline: 'Compte caché',
    blurb: 'Création d\'un utilisateur pour revenir plus tard.',
    narration: 'Il crée un compte secret pour pouvoir revenir même si on change le mot de passe.',
  }
  if (atk.tool === 'curl') return {
    headline: 'Requête web suspecte',
    blurb: 'Manipulation directe d\'une URL du serveur.',
    narration: 'L\'attaquant envoie des requêtes inhabituelles au serveur.',
  }
  return {
    headline: 'Action attaquante',
    blurb: 'Commande exécutée par l\'intrus sur la machine compromise.',
    narration: 'L\'attaquant exécute une commande sur le serveur.',
  }
}

export const reactionLabel = (lagMs: number): { tone: 'fast' | 'ok' | 'slow' | 'critical'; text: string; emoji: string } => {
  const t = lagTone(lagMs)
  if (t === 'fast')     return { tone: t, text: 'Détection éclair',  emoji: '⚡' }
  if (t === 'ok')       return { tone: t, text: 'Détection rapide',  emoji: '✓' }
  if (t === 'slow')     return { tone: t, text: 'Détection tardive', emoji: '⏱' }
  return                       { tone: t, text: 'Détection très lente', emoji: '⏳' }
}

