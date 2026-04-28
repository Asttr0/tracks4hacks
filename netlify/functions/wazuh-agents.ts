import type { Context } from '@netlify/functions'
import { wazuhFetch, jsonResponse } from './_wazuh'

export default async (_req: Request, _ctx: Context) => {
  try {
    const res = await wazuhFetch('/agents?limit=500')
    if (!res.ok) return jsonResponse(res.status, { error: 'upstream_error' })
    return jsonResponse(200, await res.json())
  } catch (err) {
    return jsonResponse(500, { error: (err as Error).message })
  }
}
