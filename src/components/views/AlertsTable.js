import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useLogStore } from '@/store/useLogStore';
import { useUiStore } from '@/store/useUiStore';
import { FileText } from 'lucide-react';
function levelColor(l) {
    if (l >= 12)
        return 'text-soc-red';
    if (l >= 9)
        return 'text-orange-400';
    if (l >= 6)
        return 'text-soc-amber';
    return 'text-soc-muted';
}
export function AlertsTable() {
    const alerts = useLogStore((s) => s.alerts);
    const select = useUiStore((s) => s.selectAlert);
    return (_jsxs("div", { className: "p-4", children: [_jsx("h2", { className: "text-xl font-semibold mb-3", children: "Alert Feed" }), _jsxs("table", { className: "w-full text-sm", children: [_jsx("thead", { className: "text-xs uppercase tracking-wider text-soc-muted border-b border-soc-border", children: _jsxs("tr", { children: [_jsx("th", { className: "text-left p-2", children: "Time" }), _jsx("th", { className: "text-left p-2", children: "Lvl" }), _jsx("th", { className: "text-left p-2", children: "Description" }), _jsx("th", { className: "text-left p-2", children: "Src IP" }), _jsx("th", { className: "text-left p-2", children: "MITRE" }), _jsx("th", {})] }) }), _jsx("tbody", { children: alerts.map((a) => (_jsxs("tr", { className: "border-b border-soc-border/60 hover:bg-soc-panel/60", children: [_jsx("td", { className: "p-2 font-mono text-xs text-soc-muted", children: new Date(a.timestamp).toLocaleTimeString() }), _jsxs("td", { className: `p-2 font-mono ${levelColor(a.rule.level)}`, children: ["L", a.rule.level] }), _jsx("td", { className: "p-2", children: a.rule.description }), _jsx("td", { className: "p-2 font-mono text-xs", children: a.data?.srcip ?? '—' }), _jsx("td", { className: "p-2 font-mono text-xs", children: (a.rule.mitre?.id ?? []).join(', ') || '—' }), _jsx("td", { className: "p-2 text-right", children: _jsxs("button", { onClick: () => select(a.id), title: "Open incident report", className: "inline-flex items-center gap-1 text-xs text-soc-purple hover:underline", children: [_jsx(FileText, { className: "w-3 h-3" }), " Report"] }) })] }, a.id))) })] })] }));
}
