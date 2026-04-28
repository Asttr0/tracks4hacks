import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Search, Wifi, WifiOff } from 'lucide-react';
import { useUiStore } from '@/store/useUiStore';
import { useLogStore } from '@/store/useLogStore';
export function TopBar() {
    const demoMode = useUiStore((s) => s.demoMode);
    const toggleDemo = useUiStore((s) => s.toggleDemo);
    const setPalette = useUiStore((s) => s.setPalette);
    const alerts = useLogStore((s) => s.alerts);
    return (_jsxs("header", { className: "h-12 flex items-center justify-between border-b border-soc-border bg-soc-panel px-4", children: [_jsxs("button", { onClick: () => setPalette(true), className: "flex items-center gap-2 text-sm text-soc-muted bg-soc-bg border border-soc-border rounded px-3 py-1 w-72 hover:text-soc-ink", children: [_jsx(Search, { className: "w-4 h-4" }), " Search alerts or jump to view...", _jsx("kbd", { className: "ml-auto text-[10px] font-mono px-1 bg-soc-border rounded", children: "\u2318K" })] }), _jsxs("div", { className: "flex items-center gap-3 text-xs font-mono", children: [_jsxs("span", { className: "text-soc-muted", children: [alerts.length, " alerts"] }), _jsx("button", { onClick: toggleDemo, className: `inline-flex items-center gap-1 px-2 py-1 rounded border text-xs ${demoMode ? 'border-soc-amber/40 text-soc-amber bg-soc-amber/10' : 'border-soc-green/40 text-soc-green bg-soc-green/10'}`, children: demoMode ? _jsxs(_Fragment, { children: [_jsx(WifiOff, { className: "w-3 h-3" }), " Demo Mode"] }) : _jsxs(_Fragment, { children: [_jsx(Wifi, { className: "w-3 h-3" }), " Live"] }) })] })] }));
}
