import type { Context } from '@netlify/functions'

export const config = { path: '/api/stream' }

const INDEXER_URL = process.env.INDEXER_URL ?? ''
const INDEXER_PROXY_TOKEN = process.env.INDEXER_PROXY_TOKEN ?? ''

if (process.env.WAZUH_INSECURE === '1') process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

const TICK_MS = 5000
const LIFETIME_MS = 55_000
const RECENT_WINDOW_MS = 60 * 60 * 1000 // last hour
const RECENT_LIMIT = 200

const SOURCE_FIELDS = ['timestamp', 'rule', 'agent', 'data', 'location', 'full_log']

async function indexerSearch(query: unknown): Promise<unknown[]> {
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

/** First tick: most recent N alerts (desc) → re-emitted in chronological order. */
async function fetchRecent(): Promise<unknown[]> {
  const items = await indexerSearch({
    size: RECENT_LIMIT,
    sort: [{ timestamp: { order: 'desc' } }],
    query: { range: { timestamp: { gte: new Date(Date.now() - RECENT_WINDOW_MS).toISOString() } } },
    _source: SOURCE_FIELDS,
  })
  return items.reverse()
}

/** Tail: alerts strictly after `since`, ascending. */
async function fetchAlertsSince(since: string): Promise<unknown[]> {
  return indexerSearch({
    size: 50,
    sort: [{ timestamp: { order: 'asc' } }],
    query: { range: { timestamp: { gt: since } } },
    _source: SOURCE_FIELDS,
  })
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

export default async (_req: Request, _ctx: Context) => {
  const encoder = new TextEncoder()
  let lastTs = new Date(Date.now() - RECENT_WINDOW_MS).toISOString()

  const stream = new ReadableStream({
    async start(controller) {
      controller.enqueue(encoder.encode(`: ready\n\n`))

      const startedAt = Date.now()
      let closed = false
      let primed = false

      try {
        while (!closed && Date.now() - startedAt < LIFETIME_MS) {
          try {
            // First tick: prime with the most recent alerts so the UI fills instantly.
            const items = primed ? await fetchAlertsSince(lastTs) : await fetchRecent()
            primed = true
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
