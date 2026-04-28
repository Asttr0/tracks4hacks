import { useState } from 'react'
import { Play, Shield, AlertTriangle } from 'lucide-react'

interface ReplayStep { tool: string; cmd: string }
interface ReplayResp { status: string; plan: { campaign: string; startedAt: string; steps: ReplayStep[] } }

export function AttackReplay() {
  const [campaign, setCampaign] = useState('recon-basic')
  const [secret, setSecret] = useState('')
  const [running, setRunning] = useState(false)
  const [plan, setPlan] = useState<ReplayResp['plan'] | null>(null)
  const [err, setErr] = useState<string | null>(null)

  async function trigger() {
    setRunning(true); setErr(null); setPlan(null)
    try {
      const r = await fetch('/api/attack-replay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-replay-secret': secret },
        body: JSON.stringify({ campaign })
      })
      const body = (await r.json()) as ReplayResp
      if (!r.ok) throw new Error((body as unknown as { error?: string }).error ?? `HTTP ${r.status}`)
      setPlan(body.plan)
    } catch (e) {
      setErr((e as Error).message)
    } finally {
      setRunning(false)
    }
  }

  return (
    <div className="p-4 max-w-3xl">
      <header className="mb-4">
        <h2 className="text-xl font-semibold">Attack Replay</h2>
        <p className="text-sm text-soc-muted">
          Fires a scripted Red-team campaign on the lab VM so alerts appear live during the demo.
        </p>
      </header>

      <div className="rounded-lg border border-amber-600/40 bg-amber-900/20 p-3 text-sm flex gap-2 items-start mb-4">
        <AlertTriangle className="w-4 h-4 mt-0.5 text-amber-400 shrink-0" />
        <div>
          <strong>Authorized use only.</strong> This triggers real attack tooling against <code>10.0.0.4</code> (your own VM).
          The BFF requires <code>REPLAY_SECRET</code> to authorize.
        </div>
      </div>

      <div className="space-y-3 bg-soc-panel border border-soc-border rounded-lg p-4">
        <label className="block">
          <span className="text-xs uppercase tracking-wider text-soc-muted">Campaign</span>
          <select value={campaign} onChange={(e) => setCampaign(e.target.value)}
                  className="mt-1 w-full bg-soc-bg border border-soc-border rounded px-2 py-1 font-mono text-sm">
            <option value="recon-basic">recon-basic (nmap)</option>
            <option value="brute-force">brute-force (hydra ssh)</option>
            <option value="web-enum">web-enum (gobuster)</option>
            <option value="full-kill-chain">full-kill-chain (all tools)</option>
          </select>
        </label>
        <label className="block">
          <span className="text-xs uppercase tracking-wider text-soc-muted">Replay secret</span>
          <input type="password" value={secret} onChange={(e) => setSecret(e.target.value)}
                 className="mt-1 w-full bg-soc-bg border border-soc-border rounded px-2 py-1 font-mono text-sm" />
        </label>
        <button onClick={trigger} disabled={running || !secret}
                className="inline-flex items-center gap-2 bg-soc-red/80 hover:bg-soc-red text-white px-4 py-2 rounded font-semibold disabled:opacity-40">
          <Play className="w-4 h-4" /> {running ? 'Firing...' : 'Launch campaign'}
        </button>
      </div>

      {err && (
        <div className="mt-3 text-sm text-soc-red border border-soc-red/40 rounded p-2 bg-soc-red/10">{err}</div>
      )}

      {plan && (
        <div className="mt-4 rounded-lg border border-soc-border bg-soc-panel p-4">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="w-4 h-4 text-soc-green" />
            <span className="text-sm">Campaign <code className="text-soc-amber">{plan.campaign}</code> queued at {new Date(plan.startedAt).toLocaleTimeString()}</span>
          </div>
          <ol className="space-y-1 text-xs font-mono">
            {plan.steps.map((s, i) => (
              <li key={i} className="flex gap-2">
                <span className="text-soc-muted w-4">{i + 1}.</span>
                <span className="text-soc-red">[{s.tool}]</span>
                <span className="text-soc-ink">{s.cmd}</span>
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  )
}
