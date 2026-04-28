import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Activity, Grid3x3, Shield, Globe2, Zap, ListFilter } from 'lucide-react';
import { useUiStore } from '@/store/useUiStore';
const ITEMS = [
    { id: 'timeline', label: 'Timeline', icon: _jsx(Activity, { className: "w-4 h-4" }) },
    { id: 'mitre', label: 'MITRE', icon: _jsx(Grid3x3, { className: "w-4 h-4" }) },
    { id: 'coverage', label: 'Coverage', icon: _jsx(Shield, { className: "w-4 h-4" }) },
    { id: 'geo', label: 'GeoMap', icon: _jsx(Globe2, { className: "w-4 h-4" }) },
    { id: 'replay', label: 'Replay', icon: _jsx(Zap, { className: "w-4 h-4" }) },
    { id: 'alerts', label: 'Alerts', icon: _jsx(ListFilter, { className: "w-4 h-4" }) }
];
export function Sidebar() {
    const active = useUiStore((s) => s.activeView);
    const setView = useUiStore((s) => s.setView);
    return (_jsxs("aside", { className: "w-48 shrink-0 border-r border-soc-border bg-soc-panel flex flex-col", children: [_jsxs("div", { className: "p-4 border-b border-soc-border", children: [_jsx("div", { className: "text-xs font-mono text-soc-muted", children: "PANOPTICON" }), _jsx("div", { className: "text-sm font-semibold", children: "Purple Engine" })] }), _jsx("nav", { className: "flex-1 py-2", children: ITEMS.map((it) => (_jsxs("button", { onClick: () => setView(it.id), className: `w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-soc-border/50 ${active === it.id ? 'bg-soc-border/70 text-soc-purple border-l-2 border-soc-purple' : 'text-soc-ink border-l-2 border-transparent'}`, children: [it.icon, it.label] }, it.id))) }), _jsx("footer", { className: "p-3 border-t border-soc-border text-[10px] text-soc-muted font-mono", children: "ENSA 2025-2026" })] }));
}
