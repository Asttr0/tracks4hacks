import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useMemo, useRef, useState } from 'react';
import Fuse from 'fuse.js';
import { Search, X } from 'lucide-react';
import { useUiStore } from '@/store/useUiStore';
import { useLogStore } from '@/store/useLogStore';
export function CommandPalette() {
    const open = useUiStore((s) => s.paletteOpen);
    const setOpen = useUiStore((s) => s.setPalette);
    const setView = useUiStore((s) => s.setView);
    const selectAlert = useUiStore((s) => s.selectAlert);
    const alerts = useLogStore((s) => s.alerts);
    const [q, setQ] = useState('');
    const inputRef = useRef(null);
    useEffect(() => {
        const onKey = (e) => {
            if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
                e.preventDefault();
                setOpen(!open);
            }
            if (e.key === 'Escape')
                setOpen(false);
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [open, setOpen]);
    useEffect(() => { if (open)
        inputRef.current?.focus(); }, [open]);
    const items = useMemo(() => {
        const views = ['timeline', 'mitre', 'coverage', 'geo', 'replay', 'alerts'].map((v) => ({
            id: `view:${v}`, kind: 'view', label: `Go to ${v}`, action: () => { setView(v); setOpen(false); }
        }));
        const alertItems = alerts.slice(0, 200).map((a) => ({
            id: `alert:${a.id}`, kind: 'alert',
            label: `[L${a.rule.level}] ${a.rule.description}`,
            hint: a.data?.srcip ?? a.agent.name,
            action: () => { selectAlert(a.id); setOpen(false); }
        }));
        return [...views, ...alertItems];
    }, [alerts, setView, selectAlert, setOpen]);
    const filtered = useMemo(() => {
        if (!q)
            return items.slice(0, 20);
        const fuse = new Fuse(items, { keys: ['label', 'hint'], threshold: 0.4 });
        return fuse.search(q).slice(0, 20).map((r) => r.item);
    }, [q, items]);
    if (!open)
        return null;
    return (_jsx("div", { className: "fixed inset-0 z-50 bg-black/60 flex items-start justify-center pt-24", onClick: () => setOpen(false), children: _jsxs("div", { className: "bg-soc-panel border border-soc-border rounded-lg w-[600px] max-w-[92vw] shadow-2xl", onClick: (e) => e.stopPropagation(), children: [_jsxs("div", { className: "flex items-center gap-2 p-3 border-b border-soc-border", children: [_jsx(Search, { className: "w-4 h-4 text-soc-muted" }), _jsx("input", { ref: inputRef, value: q, onChange: (e) => setQ(e.target.value), placeholder: "Search views and alerts...", className: "flex-1 bg-transparent outline-none text-sm" }), _jsx("button", { "aria-label": "Close", onClick: () => setOpen(false), children: _jsx(X, { className: "w-4 h-4 text-soc-muted" }) })] }), _jsxs("ul", { className: "max-h-[50vh] overflow-y-auto", children: [filtered.map((it) => (_jsx("li", { children: _jsxs("button", { onClick: it.action, className: "w-full flex items-center justify-between px-3 py-2 text-sm hover:bg-soc-border/40 text-left", children: [_jsxs("span", { children: [_jsx("span", { className: "text-[10px] uppercase text-soc-muted mr-2", children: it.kind }), it.label] }), it.hint && _jsx("span", { className: "text-xs text-soc-muted", children: it.hint })] }) }, it.id))), filtered.length === 0 && _jsx("li", { className: "px-3 py-6 text-sm text-soc-muted text-center", children: "No results" })] })] }) }));
}
