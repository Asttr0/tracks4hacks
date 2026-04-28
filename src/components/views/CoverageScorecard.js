import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo } from 'react';
import { useLogStore } from '@/store/useLogStore';
import { useUiStore } from '@/store/useUiStore';
import { coverageReport } from '@/lib/coverage';
import { techniqueById } from '@/data/mitre-matrix';
function Kpi({ label, value, tone = 'ink' }) {
    const color = tone === 'green' ? 'text-soc-green'
        : tone === 'red' ? 'text-soc-red'
            : tone === 'amber' ? 'text-soc-amber' : 'text-soc-ink';
    return (_jsxs("div", { className: "rounded-lg border border-soc-border bg-soc-panel p-4", children: [_jsx("div", { className: "text-[11px] uppercase tracking-wider text-soc-muted", children: label }), _jsx("div", { className: `text-2xl font-mono mt-1 ${color}`, children: value })] }));
}
export function CoverageScorecard() {
    const alerts = useLogStore((s) => s.alerts);
    const attacks = useUiStore((s) => s.attackLog);
    const report = useMemo(() => coverageReport(attacks, alerts), [alerts, attacks]);
    const rate = (report.detectionRate * 100).toFixed(1);
    return (_jsxs("div", { className: "p-4 space-y-5", children: [_jsxs("header", { children: [_jsx("h2", { className: "text-xl font-semibold", children: "Detection Coverage Scorecard" }), _jsx("p", { className: "text-sm text-soc-muted", children: "Purple-team evaluation: which Red-team actions did the Blue-team stack actually catch?" })] }), _jsxs("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-3", children: [_jsx(Kpi, { label: "Attacks launched", value: String(report.totalAttacks) }), _jsx(Kpi, { label: "Detected", value: String(report.detectedAttacks), tone: "green" }), _jsx(Kpi, { label: "Missed", value: String(report.missedAttacks), tone: "red" }), _jsx(Kpi, { label: "Detection rate", value: `${rate}%`, tone: report.detectionRate >= 0.8 ? 'green' : report.detectionRate >= 0.5 ? 'amber' : 'red' })] }), _jsxs("section", { children: [_jsx("h3", { className: "text-sm font-semibold mb-2 text-soc-muted uppercase tracking-wide", children: "By tool" }), _jsx("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-2", children: Object.entries(report.byTool)
                            .filter(([, v]) => v.launched > 0)
                            .map(([tool, v]) => (_jsxs("div", { className: "rounded border border-soc-border bg-soc-panel p-3", children: [_jsx("div", { className: "text-xs uppercase tracking-wider text-soc-muted", children: tool }), _jsxs("div", { className: "font-mono", children: [_jsx("span", { className: "text-soc-green", children: v.detected }), _jsxs("span", { className: "text-soc-muted", children: [" / ", v.launched] })] }), _jsx("div", { className: "h-1 bg-soc-border rounded mt-2 overflow-hidden", children: _jsx("div", { className: "h-full bg-soc-green", style: { width: `${(v.detected / v.launched) * 100}%` } }) })] }, tool))) })] }), _jsxs("section", { children: [_jsx("h3", { className: "text-sm font-semibold mb-2 text-soc-muted uppercase tracking-wide", children: "By MITRE technique" }), _jsxs("table", { className: "w-full text-sm border border-soc-border rounded overflow-hidden", children: [_jsx("thead", { className: "bg-soc-panel text-xs uppercase tracking-wider text-soc-muted", children: _jsxs("tr", { children: [_jsx("th", { className: "text-left p-2", children: "ID" }), _jsx("th", { className: "text-left p-2", children: "Technique" }), _jsx("th", { className: "text-right p-2", children: "Launched" }), _jsx("th", { className: "text-right p-2", children: "Detected" }), _jsx("th", { className: "text-right p-2", children: "Status" })] }) }), _jsx("tbody", { children: report.byTechnique.map((t) => {
                                    const tech = techniqueById(t.techniqueId);
                                    const ok = t.detected === t.launched;
                                    return (_jsxs("tr", { className: "border-t border-soc-border", children: [_jsx("td", { className: "p-2 font-mono text-xs", children: t.techniqueId }), _jsx("td", { className: "p-2", children: tech?.name ?? '—' }), _jsx("td", { className: "p-2 text-right font-mono", children: t.launched }), _jsx("td", { className: "p-2 text-right font-mono", children: t.detected }), _jsx("td", { className: `p-2 text-right font-mono ${ok ? 'text-soc-green' : t.detected ? 'text-soc-amber' : 'text-soc-red'}`, children: ok ? 'COVERED' : t.detected ? 'PARTIAL' : 'GAP' })] }, t.techniqueId));
                                }) })] })] })] }));
}
