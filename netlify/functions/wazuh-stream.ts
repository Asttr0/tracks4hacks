import type { Context } from '@netlify/functions'
import { wazuhFetch } from './_wazuh'

export const config = { path: '/api/stream' }

export default async (_req: Request, _ctx: Context) => {
  const encoder = new TextEncoder()
  let lastTs = new Date(Date.now() - 60_000).toISOString()

  const stream = new ReadableStream({
    async start(controller) {
      const tick = async () => {
        try {
          const res = await wazuhFetch(`/alerts?limit=50&q=timestamp>${encodeURIComponent(lastTs)}&sort=+timestamp`)
          if (res.ok) {
            const body = await res.json() as { data?: { affected_items?: Array<{ timestamp?: string }> } }
            const items = body.data?.affected_items ?? []
            if (items.length) {
              const last = items[items.length - 1]
              if (last?.timestamp) lastTs = last.timestamp
              controller.enqueue(encoder.encode(`event: alerts\ndata: ${JSON.stringify(items)}\n\n`))
            } else {
              controller.enqueue(encoder.encode(`: keepalive\n\n`))
            }
          }
        } catch (e) {
          controller.enqueue(encoder.encode(`event: error\ndata: ${JSON.stringify({ error: (e as Error).message })}\n\n`))
        }
      }
      const iv = setInterval(tick, 5000)
      tick()
      setTimeout(() => { clearInterval(iv); controller.close() }, 55_000)
    }
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive'
    }
  })
}
