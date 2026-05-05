import { PageHeader } from "../../components/ui/PageHeader";
import { Card } from "../../components/ui/Card";
import { StatusDot } from "../../components/ui/StatusDot";
import { Badge } from "../../components/ui/Badge";
import { GeoMap } from "../../components/views/GeoMap";
import { useStreamStore } from "../../store/streamStore";
import { useStream } from "../../hooks/useStream";

export default function Map() {
  const { status } = useStream();
  const geoEvents = useStreamStore((s) => s.geoEvents);

  const uniqueIps = new Set(geoEvents.map((e) => e.ip)).size;
  const uniqueCountries = new Set(geoEvents.map((e) => e.country).filter(Boolean)).size;

  const streamTone =
    status === "open" ? "live" : status === "error" ? "offline" : "warn";

  return (
    <>
      <PageHeader
        eyebrow="● GeoIP"
        title="Carte des sources"
        description="Visualisation géographique des IPs source détectées par Wazuh."
        actions={<StatusDot tone={streamTone} label="Stream" />}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 mb-4">
        <Card>
          <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-slate-500 dark:text-gray-500">
            IPs uniques
          </p>
          <p className="mt-3 font-mono text-3xl tabular-nums text-slate-900 dark:text-white">
            {uniqueIps}
          </p>
        </Card>
        <Card>
          <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-slate-500 dark:text-gray-500">
            Pays sources
          </p>
          <p className="mt-3 font-mono text-3xl tabular-nums text-slate-900 dark:text-white">
            {uniqueCountries}
          </p>
        </Card>
        <Card>
          <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-slate-500 dark:text-gray-500">
            Événements cartographiés
          </p>
          <p className="mt-3 font-mono text-3xl tabular-nums text-slate-900 dark:text-white">
            {geoEvents.length}
          </p>
        </Card>
      </div>

      <Card title="Carte mondiale des attaques" meta="Live" className="min-h-[480px]">
        <GeoMap />
      </Card>

      {geoEvents.length > 0 && (
        <Card title="Dernières sources" meta={`${geoEvents.length} événements`} className="mt-4">
          <ul className="space-y-2 max-h-64 overflow-y-auto">
            {geoEvents.slice(0, 20).map((ev) => (
              <li
                key={ev.id}
                className="flex items-center gap-3 rounded border border-slate-100 bg-slate-50 p-2 dark:border-soc-border dark:bg-soc-bg"
              >
                <Badge severity={ev.severity} />
                <span className="font-mono text-xs text-slate-800 dark:text-gray-200 min-w-[120px]">
                  {ev.ip}
                </span>
                <span className="font-mono text-xs text-slate-500 dark:text-gray-500">
                  {[ev.city, ev.country].filter(Boolean).join(", ")}
                </span>
                <span className="ml-auto font-mono text-[10px] text-slate-400 dark:text-gray-600">
                  {new Date(ev.ts).toLocaleTimeString()}
                </span>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </>
  );
}
