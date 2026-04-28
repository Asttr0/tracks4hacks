import { useLogStore } from '@/store/useLogStore'
import { useUiStore } from '@/store/useUiStore'
import { FileText } from 'lucide-react'

function levelColor(l: number): string {
  if (l >= 12) return 'text-soc-red'
  if (l >= 9)  return 'text-orange-400'
  if (l >= 6)  return 'text-soc-amber'
  return 'text-soc-muted'
}

export function AlertsTable() {
  const alerts = useLogStore((s) => s.alerts)
  const select = useUiStore((s) => s.selectAlert)

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-3">Alert Feed</h2>
      <table className="w-full text-sm">
        <thead className="text-xs uppercase tracking-wider text-soc-muted border-b border-soc-border">
          <tr><th className="text-left p-2">Time</th><th className="text-left p-2">Lvl</th><th className="text-left p-2">Description</th><th className="text-left p-2">Src IP</th><th className="text-left p-2">MITRE</th><th></th></tr>
        </thead>
        <tbody>
          {alerts.map((a) => (
            <tr key={a.id} className="border-b border-soc-border/60 hover:bg-soc-panel/60">
              <td className="p-2 font-mono text-xs text-soc-muted">{new Date(a.timestamp).toLocaleTimeString()}</td>
              <td className={`p-2 font-mono ${levelColor(a.rule.level)}`}>L{a.rule.level}</td>
              <td className="p-2">{a.rule.description}</td>
              <td className="p-2 font-mono text-xs">{a.data?.srcip ?? '—'}</td>
              <td className="p-2 font-mono text-xs">{(a.rule.mitre?.id ?? []).join(', ') || '—'}</td>
              <td className="p-2 text-right">
                <button onClick={() => select(a.id)} title="Open incident report" className="inline-flex items-center gap-1 text-xs text-soc-purple hover:underline">
                  <FileText className="w-3 h-3" /> Report
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
