import { useEffect, useMemo, useRef, useState } from 'react'
import Fuse from 'fuse.js'
import { Search, X } from 'lucide-react'
import { useUiStore, type ViewId } from '@/store/useUiStore'
import { useLogStore } from '@/store/useLogStore'

interface Item { id: string; kind: 'view' | 'alert'; label: string; hint?: string; action: () => void }

export function CommandPalette() {
  const open = useUiStore((s) => s.paletteOpen)
  const setOpen = useUiStore((s) => s.setPalette)
  const setView = useUiStore((s) => s.setView)
  const selectAlert = useUiStore((s) => s.selectAlert)
  const alerts = useLogStore((s) => s.alerts)
  const [q, setQ] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); setOpen(!open) }
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, setOpen])

  useEffect(() => { if (open) inputRef.current?.focus() }, [open])

  const items = useMemo<Item[]>(() => {
    const views: Item[] = (['timeline', 'mitre', 'coverage', 'geo', 'replay', 'alerts'] as ViewId[]).map((v) => ({
      id: `view:${v}`, kind: 'view', label: `Go to ${v}`, action: () => { setView(v); setOpen(false) }
    }))
    const alertItems: Item[] = alerts.slice(0, 200).map((a) => ({
      id: `alert:${a.id}`, kind: 'alert',
      label: `[L${a.rule.level}] ${a.rule.description}`,
      hint: a.data?.srcip ?? a.agent.name,
      action: () => { selectAlert(a.id); setOpen(false) }
    }))
    return [...views, ...alertItems]
  }, [alerts, setView, selectAlert, setOpen])

  const filtered = useMemo(() => {
    if (!q) return items.slice(0, 20)
    const fuse = new Fuse(items, { keys: ['label', 'hint'], threshold: 0.4 })
    return fuse.search(q).slice(0, 20).map((r) => r.item)
  }, [q, items])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-start justify-center pt-24" onClick={() => setOpen(false)}>
      <div className="bg-soc-panel border border-soc-border rounded-lg w-[600px] max-w-[92vw] shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-2 p-3 border-b border-soc-border">
          <Search className="w-4 h-4 text-soc-muted" />
          <input ref={inputRef} value={q} onChange={(e) => setQ(e.target.value)}
                 placeholder="Search views and alerts..."
                 className="flex-1 bg-transparent outline-none text-sm" />
          <button aria-label="Close" onClick={() => setOpen(false)}><X className="w-4 h-4 text-soc-muted" /></button>
        </div>
        <ul className="max-h-[50vh] overflow-y-auto">
          {filtered.map((it) => (
            <li key={it.id}>
              <button onClick={it.action} className="w-full flex items-center justify-between px-3 py-2 text-sm hover:bg-soc-border/40 text-left">
                <span><span className="text-[10px] uppercase text-soc-muted mr-2">{it.kind}</span>{it.label}</span>
                {it.hint && <span className="text-xs text-soc-muted">{it.hint}</span>}
              </button>
            </li>
          ))}
          {filtered.length === 0 && <li className="px-3 py-6 text-sm text-soc-muted text-center">No results</li>}
        </ul>
      </div>
    </div>
  )
}
