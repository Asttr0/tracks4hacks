// Shared Wazuh API helpers for Netlify Functions.
// Credentials live in Netlify env vars. Never exposed to the client.

const WAZUH_URL = process.env.WAZUH_URL ?? ''
const WAZUH_USER = process.env.WAZUH_USER ?? ''
const WAZUH_PASS = process.env.WAZUH_PASS ?? ''
const INSECURE = process.env.WAZUH_INSECURE === '1'

let cachedToken: { value: string; expiresAt: number } | null = null
const TOKEN_TTL_MS = 14 * 60 * 1000

export async function getWazuhToken(): Promise<string> {
  const now = Date.now()
  if (cachedToken && cachedToken.expiresAt > now) return cachedToken.value

  if (!WAZUH_URL || !WAZUH_USER || !WAZUH_PASS) {
    throw new Error('Wazuh credentials not configured')
  }

  const basic = Buffer.from(`${WAZUH_USER}:${WAZUH_PASS}`).toString('base64')
  const res = await fetch(`${WAZUH_URL}/security/user/authenticate?raw=true`, {
    method: 'POST',
    headers: { Authorization: `Basic ${basic}` },
    // @ts-ignore Node fetch: bypass self-signed cert in lab
    ...(INSECURE ? { dispatcher: undefined } : {})
  })
  if (!res.ok) throw new Error(`Wazuh auth failed: ${res.status}`)
  const token = (await res.text()).trim()
  cachedToken = { value: token, expiresAt: now + TOKEN_TTL_MS }
  return token
}

export async function wazuhFetch(path: string, init: RequestInit = {}): Promise<Response> {
  const token = await getWazuhToken()
  return fetch(`${WAZUH_URL}${path}`, {
    ...init,
    headers: { ...(init.headers ?? {}), Authorization: `Bearer ${token}` }
  })
}

export const jsonResponse = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }
  })
