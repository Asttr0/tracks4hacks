import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Play, Shield, AlertTriangle } from 'lucide-react';
export function AttackReplay() {
    const [campaign, setCampaign] = useState('recon-basic');
    const [secret, setSecret] = useState('');
    const [running, setRunning] = useState(false);
    const [plan, setPlan] = useState(null);
    const [err, setErr] = useState(null);
    async function trigger() {
        setRunning(true);
        setErr(null);
        setPlan(null);
        try {
            const r = await fetch('/api/attack-replay', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'x-replay-secret': secret },
                body: JSON.stringify({ campaign })
            });
            const body = (await r.json());
            if (!r.ok)
                throw new Error(body.error ?? `HTTP ${r.status}`);
            setPlan(body.plan);
        }
        catch (e) {
            setErr(e.message);
        }
        finally {
            setRunning(false);
        }
    }
    return (_jsxs("div", { className: "p-4 max-w-3xl", children: [_jsxs("header", { className: "mb-4", children: [_jsx("h2", { className: "text-xl font-semibold", children: "Attack Replay" }), _jsx("p", { className: "text-sm text-soc-muted", children: "Fires a scripted Red-team campaign on the lab VM so alerts appear live during the demo." })] }), _jsxs("div", { className: "rounded-lg border border-amber-600/40 bg-amber-900/20 p-3 text-sm flex gap-2 items-start mb-4", children: [_jsx(AlertTriangle, { className: "w-4 h-4 mt-0.5 text-amber-400 shrink-0" }), _jsxs("div", { children: [_jsx("strong", { children: "Authorized use only." }), " This triggers real attack tooling against ", _jsx("code", { children: "10.0.0.4" }), " (your own VM). The BFF requires ", _jsx("code", { children: "REPLAY_SECRET" }), " to authorize."] })] }), _jsxs("div", { className: "space-y-3 bg-soc-panel border border-soc-border rounded-lg p-4", children: [_jsxs("label", { className: "block", children: [_jsx("span", { className: "text-xs uppercase tracking-wider text-soc-muted", children: "Campaign" }), _jsxs("select", { value: campaign, onChange: (e) => setCampaign(e.target.value), className: "mt-1 w-full bg-soc-bg border border-soc-border rounded px-2 py-1 font-mono text-sm", children: [_jsx("option", { value: "recon-basic", children: "recon-basic (nmap)" }), _jsx("option", { value: "brute-force", children: "brute-force (hydra ssh)" }), _jsx("option", { value: "web-enum", children: "web-enum (gobuster)" }), _jsx("option", { value: "full-kill-chain", children: "full-kill-chain (all tools)" })] })] }), _jsxs("label", { className: "block", children: [_jsx("span", { className: "text-xs uppercase tracking-wider text-soc-muted", children: "Replay secret" }), _jsx("input", { type: "password", value: secret, onChange: (e) => setSecret(e.target.value), className: "mt-1 w-full bg-soc-bg border border-soc-border rounded px-2 py-1 font-mono text-sm" })] }), _jsxs("button", { onClick: trigger, disabled: running || !secret, className: "inline-flex items-center gap-2 bg-soc-red/80 hover:bg-soc-red text-white px-4 py-2 rounded font-semibold disabled:opacity-40", children: [_jsx(Play, { className: "w-4 h-4" }), " ", running ? 'Firing...' : 'Launch campaign'] })] }), err && (_jsx("div", { className: "mt-3 text-sm text-soc-red border border-soc-red/40 rounded p-2 bg-soc-red/10", children: err })), plan && (_jsxs("div", { className: "mt-4 rounded-lg border border-soc-border bg-soc-panel p-4", children: [_jsxs("div", { className: "flex items-center gap-2 mb-2", children: [_jsx(Shield, { className: "w-4 h-4 text-soc-green" }), _jsxs("span", { className: "text-sm", children: ["Campaign ", _jsx("code", { className: "text-soc-amber", children: plan.campaign }), " queued at ", new Date(plan.startedAt).toLocaleTimeString()] })] }), _jsx("ol", { className: "space-y-1 text-xs font-mono", children: plan.steps.map((s, i) => (_jsxs("li", { className: "flex gap-2", children: [_jsxs("span", { className: "text-soc-muted w-4", children: [i + 1, "."] }), _jsxs("span", { className: "text-soc-red", children: ["[", s.tool, "]"] }), _jsx("span", { className: "text-soc-ink", children: s.cmd })] }, i))) })] }))] }));
}
