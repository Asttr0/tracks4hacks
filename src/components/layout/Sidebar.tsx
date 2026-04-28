import { Activity, Grid3x3, Shield, Globe2, Zap, ListFilter } from 'lucide-react'
import { useUiStore, type ViewId } from '@/store/useUiStore'

const ITEMS: { id: ViewId; label: string; icon: JSX.Element }[] = [
  { id: 'timeline', label: 'Timeline',   icon: <Activity className="w-4 h-4" /> },
  { id: 'mitre',    label: 'MITRE',      icon: <Grid3x3 className="w-4 h-4" /> },
  { id: 'coverage', label: 'Coverage',   icon: <Shield className="w-4 h-4" /> },
  { id: 'geo',      label: 'GeoMap',     icon: <Globe2 className="w-4 h-4" /> },
  { id: 'replay',   label: 'Replay',     icon: <Zap className="w-4 h-4" /> },
  { id: 'alerts',   label: 'Alerts',     icon: <ListFilter className="w-4 h-4" /> }
]

export function Sidebar() {
  const active = useUiStore((s) => s.activeView)
  const setView = useUiStore((s) => s.setView)
  return (
    <aside className="w-48 shrink-0 border-r border-soc-border bg-soc-panel flex flex-col">
      <div className="p-4 border-b border-soc-border">
        <div className="text-xs font-mono text-soc-muted">PANOPTICON</div>
        <div className="text-sm font-semibold">Purple Engine</div>
      </div>
      <nav className="flex-1 py-2">
        {ITEMS.map((it) => (
          <button key={it.id} onClick={() => setView(it.id)}
            className={`w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-soc-border/50 ${
              active === it.id ? 'bg-soc-border/70 text-soc-purple border-l-2 border-soc-purple' : 'text-soc-ink border-l-2 border-transparent'
            }`}>
            {it.icon}{it.label}
          </button>
        ))}
      </nav>
      <footer className="p-3 border-t border-soc-border text-[10px] text-soc-muted font-mono">
        ENSA 2025-2026
      </footer>
    </aside>
  )
}
