import { MapContainer, TileLayer, CircleMarker, Tooltip } from "react-leaflet";
import { useStreamStore } from "../../store/streamStore";
import type { GeoEvent } from "../../types/GeoEvent";
import type { Severity } from "../../types/Alert";

const SEVERITY_COLOR: Record<Severity, string> = {
  critical: "#ef4444",
  high:     "#f97316",
  medium:   "#f59e0b",
  low:      "#22c55e",
  info:     "#3b82f6",
};

const TILE_URL =
  "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png";
const TILE_ATTR =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>';

export const GeoMap = () => {
  const geoEvents = useStreamStore((s) => s.geoEvents);

  const uniqueLatest = Object.values(
    geoEvents.reduce<Record<string, GeoEvent>>((acc, e) => {
      const existing = acc[e.ip];
      if (!existing || e.ts > existing.ts) acc[e.ip] = e;
      return acc;
    }, {})
  );

  return (
    <div className="relative w-full overflow-hidden rounded">
      <MapContainer
        center={[20, 10]}
        zoom={2}
        minZoom={2}
        maxZoom={10}
        scrollWheelZoom
        worldCopyJump
        style={{ height: "560px", width: "100%", background: "#0f172a" }}
        attributionControl={false}
      >
        <TileLayer url={TILE_URL} attribution={TILE_ATTR} />

        {uniqueLatest.map((ev) => {
          const color = SEVERITY_COLOR[ev.severity];
          return (
            <CircleMarker
              key={ev.id}
              center={[ev.lat, ev.lon]}
              radius={6}
              pathOptions={{
                color,
                fillColor: color,
                fillOpacity: 0.85,
                weight: 1.5,
                opacity: 1,
              }}
            >
              <Tooltip
                direction="top"
                offset={[0, -6]}
                opacity={1}
                className="!rounded !border !border-slate-700 !bg-slate-900/95 !px-3 !py-2 !font-mono !text-xs !text-white !shadow-lg"
              >
                <div>
                  <p className="font-semibold">{ev.ip}</p>
                  <p className="text-slate-400">
                    {[ev.city, ev.country].filter(Boolean).join(", ")}
                  </p>
                  <p
                    className="mt-0.5 uppercase tracking-widest"
                    style={{ color }}
                  >
                    {ev.severity}
                  </p>
                </div>
              </Tooltip>
            </CircleMarker>
          );
        })}
      </MapContainer>

      {uniqueLatest.length === 0 && (
        <div className="pointer-events-none absolute inset-0 z-[1000] flex items-center justify-center">
          <p className="font-mono text-xs text-slate-300">
            En attente de données GeoIP…
          </p>
        </div>
      )}
    </div>
  );
};
