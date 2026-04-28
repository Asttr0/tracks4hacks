import type { Context } from '@netlify/functions'
import { wazuhFetch, jsonResponse } from './_wazuh'

export default async (req: Request, _ctx: Context) => {
  try {
    const url = new URL(req.url)
    const limit = url.searchParams.get('limit') ?? '100'
    const since = url.searchParams.get('since') ?? ''
    const q = since ? `&q=timestamp>${encodeURIComponent(since)}` : ''
    const res = await wazuhFetch(`/alerts?limit=${limit}${q}&sort=-timestamp`)
    if (!res.ok) return jsonResponse(res.status, { error: 'upstream_error' })
    const data = await res.json()
    return jsonResponse(200, data)
  } catch (err) {
    return jsonResponse(500, { error: (err as Error).message })
  }
}
