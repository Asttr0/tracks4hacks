import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo } from 'react';
import { useLogStore } from '@/store/useLogStore';
import { useUiStore } from '@/store/useUiStore';
import { TACTICS } from '@/data/mitre-matrix';
import { mitreCellStats, groupByTactic } from '@/lib/mitreStats';
function heatClass(count, maxCount, redHits) {
    if (redHits > 0 && count === 0)
        return 'bg-rose-900/60 border-rose-500/50';
    if (count === 0)
        return 'bg-soc-panel border-soc-border';
    const ratio = maxCount ? count / maxCount : 0;
    if (ratio > 0.66)
        return 'bg-violet-600 border-violet-400';
    if (ratio > 0.33)
        return 'bg-violet-700/70 border-violet-500/70';
    return 'bg-violet-800/50 border-violet-600/40';
}
export function MitreHeatmap() {
    const alerts = useLogStore((s) => s.alerts);
    const attacks = useUiStore((s) => s.attackLog);
    const select = useUiStore((s) => s.selectTechnique);
    const { columns, max } = useMemo(() => {
        const cells = mitreCellStats(alerts, attacks);
        const grouped = groupByTactic(cells);
        const columns = TACTICS.map((t) => ({ tactic: t, cells: grouped.get(t.id) ?? [] }));
        const max = cells.reduce((m, c) => Math.max(m, c.alertCount), 0);
        return { columns, max };
    }, [alerts, attacks]);
    return (_jsxs("div", { className: "p-4", children: [_jsxs("header", { className: "mb-4", children: [_jsx("h2", { className: "text-xl font-semibold", children: "MITRE ATT&CK Coverage" }), _jsxs("p", { className: "text-sm text-soc-muted", children: ["Purple cells = detected alerts. Red cells = red-team activity that produced ", _jsx("em", { children: "no" }), " alert (coverage gap)."] })] }), _jsx("div", { className: "grid grid-cols-[repeat(14,minmax(120px,1fr))] gap-2 overflow-x-auto pb-3", children: columns.map((col) => (_jsxs("div", { className: "flex flex-col gap-1", children: [_jsx("div", { className: "text-[11px] font-mono uppercase tracking-wider text-soc-muted text-center border-b border-soc-border pb-1", children: col.tactic.short }), col.cells.length === 0 && (_jsx("div", { className: "h-14 border border-dashed border-soc-border rounded text-[10px] flex items-center justify-center text-soc-muted", children: "\u2014" })), col.cells.map((c) => (_jsxs("button", { onClick: () => select(c.technique.id), className: `text-left rounded border p-2 transition hover:scale-[1.02] ${heatClass(c.alertCount, max, c.redTeamHits)}`, title: `${c.technique.id} — ${c.technique.name}\nAlerts: ${c.alertCount}  Red: ${c.redTeamHits}`, children: [_jsx("div", { className: "text-[10px] font-mono opacity-80", children: c.technique.id }), _jsx("div", { className: "text-[11px] leading-tight font-medium line-clamp-2", children: c.technique.name }), _jsxs("div", { className: "mt-1 flex gap-2 text-[10px] opacity-90", children: [_jsxs("span", { children: ["\uD83D\uDEE1 ", c.alertCount] }), _jsxs("span", { children: ["\uD83D\uDD34 ", c.redTeamHits] })] })] }, c.technique.id)))] }, col.tactic.id))) })] }));
}
