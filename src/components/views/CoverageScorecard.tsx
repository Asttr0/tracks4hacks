import { useMemo } from 'react'
import { useLogStore } from '@/store/useLogStore'
import { useUiStore } from '@/store/useUiStore'
import { coverageReport } from '@/lib/coverage'
import { techniqueById } from '@/data/mitre-matrix'

function Kpi({ label, value, tone = 'ink' }: { label: string; value: string; tone?: 'ink' | 'green' | 'red' | 'amber' }) {
  const color = tone === 'green' ? 'text-soc-green'
    : tone === 'red' ? 'text-soc-red'
    : tone === 'amber' ? 'text-soc-amber' : 'text-soc-ink'
  return (
    <div className="rounded-lg border border-soc-border bg-soc-panel p-4">
      <div className="text-[11px] uppercase tracking-wider text-soc-muted">{label}</div>
      <div className={`text-2xl font-mono mt-1 ${color}`}>{value}</div>
    </div>
  )
}

export function CoverageScorecard() {
  const alerts = useLogStore((s) => s.alerts)
  const attacks = useUiStore((s) => s.attackLog)

  const report = useMemo(() => coverageReport(attacks, alerts), [alerts, attacks])
  const rate = (report.detectionRate * 100).toFixed(1)

  return (
    <div className="p-4 space-y-5">
      <header>
        <h2 className="text-xl font-semibold">Detection Coverage Scorecard</h2>
        <p className="text-sm text-soc-muted">Purple-team evaluation: which Red-team actions did the Blue-team stack actually catch?</p>
      </header>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Kpi label="Attacks launched" value={String(report.totalAttacks)} />
        <Kpi label="Detected" value={String(report.detectedAttacks)} tone="green" />
        <Kpi label="Missed" value={String(report.missedAttacks)} tone="red" />
        <Kpi label="Detection rate" value={`${rate}%`}
             tone={report.detectionRate >= 0.8 ? 'green' : report.detectionRate >= 0.5 ? 'amber' : 'red'} />
      </div>

      <section>
        <h3 className="text-sm font-semibold mb-2 text-soc-muted uppercase tracking-wide">By tool</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {Object.entries(report.byTool)
            .filter(([, v]) => v.launched > 0)
            .map(([tool, v]) => (
              <div key={tool} className="rounded border border-soc-border bg-soc-panel p-3">
                <div className="text-xs uppercase tracking-wider text-soc-muted">{tool}</div>
                <div className="font-mono">
                  <span className="text-soc-green">{v.detected}</span>
                  <span className="text-soc-muted"> / {v.launched}</span>
                </div>
                <div className="h-1 bg-soc-border rounded mt-2 overflow-hidden">
                  <div className="h-full bg-soc-green" style={{ width: `${(v.detected / v.launched) * 100}%` }} />
                </div>
              </div>
            ))}
        </div>
      </section>

      <section>
        <h3 className="text-sm font-semibold mb-2 text-soc-muted uppercase tracking-wide">By MITRE technique</h3>
        <table className="w-full text-sm border border-soc-border rounded overflow-hidden">
          <thead className="bg-soc-panel text-xs uppercase tracking-wider text-soc-muted">
            <tr>
              <th className="text-left p-2">ID</th>
              <th className="text-left p-2">Technique</th>
              <th className="text-right p-2">Launched</th>
              <th className="text-right p-2">Detected</th>
              <th className="text-right p-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {report.byTechnique.map((t) => {
              const tech = techniqueById(t.techniqueId)
              const ok = t.detected === t.launched
              return (
                <tr key={t.techniqueId} className="border-t border-soc-border">
                  <td className="p-2 font-mono text-xs">{t.techniqueId}</td>
                  <td className="p-2">{tech?.name ?? '—'}</td>
                  <td className="p-2 text-right font-mono">{t.launched}</td>
                  <td className="p-2 text-right font-mono">{t.detected}</td>
                  <td className={`p-2 text-right font-mono ${ok ? 'text-soc-green' : t.detected ? 'text-soc-amber' : 'text-soc-red'}`}>
                    {ok ? 'COVERED' : t.detected ? 'PARTIAL' : 'GAP'}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </section>
    </div>
  )
}
