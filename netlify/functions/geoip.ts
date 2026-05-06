import type { Context } from '@netlify/functions'

export const config = { path: '/api/geoip' }

const UA =
  'Mozilla/5.0 (compatible; Tracks4Hacks-SOC/0.1; +https://tracks4hacks.local)'

interface GeoOut {
  ip: string
  lat: number
  lon: number
  country: string
  city: string
}

interface FreeIpApi {
  ipAddress: string
  latitude: number
  longitude: number
  countryCode: string
  cityName: string
}

interface IpApiCom {
  status: string
  query: string
  countryCode: string
  city: string
  lat: number
  lon: number
}

async function tryFreeIpApi(ip: string): Promise<GeoOut | null> {
  const res = await fetch(`https://freeipapi.com/api/json/${ip}`, {
    headers: { 'User-Agent': UA, Accept: 'application/json' },
  })
  if (!res.ok) throw new Error(`freeipapi http ${res.status}`)
  const d = (await res.json()) as FreeIpApi
  if (!d.latitude || !d.longitude) return null
  return {
    ip: d.ipAddress ?? ip,
    lat: d.latitude,
    lon: d.longitude,
    country: d.countryCode ?? '',
    city: d.cityName ?? '',
  }
}

async function tryIpApiCom(ip: string): Promise<GeoOut | null> {
  const res = await fetch(`http://ip-api.com/json/${ip}?fields=status,countryCode,city,lat,lon,query`)
  if (!res.ok) throw new Error(`ip-api http ${res.status}`)
  const d = (await res.json()) as IpApiCom
  if (d.status !== 'success') return null
  return {
    ip: d.query ?? ip,
    lat: d.lat,
    lon: d.lon,
    country: d.countryCode ?? '',
    city: d.city ?? '',
  }
}

async function lookup(ip: string): Promise<{ result: GeoOut | null; via: string; err?: string }> {
  try {
    const r = await tryFreeIpApi(ip)
    return { result: r, via: 'freeipapi' }
  } catch (e1) {
    try {
      const r = await tryIpApiCom(ip)
      return { result: r, via: 'ip-api' }
    } catch (e2) {
      return {
        result: null,
        via: 'none',
        err: `freeipapi:${(e1 as Error).message} ip-api:${(e2 as Error).message}`,
      }
    }
  }
}

export default async (req: Request, _ctx: Context) => {
  const url = new URL(req.url)
  const ipsParam = url.searchParams.get('ips') ?? ''
  const ips = ipsParam.split(',').map((s) => s.trim()).filter(Boolean).slice(0, 100)

  if (ips.length === 0) {
    return new Response(JSON.stringify([]), {
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const lookups = await Promise.all(ips.map(lookup))
  const results = lookups.map((l) => l.result).filter((r): r is GeoOut => r !== null)

  const byProvider = lookups.reduce<Record<string, number>>((acc, l) => {
    acc[l.via] = (acc[l.via] ?? 0) + 1
    return acc
  }, {})
  const firstErr = lookups.find((l) => l.err)?.err

  console.log(
    `[geoip] ${ips.length} ips → ${results.length} ok via`,
    byProvider,
    firstErr ? `firstErr: ${firstErr.slice(0, 200)}` : ''
  )

  return new Response(JSON.stringify(results), {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': results.length > 0 ? 'public, max-age=86400' : 'no-store',
    },
  })
}
