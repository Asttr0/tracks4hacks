import { useRef } from "react";
import { Globe2, MapPin, Activity, Clock } from "lucide-react";
import { PageHeader } from "../../components/ui/PageHeader";
import { Card } from "../../components/ui/Card";
import { NeonEdge } from "../../components/ui/NeonEdge";
import { StatusDot } from "../../components/ui/StatusDot";
import { Badge } from "../../components/ui/Badge";
import { GeoMap, type GeoMapHandle } from "../../components/views/GeoMap";
import { useStreamStore } from "../../store/streamStore";
import { useStream } from "../../hooks/useStream";
import type { Severity } from "../../types/Alert";

const SEVERITY_HEX: Record<Severity, string> = {
  critical: "#ef4444",
  high:     "#f97316",
  medium:   "#f59e0b",
  low:      "#22c55e",
  info:     "#3b82f6",
};

// Default styles target light-mode (readable on white).
// `dark:` overrides add the white neon-glow used in dark-mode.
const NEON_LABEL =
  "font-mono text-[11px] tracking-[0.32em] uppercase text-slate-700 " +
  "dark:text-white " +
  "dark:[text-shadow:0_0_6px_rgba(186,230,253,0.55),0_0_18px_rgba(56,189,248,0.35)]";

const NEON_VALUE =
  "mt-2 font-mono text-4xl tabular-nums tracking-tight text-slate-900 " +
  "dark:text-white " +
  "dark:[text-shadow:0_0_10px_rgba(186,230,253,0.5),0_0_30px_rgba(56,189,248,0.25)]";

interface KpiProps {
  label: string;
  value: number | string;
  icon: React.ComponentType<{ size?: number; className?: string; style?: React.CSSProperties }>;
  accent: string;
}

const Kpi = ({ label, value, icon: Icon, accent }: KpiProps) => (
  <div className="relative overflow-hidden rounded-lg border border-slate-200 bg-white p-4 dark:border-soc-border dark:bg-soc-panel">
    <NeonEdge color={accent} intensity="bright" />
    <div
      aria-hidden
      className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full opacity-25 blur-2xl"
      style={{ backgroundColor: accent }}
    />
    <div className="relative flex items-start justify-between">
      <p className={NEON_LABEL}>{label}</p>
      <Icon size={16} style={{ color: accent }} />
    </div>
    <p className={`relative ${NEON_VALUE}`}>{value}</p>
  </div>
);

export default function Map() {
  const { status } = useStream();
  const geoEvents = useStreamStore((s) => s.geoEvents);
  const mapRef = useRef<GeoMapHandle>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  const focusOn = (lon: number, lat: number) => {
    mapContainerRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    mapRef.current?.flyTo(lon, lat, 5);
  };

  const attacks = geoEvents.filter((e) => e.severity !== "info");
  const uniqueIps = new Set(attacks.map((e) => e.ip)).size;
  const uniqueCountries = new Set(
    attacks.map((e) => e.country).filter(Boolean)
  ).size;

  const streamTone =
    status === "open" ? "live" : status === "error" ? "offline" : "warn";

  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        eyebrow="● GeoIP"
        title="Carte des sources"
        description="Visualisation géographique en temps réel des IPs attaquantes vers Sweden Central."
        actions={<StatusDot tone={streamTone} label="Stream" />}
      />

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <Kpi label="IPs uniques" value={uniqueIps} icon={MapPin} accent="#38bdf8" />
        <Kpi label="Pays sources" value={uniqueCountries} icon={Globe2} accent="#a78bfa" />
        <Kpi
          label="Événements cartographiés"
          value={attacks.length}
          icon={Activity}
          accent="#f97316"
        />
      </div>

      <Card
        title="Carte mondiale des attaques"
        meta="Live"
        className="overflow-hidden"
      >
        <div
          ref={mapContainerRef}
          className="-mx-4 -mb-4 lg:-mx-6 lg:-mb-6 h-[calc(100vh-260px)] min-h-[680px] w-[calc(100%+2rem)] lg:w-[calc(100%+3rem)]"
        >
          <GeoMap ref={mapRef} />
        </div>
      </Card>

      {attacks.length > 0 && (
        <Card
          title="Dernières sources"
          meta={`${attacks.length} · click to focus`}
        >
          <ul className="grid grid-cols-1 gap-2 max-h-80 overflow-y-auto pr-1 md:grid-cols-2">
            {attacks.slice(0, 24).map((ev) => {
              const accent = SEVERITY_HEX[ev.severity];
              return (
                <li
                  key={ev.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => focusOn(ev.lon, ev.lat)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      focusOn(ev.lon, ev.lat);
                    }
                  }}
                  className={
                    "group relative flex cursor-pointer items-center gap-3 overflow-hidden rounded-lg pl-3 pr-3 py-2.5 transition-all " +
                    "border border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm " +
                    "dark:border-soc-border dark:bg-soc-bg/60 dark:hover:border-slate-600 dark:hover:bg-soc-bg " +
                    "focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/60"
                  }
                >
                  <span
                    aria-hidden
                    className="absolute left-0 top-0 h-full w-[3px] transition-all group-hover:w-[5px]"
                    style={{ backgroundColor: accent }}
                  />
                  <span
                    aria-hidden
                    className="pointer-events-none absolute -right-4 -top-4 h-16 w-16 rounded-full opacity-0 blur-2xl transition-opacity group-hover:opacity-30"
                    style={{ backgroundColor: accent }}
                  />

                  <Badge severity={ev.severity} />

                  <span
                    className={
                      "font-mono text-xs tabular-nums min-w-[130px] " +
                      "text-slate-900 dark:text-white " +
                      "transition-[text-shadow] dark:group-hover:[text-shadow:0_0_8px_rgba(186,230,253,0.45)]"
                    }
                  >
                    {ev.ip}
                  </span>

                  <span className="flex min-w-0 items-center gap-1.5 text-xs text-slate-500 dark:text-gray-400">
                    <MapPin size={11} className="shrink-0 opacity-70" />
                    <span className="truncate font-mono">
                      {[ev.city, ev.country].filter(Boolean).join(", ") || "—"}
                    </span>
                  </span>

                  <span className="ml-auto flex shrink-0 items-center gap-1 font-mono text-[10px] text-slate-400 dark:text-gray-500">
                    <Clock size={10} className="opacity-60" />
                    {new Date(ev.ts).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                      hour12: false,
                    })}
                  </span>
                </li>
              );
            })}
          </ul>
        </Card>
      )}
    </div>
  );
}
