import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import { Map } from "react-map-gl/maplibre";
import { DeckGL } from "@deck.gl/react";
import { ArcLayer, ScatterplotLayer } from "@deck.gl/layers";
import { FlyToInterpolator } from "@deck.gl/core";
import { useStreamStore } from "../../../store/streamStore";
import { useTheme } from "../../../contexts/ThemeContext";
import type { GeoEvent } from "../../../types/GeoEvent";
import type { Severity } from "../../../types/Alert";

export interface GeoMapHandle {
  flyTo: (lon: number, lat: number, zoom?: number) => void;
  reset: () => void;
}

type RGB = [number, number, number];

const SEVERITY_COLOR: Record<Severity, RGB> = {
  critical: [239, 68, 68],
  high:     [249, 115, 22],
  medium:   [245, 158, 11],
  low:      [34, 197, 94],
  info:     [59, 130, 246],
};

// Server location overridable via Vite env vars; defaults to Azure Sweden Central.
const env = (import.meta as ImportMeta & { env: Record<string, string | undefined> }).env;
const SERVER = {
  lat: Number.parseFloat(env.VITE_SERVER_LAT ?? "") || 60.67,
  lon: Number.parseFloat(env.VITE_SERVER_LON ?? "") || 17.14,
  name: env.VITE_SERVER_NAME || "Sweden Central",
} as const;

const SERVER_COLOR: RGB = [56, 189, 248]; // sky-400

const STYLE_DARK =
  "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json";
const STYLE_LIGHT =
  "https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json";

const INITIAL_VIEW = {
  longitude: 10,
  latitude: 30,
  zoom: 1.6,
  pitch: 35,
  bearing: 0,
};

// ~30 fps animation cap — smooth pulse without flooding React.
const TICK_INTERVAL_MS = 33;

interface ArcDatum {
  source: [number, number];
  target: [number, number];
  color: RGB;
  ip: string;
  city?: string;
  country?: string;
  severity: Severity;
  ts: string;
}

interface DeckObject {
  ip?: string;
  name?: string;
  city?: string;
  country?: string;
  severity?: Severity;
}

