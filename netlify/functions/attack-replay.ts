import type { Context } from '@netlify/functions'
import { jsonResponse } from './_wazuh'

// Stub: in real deploy this SSHes into the lab VM and runs a scripted attack.
// Protect with a shared secret in env var REPLAY_SECRET.

const REPLAY_SECRET = process.env.REPLAY_SECRET ?? ''

export default async (req: Request, _ctx: Context) => {
  if (req.method !== 'POST') return jsonResponse(405, { error: 'method_not_allowed' })
  const auth = req.headers.get('x-replay-secret') ?? ''
  if (!REPLAY_SECRET || auth !== REPLAY_SECRET) {
    return jsonResponse(401, { error: 'unauthorized' })
  }
  const body = await req.json().catch(() => ({})) as { campaign?: string }
  const campaign = body.campaign ?? 'recon-basic'

  // TODO(taha): SSH exec using `ssh2` package. For now, return a mock plan.
  const plan = {
    campaign,
    startedAt: new Date().toISOString(),
    steps: [
      { tool: 'nmap', cmd: `nmap -sV -T4 -p 22,80,443 ${process.env.TARGET_IP ?? '10.0.0.4'}` },
      { tool: 'gobuster', cmd: `gobuster dir -u http://${process.env.TARGET_IP} -w /usr/share/wordlists/dirb/common.txt` },
      { tool: 'hydra', cmd: `hydra -l admin -P rockyou.txt ssh://${process.env.TARGET_IP}` }
    ]
  }
  return jsonResponse(202, { status: 'accepted', plan })
}
