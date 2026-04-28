import { useMemo } from 'react'
import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps'
import { useLogStore } from '@/store/useLogStore'
import { lookup } from '@/data/geoip'

const GEO_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json'

export function GeoMap() {
  const alerts = useLogStore((s) => s.alerts)

  const markers = useMemo(() => {
    const agg = new Map<string, { lat: number; lon: number; city: string; country: string; count: number }>()
    for (const a of alerts) {
      const ip = a.data?.srcip
      if (!ip) continue
      const geo = lookup(ip)
      if (!geo) continue
      const prev = agg.get(ip) ?? { lat: geo.lat, lon: geo.lon, city: geo.city, country: geo.country, count: 0 }
      prev.count += 1
      agg.set(ip, prev)
    }
    return Array.from(agg.entries()).map(([ip, v]) => ({ ip, ...v }))
  }, [alerts])

  const maxCount = markers.reduce((m, x) => Math.max(m, x.count), 1)

  return (
    <div className="p-4">
      <header className="mb-3">
        <h2 className="text-xl font-semibold">Attacker GeoIP Map</h2>
        <p className="text-sm text-soc-muted">Source IPs from Wazuh alerts, geolocated against a static GeoLite2 snapshot.</p>
      </header>
      <div className="rounded-lg border border-soc-border bg-soc-panel p-3">
        <ComposableMap projection="geoEqualEarth" style={{ width: '100%', height: 'auto' }}>
          <Geographies geography={GEO_URL}>
            {({ geographies }) =>
              geographies.map((geo) => (
                <Geography key={geo.rsmKey} geography={geo}
                  fill="#111827" stroke="#1f2937" strokeWidth={0.4}
                  style={{ default: { outline: 'none' }, hover: { fill: '#1f2937', outline: 'none' } }} />
              ))
            }
          </Geographies>
          {markers.map((m) => {
            const r = 4 + (m.count / maxCount) * 10
            return (
              <Marker key={m.ip} coordinates={[m.lon, m.lat]}>
                <circle r={r} fill="#ef4444" fillOpacity={0.35} stroke="#ef4444" strokeWidth={1.2} />
                <text y={-r - 4} textAnchor="middle" style={{ fill: '#e5e7eb', fontSize: 9, fontFamily: 'ui-monospace' }}>
                  {m.city} ({m.count})
                </text>
              </Marker>
            )
          })}
        </ComposableMap>
        {markers.length === 0 && (
          <div className="text-sm text-soc-muted text-center py-6">
            No geolocated source IPs in current alerts.
          </div>
        )}
      </div>
    </div>
  )
}