export const GeoMap = forwardRef<GeoMapHandle>((_props, ref) => {
  const geoEvents = useStreamStore((s) => s.geoEvents);
  const { theme } = useTheme();
  const [tick, setTick] = useState(0);
  const lastTickRef = useRef(0);
  const rafRef = useRef<number | null>(null);

  // Controlled view state so we can imperatively fly to a clicked IP.
  const [viewState, setViewState] = useState<typeof INITIAL_VIEW & {
    transitionDuration?: number;
    transitionInterpolator?: FlyToInterpolator;
  }>(INITIAL_VIEW);

  useImperativeHandle(
    ref,
    () => ({
      flyTo: (lon, lat, zoom = 5) => {
        setViewState((s) => ({
          ...s,
          longitude: lon,
          latitude: lat,
          zoom,
          pitch: 35,
          bearing: 0,
          transitionDuration: 1500,
          transitionInterpolator: new FlyToInterpolator(),
        }));
      },
      reset: () => {
        setViewState({
          ...INITIAL_VIEW,
          transitionDuration: 1500,
          transitionInterpolator: new FlyToInterpolator(),
        });
      },
    }),
    []
  );

  // Latest event per IP, info severity dropped (only real attacks).
  const attacks = useMemo<GeoEvent[]>(() => {
    const latest = geoEvents.reduce<Record<string, GeoEvent>>((acc, e) => {
      if (e.severity === "info") return acc;
      const existing = acc[e.ip];
      if (!existing || e.ts > existing.ts) acc[e.ip] = e;
      return acc;
    }, {});
    return Object.values(latest);
  }, [geoEvents]);

  // Throttled RAF loop — only runs while there's something to animate.
  useEffect(() => {
    if (attacks.length === 0) return;
    const loop = (now: number) => {
      if (now - lastTickRef.current >= TICK_INTERVAL_MS) {
        lastTickRef.current = now;
        setTick((t) => (t + 1) % 100000);
      }
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [attacks.length]);

  const arcs = useMemo<ArcDatum[]>(
    () =>
      attacks.map((a) => ({
        source: [a.lon, a.lat],
        target: [SERVER.lon, SERVER.lat],
        color: SEVERITY_COLOR[a.severity],
        ip: a.ip,
        city: a.city,
        country: a.country,
        severity: a.severity,
        ts: a.ts,
      })),
    [attacks]
  );

  const pulse = (Math.sin(tick * 0.18) + 1) / 2; // 0..1, ~1.5s cycle

  const layers = useMemo(
    () => [
      new ArcLayer<ArcDatum>({
        id: "attack-arcs",
        data: arcs,
        pickable: true,
        greatCircle: true,
        getSourcePosition: (d) => d.source,
        getTargetPosition: (d) => d.target,
        getSourceColor: (d) => [...d.color, 230] as [number, number, number, number],
        getTargetColor: [...SERVER_COLOR, 230] as [number, number, number, number],
        getWidth: 1.5 + pulse * 2,
        getHeight: 0.55,
        widthMinPixels: 1,
        widthMaxPixels: 5,
        updateTriggers: { getWidth: tick },
      }),
      new ScatterplotLayer<GeoEvent>({
        id: "attack-sources",
        data: attacks,
        pickable: true,
        stroked: true,
        lineWidthMinPixels: 1,
        getPosition: (d) => [d.lon, d.lat],
        getFillColor: (d) => [...SEVERITY_COLOR[d.severity], 220] as [number, number, number, number],
        getLineColor: theme === "light" ? [255, 255, 255, 230] : [15, 23, 42, 220],
        getRadius: 30000,
        radiusMinPixels: 4,
        radiusMaxPixels: 10,
      }),
      new ScatterplotLayer<typeof SERVER>({
        id: "server-marker",
        data: [SERVER],
        pickable: true,
        stroked: true,
        lineWidthMinPixels: 2,
        getPosition: (d) => [d.lon, d.lat],
        getFillColor: [...SERVER_COLOR, 230] as [number, number, number, number],
        getLineColor: theme === "light" ? [15, 23, 42, 230] : [255, 255, 255, 230],
        getRadius: 60000,
        radiusMinPixels: 8 + pulse * 4,
        radiusMaxPixels: 14 + pulse * 4,
        updateTriggers: { radiusMinPixels: tick, radiusMaxPixels: tick, getLineColor: theme },
      }),
    ],
    [arcs, attacks, tick, pulse, theme]
  );

  const tooltipStyle = useMemo(
    () =>
      theme === "light"
        ? {
            backgroundColor: "rgba(255,255,255,0.97)",
            border: "1px solid #cbd5e1",
            borderRadius: "4px",
            color: "#0f172a",
            padding: "6px 10px",
            fontFamily: "monospace",
            fontSize: "11px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
          }
        : {
            backgroundColor: "rgba(15,23,42,0.95)",
            border: "1px solid #334155",
            borderRadius: "4px",
            color: "white",
            padding: "6px 10px",
            fontFamily: "monospace",
            fontSize: "11px",
          },
    [theme]
  );

  const getTooltip = ({ object }: { object?: DeckObject | null }) => {
    if (!object) return null;
    if (object.ip && object.severity) {
      const color = SEVERITY_COLOR[object.severity];
      return {
        html: `<div><b>${object.ip}</b><br/>${[object.city, object.country].filter(Boolean).join(", ")}<br/><span style="color:rgb(${color.join(",")});text-transform:uppercase;letter-spacing:0.1em">${object.severity}</span></div>`,
        style: tooltipStyle,
      };
    }
    if (object.name) {
      return {
        html: `<div><b>${object.name}</b><br/><span style="color:rgb(${SERVER_COLOR.join(",")});text-transform:uppercase;letter-spacing:0.1em">SERVER</span></div>`,
        style: tooltipStyle,
      };
    }
    return null;
  };

  return (
    <div
      className="relative h-full min-h-[480px] w-full overflow-hidden rounded"
      onContextMenu={(e) => e.preventDefault()}
    >
      <DeckGL
        viewState={viewState}
        onViewStateChange={({ viewState: vs }) => setViewState(vs as typeof viewState)}
        controller={{ dragRotate: true, touchRotate: true }}
        layers={layers}
        getTooltip={getTooltip}
      >
        <Map mapStyle={theme === "light" ? STYLE_LIGHT : STYLE_DARK} reuseMaps />
      </DeckGL>

      {/* Severity legend */}
      <div className="pointer-events-none absolute left-3 top-3 z-10 flex flex-col gap-1 rounded border border-slate-700/60 bg-slate-900/80 px-3 py-2 font-mono text-[10px] uppercase tracking-widest text-slate-200 dark:border-soc-border dark:bg-soc-bg/85 light:border-slate-300 light:bg-white/90 light:text-slate-700 backdrop-blur">
        <span className="mb-0.5 text-[9px] tracking-[0.3em] text-slate-400">Severity</span>
        {(["critical", "high", "medium", "low"] as Severity[]).map((sev) => (
          <span key={sev} className="flex items-center gap-2">
            <span
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: `rgb(${SEVERITY_COLOR[sev].join(",")})` }}
            />
            {sev}
          </span>
        ))}
        <span className="mt-1 flex items-center gap-2 border-t border-slate-700/40 pt-1.5">
          <span
            className="h-2 w-2 rounded-full"
            style={{ backgroundColor: `rgb(${SERVER_COLOR.join(",")})` }}
          />
          server
        </span>
      </div>

      <div className="pointer-events-none absolute bottom-3 left-3 z-10 rounded border border-slate-700/60 bg-slate-900/80 px-2 py-1 font-mono text-[10px] text-slate-300 dark:border-soc-border dark:bg-soc-bg/85 backdrop-blur">
        Right-click + drag to rotate · scroll to zoom
      </div>

      {attacks.length === 0 && (
        <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
          <p className="font-mono text-xs text-slate-500 dark:text-slate-300">
            En attente de données GeoIP…
          </p>
        </div>
      )}
    </div>
  );
});

GeoMap.displayName = "GeoMap";
