import { useMemo } from 'react'
import { Eye, Filter, Sparkles, Timer } from 'lucide-react'
import { formatLag, type TimelineModel } from '@/lib/timeline'
import { NeonEdge } from '@/components/ui/NeonEdge'
import type { TimelineState } from './state'

interface Props {
  model: TimelineModel
  state: TimelineState
}

export const TimelineKpis = ({ model, state }: Props) => {
  const stats = useMemo(() => {
    const total = model.attacks.length
    const detected = model.detected.size
    const missed = total - detected
    const rate = total ? detected / total : 0

    let lagSum = 0; let lagN = 0
    let fastest = Infinity
    for (const c of model.correlations.values()) {
      if (Number.isFinite(c.lagMs)) {
        lagSum += c.lagMs; lagN += 1
        if (c.lagMs < fastest) fastest = c.lagMs
      }
    }
    const avgLag = lagN ? lagSum / lagN : 0

    return { total, detected, missed, rate, avgLag, fastest: Number.isFinite(fastest) ? fastest : 0 }
  }, [model])

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <RingCard
        label="Détection"
        value={`${Math.round(stats.rate * 100)}%`}
        sub={`${stats.detected} / ${stats.total}`}
        ratio={stats.rate}
        tint="#22c55e"
      />

      <StatCard
        label="Réaction"
        value={stats.avgLag ? formatLag(stats.avgLag) : '—'}
        sub={stats.fastest ? `min ${formatLag(stats.fastest)}` : ''}
        icon={Timer}
        tint={lagTint(stats.avgLag)}
      />

      <StatCard
        label="Manquées"
        value={String(stats.missed)}
        sub={stats.missed ? 'angle mort' : ''}
        icon={Filter}
        tint={stats.missed ? '#ef4444' : '#6b7280'}
        toggle={stats.missed > 0 ? {
          active: state.missedOnly,
          label: state.missedOnly ? 'Tout' : 'Filtrer',
          onClick: () => state.toggleMissedOnly(),
        } : undefined}
      />

      <StatCard
        label="Comparaison"
        value={state.phantom ? 'Manqués' : 'Tout'}
        sub=""
        icon={state.phantom ? Sparkles : Eye}
        tint="#a855f7"
        toggle={{
          active: state.phantom,
          label: state.phantom ? 'Désactiver' : 'Surligner',
          onClick: () => state.togglePhantom(),
        }}
      />
    </div>
  )
}

const lagTint = (ms: number): string => {
  if (!ms) return '#6b7280'
  if (ms < 5_000) return '#22c55e'
  if (ms < 15_000) return '#f59e0b'
  return '#ef4444'
}

const RingCard = ({ label, value, sub, ratio, tint }: {
  label: string; value: string; sub: string; ratio: number; tint: string;
}) => {
  const R = 30
  const C = 2 * Math.PI * R
  const dash = C * Math.max(0, Math.min(1, ratio))

  return (
    <div className="relative overflow-hidden rounded-lg border border-white/[0.06] bg-black/20 p-4 backdrop-blur-sm">
      <NeonEdge color={tint} intensity="bright" />
      <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-green-400">{label}</p>
      <div className="mt-3 flex items-center gap-4">
        <svg width="80" height="80" viewBox="0 0 80 80" className="shrink-0 -rotate-90">
          <circle cx="40" cy="40" r={R} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="6" />
          <circle
            cx="40" cy="40" r={R}
            fill="none"
            stroke={tint}
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={`${dash} ${C}`}
            style={{ transition: 'stroke-dasharray 0.5s ease' }}
          />
        </svg>
        <div className="min-w-0">
          <div className="font-mono text-3xl tabular-nums text-white">{value}</div>
          {sub && <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.2em] text-gray-500">{sub}</div>}
        </div>
      </div>
    </div>
  )
}

interface StatCardProps {
  label: string
  value: string
  sub: string
  icon: React.ComponentType<{ size?: number; className?: string }>
  tint: string
  toggle?: { active?: boolean; label: string; onClick: () => void }
}

const StatCard = ({ label, value, sub, icon: Icon, tint, toggle }: StatCardProps) => (
  <div className="relative overflow-hidden rounded-lg border border-white/[0.06] bg-black/20 p-4 backdrop-blur-sm">
    <NeonEdge color={tint} intensity="bright" />
    <div className="flex items-start justify-between">
      <div>
        <p className="font-mono text-[10px] tracking-[0.3em] uppercase" style={{ color: tint }}>{label}</p>
        <p className="mt-2 font-mono text-3xl tabular-nums text-white">{value}</p>
        {sub && <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.2em] text-gray-500">{sub}</p>}
      </div>
      <Icon size={16} className="text-gray-500" />
    </div>
    {toggle && (
      <button
        onClick={toggle.onClick}
        className={`mt-3 inline-flex items-center gap-1.5 rounded-sm border px-2 py-1 font-mono text-[9px] uppercase tracking-[0.25em] transition-colors ${
          toggle.active
            ? 'border-white/25 bg-white/10 text-white'
            : 'border-white/10 bg-white/[0.02] text-gray-400 hover:border-white/20 hover:text-white'
        }`}
      >
        {toggle.label}
      </button>
    )}
  </div>
)
