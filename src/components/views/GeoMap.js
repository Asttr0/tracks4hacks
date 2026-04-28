import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo } from 'react';
import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps';
import { useLogStore } from '@/store/useLogStore';
import { lookup } from '@/data/geoip';
const GEO_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';
export function GeoMap() {
    const alerts = useLogStore((s) => s.alerts);
    const markers = useMemo(() => {
        const agg = new Map();
        for (const a of alerts) {
            const ip = a.data?.srcip;
            if (!ip)
                continue;
            const geo = lookup(ip);
            if (!geo)
                continue;
            const prev = agg.get(ip) ?? { lat: geo.lat, lon: geo.lon, city: geo.city, country: geo.country, count: 0 };
            prev.count += 1;
            agg.set(ip, prev);
        }
        return Array.from(agg.entries()).map(([ip, v]) => ({ ip, ...v }));
    }, [alerts]);
    const maxCount = markers.reduce((m, x) => Math.max(m, x.count), 1);
    return (_jsxs("div", { className: "p-4", children: [_jsxs("header", { className: "mb-3", children: [_jsx("h2", { className: "text-xl font-semibold", children: "Attacker GeoIP Map" }), _jsx("p", { className: "text-sm text-soc-muted", children: "Source IPs from Wazuh alerts, geolocated against a static GeoLite2 snapshot." })] }), _jsxs("div", { className: "rounded-lg border border-soc-border bg-soc-panel p-3", children: [_jsxs(ComposableMap, { projection: "geoEqualEarth", style: { width: '100%', height: 'auto' }, children: [_jsx(Geographies, { geography: GEO_URL, children: ({ geographies }) => geographies.map((geo) => (_jsx(Geography, { geography: geo, fill: "#111827", stroke: "#1f2937", strokeWidth: 0.4, style: { default: { outline: 'none' }, hover: { fill: '#1f2937', outline: 'none' } } }, geo.rsmKey))) }), markers.map((m) => {
                                const r = 4 + (m.count / maxCount) * 10;
                                return (_jsxs(Marker, { coordinates: [m.lon, m.lat], children: [_jsx("circle", { r: r, fill: "#ef4444", fillOpacity: 0.35, stroke: "#ef4444", strokeWidth: 1.2 }), _jsxs("text", { y: -r - 4, textAnchor: "middle", style: { fill: '#e5e7eb', fontSize: 9, fontFamily: 'ui-monospace' }, children: [m.city, " (", m.count, ")"] })] }, m.ip));
                            })] }), markers.length === 0 && (_jsx("div", { className: "text-sm text-soc-muted text-center py-6", children: "No geolocated source IPs in current alerts." }))] })] }));
}
