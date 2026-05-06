import type { Context } from '@netlify/functions'

export const config = { path: '/api/stream' }

const INDEXER_URL = process.env.INDEXER_URL ?? ''
const INDEXER_PROXY_TOKEN = process.env.INDEXER_PROXY_TOKEN ?? ''

if (process.env.WAZUH_INSECURE === '1') process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

const TICK_MS = 5000
const LIFETIME_MS = 55_000

async function fetchAlertsSince(since: string): Promise<unknown[]> {
  const query = {
    size: 50,
    sort: [{ timestamp: { order: 'asc' } }],
    query: { range: { timestamp: { gt: since } } },
    _source: ['timestamp', 'rule', 'agent', 'data', 'location', 'full_log'],
  }
  const res = await fetch(`${INDEXER_URL}/wazuh-alerts-*/_search`, {
    method: 'POST',
    headers: {
      'X-Proxy-Token': INDEXER_PROXY_TOKEN,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(query),
  })
  if (!res.ok) throw new Error(`Indexer error: ${res.status}`)
  const body = await res.json() as { hits?: { hits?: Array<{ _source: unknown }> } }
  return body.hits?.hits?.map((h) => h._source) ?? []
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

export default async (_req: Request, _ctx: Context) => {
  const encoder = new TextEncoder()
  let lastTs = new Date(Date.now() - 30 * 24 * 60 * 60_000).toISOString()

  const stream = new ReadableStream({
    async start(controller) {
      // Flush an immediate comment so the browser fires onopen right away.
      controller.enqueue(encoder.encode(`: ready\n\n`))

      const startedAt = Date.now()
      let closed = false

      try {
        while (!closed && Date.now() - startedAt < LIFETIME_MS) {
          try {
            const items = await fetchAlertsSince(lastTs)
            if (items.length) {
              const last = items[items.length - 1] as Record<string, unknown>
              if (last?.timestamp) lastTs = last.timestamp as string
              controller.enqueue(
                encoder.encode(`event: alerts\ndata: ${JSON.stringify(items)}\n\n`)
              )
            } else {
              controller.enqueue(encoder.encode(`: keepalive\n\n`))
            }
          } catch (e) {
            controller.enqueue(
              encoder.encode(
                `event: error\ndata: ${JSON.stringify({ error: (e as Error).message })}\n\n`
              )
            )
          }
          await sleep(TICK_MS)
        }
      } finally {
        closed = true
        try { controller.close() } catch { /* already closed */ }
      }
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
      'X-Accel-Buffering': 'no',
    },
  })
}
