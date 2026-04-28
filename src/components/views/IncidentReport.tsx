import { Printer, X } from 'lucide-react'
import { useLogStore } from '@/store/useLogStore'
import { useUiStore } from '@/store/useUiStore'
import { lookup } from '@/data/geoip'
import { techniqueById } from '@/data/mitre-matrix'

export function IncidentReport() {
  const selectedId = useUiStore((s) => s.selectedAlertId)
  const select = useUiStore((s) => s.selectAlert)
  const alerts = useLogStore((s) => s.alerts)
  const alert = alerts.find((a) => a.id === selectedId)

  if (!alert) return null

  const ip = alert.data?.srcip
  const geo = ip ? lookup(ip) : undefined
  const techniques = (alert.rule.mitre?.id ?? []).map((id) => ({ id, meta: techniqueById(id) }))

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 print:static print:bg-white print:p-0" role="dialog">
      <div className="bg-white text-slate-900 max-w-3xl w-full rounded-lg shadow-2xl print:shadow-none print:rounded-none print:max-w-none">
        <header className="flex items-center justify-between p-4 border-b border-slate-200 print:hidden">
          <h2 className="font-semibold">Incident Report</h2>
          <div className="flex gap-2">
            <button onClick={() => window.print()} className="inline-flex gap-1 items-center text-sm bg-slate-900 text-white px-3 py-1 rounded">
              <Printer className="w-4 h-4" /> Print / PDF
            </button>
            <button onClick={() => select(null)} aria-label="Close" className="p-1 rounded hover:bg-slate-100">
              <X className="w-4 h-4" />
            </button>
          </div>
        </header>

        <article className="p-6 space-y-4 print:p-10">
          <div>
            <div className="text-xs uppercase tracking-widest text-slate-500">Panopticon · SOC Incident Report</div>
            <h1 className="text-2xl font-bold mt-1">{alert.rule.description}</h1>
            <div className="text-sm text-slate-600">
              Rule <code className="font-mono">{alert.rule.id}</code> · Severity L{alert.rule.level} · {new Date(alert.timestamp).toLocaleString()}
            </div>
          </div>

          <section className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-xs uppercase text-slate-500">Agent</div>
              <div className="font-mono">{alert.agent.name} ({alert.agent.ip ?? '—'})</div>
            </div>
            <div>
              <div className="text-xs uppercase text-slate-500">Source IP</div>
              <div className="font-mono">{ip ?? '—'} {geo && `· ${geo.city}, ${geo.country}`}</div>
            </div>
            <div>
              <div className="text-xs uppercase text-slate-500">Decoder</div>
              <div className="font-mono">{alert.decoder?.name ?? '—'}</div>
            </div>
            <div>
              <div className="text-xs uppercase text-slate-500">Groups</div>
              <div className="font-mono">{(alert.rule.groups ?? []).join(', ') || '—'}</div>
            </div>
          </section>

          <section>
            <div className="text-xs uppercase text-slate-500 mb-1">MITRE ATT&amp;CK Mapping</div>
            {techniques.length === 0 && <div className="text-sm text-slate-500">No MITRE mapping.</div>}
            <ul className="space-y-1">
              {techniques.map((t) => (
                <li key={t.id} className="text-sm">
                  <code className="font-mono font-semibold">{t.id}</code> — {t.meta?.name ?? 'Unknown'}
                </li>
              ))}
            </ul>
          </section>

          {alert.full_log && (
            <section>
              <div className="text-xs uppercase text-slate-500 mb-1">Raw log</div>
              <pre className="bg-slate-100 p-3 rounded text-xs whitespace-pre-wrap font-mono">{alert.full_log}</pre>
            </section>
          )}

          <footer className="pt-4 border-t text-xs text-slate-500 flex justify-between print:fixed print:bottom-6 print:left-10 print:right-10">
            <span>Panopticon — Purple Team Correlation Engine</span>
            <span>Generated {new Date().toLocaleString()}</span>
          </footer>
        </article>
      </div>
    </div>
  )
}
