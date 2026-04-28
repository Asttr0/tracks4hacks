import { useMemo } from 'react'
import {
  ComposedChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend,
  Scatter, ReferenceArea, ResponsiveContainer
} from 'recharts'
import { useLogStore } from '@/store/useLogStore'
import { useUiStore } from '@/store/useUiStore'
import { correlate } from '@/lib/correlator'

const SEVERITY_COLOR: Record<string, string> = {
  info: '#64748b', low: '#3b82f6', med: '#f59e0b', high: '#f97316', critical: '#ef4444'
}

export function CorrelationTimeline() {
  const alerts = useLogStore((s) => s.alerts)
  const attacks = useUiStore((s) => s.attackLog)

  const { attackPoints, alertPoints, bands, domain } = useMemo(() => {
    const attackPoints = attacks.map((a) => ({
      x: Date.parse(a.timestamp), y: 1, label: `${a.tool} · ${a.command.slice(0, 50)}`, tool: a.tool
    }))
    const alertPoints = alerts.map((a) => ({
      x: Date.parse(a.timestamp), y: 0, label: `[L${a.rule.level}] ${a.rule.description}`, level: a.rule.level
    }))
    const bands = correlate(attacks, alerts)
    const all = [...attackPoints, ...alertPoints].map((p) => p.x).filter(Number.isFinite)
    const min = all.length ? Math.min(...all) : Date.now() - 3600_000
    const max = all.length ? Math.max(...all) : Date.now()
    return { attackPoints, alertPoints, bands, domain: [min - 30_000, max + 30_000] as [number, number] }
  }, [attacks, alerts])

  const fmt = (x: number) => new Date(x).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })

  return (
    <div className="p-4 h-full flex flex-col">
      <header className="mb-3">
        <h2 className="text-xl font-semibold">Red / Blue Correlation Timeline</h2>
        <p className="text-sm text-soc-muted">
          Top lane: Red-team commands. Bottom lane: Blue-team alerts. Shaded bands = correlated pairs (≤120s window, shared MITRE technique).
        </p>
      </header>
      <div className="flex-1 min-h-[420px] bg-soc-panel border border-soc-border rounded-lg p-3">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart margin={{ top: 20, right: 24, bottom: 20, left: 24 }}>
            <CartesianGrid stroke="#1f2937" strokeDasharray="2 4" />
            <XAxis type="number" dataKey="x" domain={domain} tickFormatter={fmt} stroke="#6b7280" allowDataOverflow />
            <YAxis type="number" dataKey="y" domain={[-0.5, 1.5]} ticks={[0, 1]}
                   tickFormatter={(v) => (v === 1 ? 'RED' : v === 0 ? 'BLUE' : '')} stroke="#6b7280" width={60} />
            <Tooltip
              contentStyle={{ background: '#0a0e1a', border: '1px solid #1f2937', fontSize: 12 }}
              labelFormatter={(v) => fmt(Number(v))}
              formatter={(_v: unknown, _n: unknown, p: { payload?: { label?: string; y?: number } }) =>
                [p.payload?.label ?? '', p.payload?.y === 1 ? 'Attack' : 'Alert'] as [string, string]
              }
            />
            <Legend wrapperStyle={{ fontSize: 12 }} />

            {bands.map((b) => (
              <ReferenceArea key={b.attackId}
                x1={Date.parse(b.start)} x2={Date.parse(b.end)}
                y1={-0.5} y2={1.5}
                stroke={SEVERITY_COLOR[b.severity]} strokeOpacity={0.6}
                fill={SEVERITY_COLOR[b.severity]} fillOpacity={0.12} />
            ))}

            <Scatter name="Red Team" data={attackPoints} fill="#ef4444" shape="triangle" />
            <Scatter name="Blue Team" data={alertPoints} fill="#3b82f6" shape="circle" />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-3 text-xs text-soc-muted flex gap-4 flex-wrap">
        <span>Correlations: <strong className="text-soc-ink">{bands.length}</strong></span>
        <span>Attacks: <strong className="text-soc-red">{attacks.length}</strong></span>
        <span>Alerts: <strong className="text-soc-blue">{alerts.length}</strong></span>
      </div>
    </div>
  )
}
