import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Activity, ShieldAlert, Globe2, Grid3x3,
  GitMerge, MapPin, Gauge,
  ArrowUpRight, Radio,
} from "lucide-react";
import { PageHeader } from "../../components/ui/PageHeader";
import { Card } from "../../components/ui/Card";
import { StatusDot } from "../../components/ui/StatusDot";
import { Badge } from "../../components/ui/Badge";
import { NeonEdge } from "../../components/ui/NeonEdge";
import { useStreamStore } from "../../store/streamStore";
import type { Alert, Severity } from "../../types/Alert";

const HOUR_MS = 60 * 60 * 1000;
const DAY_MS = 24 * HOUR_MS;

const SEVERITY_HEX: Record<Severity, string> = {
  critical: "#ef4444",
  high:     "#fb923c",
  medium:   "#f59e0b",
  low:      "#22c55e",
  info:     "#3b82f6",
};

const SEVERITY_RANK: Record<Severity, number> = {
  info: 0, low: 1, medium: 2, high: 3, critical: 4,
};

export default function Overview() {
  const status = useStreamStore((s) => s.status);
  const alerts = useStreamStore((s) => s.alerts);
  const geoEvents = useStreamStore((s) => s.geoEvents);

  const cutoff24h = Date.now() - DAY_MS;

  const stats = useMemo(() => {
    const recent = alerts.filter((a) => Date.parse(a.ts) >= cutoff24h);
    const techniques = new Set(recent.flatMap((a) => a.techniqueIds ?? [])).size;
    const srcIps = new Set(recent.map((a) => a.srcIp).filter(Boolean)).size;
    const critical = recent.filter((a) => SEVERITY_RANK[a.severity] >= 3).length;

    // top techniques
    const techCount = new Map<string, number>();
    for (const a of recent) for (const t of a.techniqueIds ?? []) {
      techCount.set(t, (techCount.get(t) ?? 0) + 1);
    }
    const topTech = [...techCount.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
    const topTechMax = topTech[0]?.[1] ?? 1;

    // top countries (from geo events tied to recent alerts is too heavy; just use all geoEvents)
    const countryCount = new Map<string, number>();
    for (const g of geoEvents) {
      if (!g.country) continue;
      countryCount.set(g.country, (countryCount.get(g.country) ?? 0) + 1);
    }
    const topCountries = [...countryCount.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
    const topCountriesMax = topCountries[0]?.[1] ?? 1;

    return {
      total24h: recent.length,
      critical,
      techniques,
      srcIps,
      topTech,
      topTechMax,
      topCountries,
      topCountriesMax,
    };
  }, [alerts, geoEvents, cutoff24h]);

  const streamTone = status === "open" ? "live" : status === "error" ? "offline" : "warn";

  return (
    <>
      <PageHeader
        eyebrow="État global"
        title="Vue d'ensemble"
        description="Posture défensive du SOC en un coup d'œil — flux, sévérités, techniques et géographie."
        actions={
          <div className="flex items-center gap-3">
            <StatusDot tone={streamTone} label={status === "open" ? "Stream live" : status === "error" ? "Hors ligne" : "Connexion"} />
          </div>
        }
      />

      {/* Hero KPI strip */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          label="Alertes / 24h"
          value={stats.total24h}
          icon={Activity}
          edge="#ef4444"
          sub={stats.total24h ? "agrégat 24h" : "—"}
        />

        <KpiCard
          label="Sévérité élevée"
          value={stats.critical}
          icon={ShieldAlert}
          edge="#fb923c"
          sub={stats.total24h ? `${Math.round((stats.critical / stats.total24h) * 100)}% du flux` : "—"}
        />

        <KpiCard
          label="Sources uniques"
          value={stats.srcIps}
          icon={Globe2}
          edge="#3b82f6"
          sub={`${stats.topCountries.length} pays`}
        />

        <KpiCard
          label="Techniques MITRE"
          value={stats.techniques}
          icon={Grid3x3}
          edge="#a855f7"
          sub="observées sur 24h"
        />
      </div>

      {/* Main grid */}
      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Activity feed (left, 2 cols) */}
        <Card className="lg:col-span-2 min-h-[420px]" accent="#ef4444">
          <header className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="font-cinematic text-sm uppercase tracking-wide text-slate-900 dark:text-white">
                Flux d'alertes
              </h3>
              <p className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.25em] text-slate-500 dark:text-gray-500">
                {stats.total24h} sur 24h
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Radio size={11} className="text-red-500 dark:text-red-400 animate-pulse" />
              <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-red-500 dark:text-red-400">
                {status === "open" ? "Live" : status}
              </span>
            </div>
          </header>

          <LiveFluxStream alerts={alerts} />

          {alerts.length === 0 ? (
            <EmptyFeed status={status} />
          ) : (
            <ul className="mt-4 space-y-1.5 overflow-y-auto" style={{ maxHeight: 280 }}>
              {alerts.slice(0, 50).map((a) => <FeedRow key={a.id} alert={a} />)}
            </ul>
          )}
        </Card>

        {/* Posture (right) */}
        <div className="flex flex-col gap-4">
          <Card accent="#22c55e" className="min-h-0">
            <h3 className="mb-3 font-cinematic text-sm uppercase tracking-wide text-slate-900 dark:text-white">
              Sources
            </h3>
            <ul className="space-y-2 font-mono text-xs">
              <SourceRow label="Wazuh" tone={status === "open" ? "online" : "warn"} value={status === "open" ? "Connecté" : "..."} />
              <SourceRow label="Suricata" tone="online" value="Actif" />
              <SourceRow label="BFF" tone={status === "open" ? "online" : "warn"} value={status === "open" ? "Live" : "..."} />
              <SourceRow label="GeoIP" tone={geoEvents.length > 0 ? "online" : "offline"} value={`${geoEvents.length} cache`} />
            </ul>
          </Card>

          <Card accent="#a855f7" className="min-h-0">
            <h3 className="mb-3 font-cinematic text-sm uppercase tracking-wide text-slate-900 dark:text-white">
              Top techniques
            </h3>
            {stats.topTech.length ? (
              <ul className="space-y-1.5">
                {stats.topTech.map(([id, n]) => (
                  <BarRow
                    key={id}
                    label={id}
                    count={n}
                    max={stats.topTechMax}
                    tint="#a855f7"
                  />
                ))}
              </ul>
            ) : (
              <p className="font-mono text-[11px] text-slate-500 dark:text-gray-500">
                aucune technique observée
              </p>
            )}
          </Card>

          <Card accent="#3b82f6" className="min-h-0">
            <h3 className="mb-3 font-cinematic text-sm uppercase tracking-wide text-slate-900 dark:text-white">
              Top pays sources
            </h3>
            {stats.topCountries.length ? (
              <ul className="space-y-1.5">
                {stats.topCountries.map(([country, n]) => (
                  <BarRow
                    key={country}
                    label={country}
                    count={n}
                    max={stats.topCountriesMax}
                    tint="#3b82f6"
                  />
                ))}
              </ul>
            ) : (
              <p className="font-mono text-[11px] text-slate-500 dark:text-gray-500">
                aucune origine résolue
              </p>
            )}
          </Card>
        </div>
      </div>

      {/* Quick links */}
      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <QuickLink to="/dashboard/timeline" icon={GitMerge} label="Chronologie d'attaque" sub="rejouer l'incident" tint="#ef4444" />
        <QuickLink to="/dashboard/map"      icon={MapPin}    label="Carte des sources"     sub="géographie des IPs" tint="#3b82f6" />
        <QuickLink to="/dashboard/coverage" icon={Gauge}     label="Couverture MITRE"      sub="par tactique"       tint="#a855f7" />
      </div>
    </>
  );
}

/* ─────────── KPI ─────────── */

const KpiCard = ({ label, value, icon: Icon, edge, sub, children }: {
  label: string;
  value: number | string;
  icon: React.ComponentType<{ size?: number; className?: string; style?: React.CSSProperties }>;
  edge: string;
  sub?: string;
  children?: React.ReactNode;
}) => (
  <div className="relative overflow-hidden rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-white/[0.06] dark:bg-black/20 dark:shadow-none dark:backdrop-blur-sm">
    <NeonEdge color={edge} intensity="bright" />
    <div className="flex items-start justify-between">
      <p className="font-mono text-[10px] tracking-[0.3em] uppercase" style={{ color: edge }}>
        {label}
      </p>
      <Icon size={14} style={{ color: edge }} />
    </div>
    <p className="mt-2 font-mono text-3xl tabular-nums text-slate-900 dark:text-white">
      {value}
    </p>
    {sub && (
      <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500 dark:text-gray-500">
        {sub}
      </p>
    )}
    {children && <div className="mt-3">{children}</div>}
  </div>
);

/* ─────────── activity ─────────── */

/* ─────────── trading-style live flux chart ─────────── */
/* A continuous SVG line chart of "alerts per X seconds" over a sliding       */
/* 5-minute window. Recomputes 6× / sec so the curve physically drifts left.  */

const FLUX_WINDOW_MS = 5 * 60 * 1000;   // 5 min visible
const FLUX_BINS = 80;                    // 80 sample points
const FLUX_BIN_MS = FLUX_WINDOW_MS / FLUX_BINS; // 3.75s per bin
const FLUX_TICK_MS = 160;                // ~6 Hz redraw
const VB_W = 200;                         // SVG viewBox width
const VB_H = 100;                         // SVG viewBox height
const PAD_T = 16;                         // top inset reserved for HUD overlays
const PAD_B = 4;                          // thin baseline gutter
const TREND_LOOKBACK = 8;                 // last N bins ≈ 30s

const LiveFluxStream = ({ alerts }: { alerts: Alert[] }) => {
  const [now, setNow] = useState<number>(Date.now());

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), FLUX_TICK_MS);
    return () => window.clearInterval(id);
  }, []);

  const data = useMemo(() => {
    const winStart = now - FLUX_WINDOW_MS;
    const bins = new Array(FLUX_BINS).fill(null).map(() => ({ count: 0, peak: "info" as Severity }));
    for (const a of alerts) {
      const t = Date.parse(a.ts);
      if (t < winStart || t > now) continue;
      const idx = Math.min(FLUX_BINS - 1, Math.max(0, Math.floor((t - winStart) / FLUX_BIN_MS)));
      const b = bins[idx]!;
      b.count += 1;
      if (SEVERITY_RANK[a.severity] > SEVERITY_RANK[b.peak]) b.peak = a.severity;
    }

    const max = Math.max(2, ...bins.map((b) => b.count));
    const drawH = VB_H - PAD_T - PAD_B;

    const points = bins.map((b, i) => {
      const x = (i / (FLUX_BINS - 1)) * VB_W;
      const y = PAD_T + drawH - (b.count / max) * drawH;
      return { x, y, count: b.count, peak: b.peak };
    });

    // current rate = sum over last ~30s
    const recent = bins.slice(-TREND_LOOKBACK).reduce((s, b) => s + b.count, 0);
    const prior  = bins.slice(-TREND_LOOKBACK * 2, -TREND_LOOKBACK).reduce((s, b) => s + b.count, 0);
    const trend  = recent - prior;
    const peakSeverity = bins.slice(-TREND_LOOKBACK).reduce<Severity>(
      (acc, b) => (SEVERITY_RANK[b.peak] > SEVERITY_RANK[acc] ? b.peak : acc),
      "info"
    );

    return { points, max, recent, trend, peakSeverity };
  }, [alerts, now]);

  // Smooth path via consecutive midpoint quadratic curves
  const linePath = useMemo(() => smoothPath(data.points), [data.points]);
  const areaPath = `${linePath} L ${VB_W} ${VB_H - PAD_B} L 0 ${VB_H - PAD_B} Z`;

  const lineColor =
    data.trend > 0 ? "#22c55e" :
    data.trend < 0 ? "#ef4444" :
    SEVERITY_HEX[data.peakSeverity];

  const lastPt = data.points[data.points.length - 1] ?? { x: VB_W, y: VB_H - PAD_B, count: 0 };

  return (
    <div className="overflow-hidden rounded-md border border-slate-200/60 bg-slate-50/60 dark:border-white/5 dark:bg-black/40">
      {/* chart panel — fixed height, the SVG fills it edge to edge */}
      <div className="relative" style={{ height: 96 }}>
      <svg
        viewBox={`0 0 ${VB_W} ${VB_H}`}
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full"
      >
        <defs>
          <linearGradient id="flux-fill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor={lineColor} stopOpacity="0.35" />
            <stop offset="60%" stopColor={lineColor} stopOpacity="0.08" />
            <stop offset="100%" stopColor={lineColor} stopOpacity="0" />
          </linearGradient>
          <linearGradient id="flux-line" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%" stopColor={lineColor} stopOpacity="0.5" />
            <stop offset="100%" stopColor={lineColor} stopOpacity="1" />
          </linearGradient>
        </defs>

        {/* horizontal gridlines */}
        {[0.25, 0.5, 0.75].map((r) => (
          <line
            key={r}
            x1="0" x2={VB_W}
            y1={PAD_T + (VB_H - PAD_T - PAD_B) * r}
            y2={PAD_T + (VB_H - PAD_T - PAD_B) * r}
            stroke="rgba(255,255,255,0.05)"
            strokeWidth="0.4"
            strokeDasharray="1.5 2"
          />
        ))}
        {/* baseline */}
        <line
          x1="0" x2={VB_W}
          y1={VB_H - PAD_B} y2={VB_H - PAD_B}
          stroke="rgba(255,255,255,0.12)"
          strokeWidth="0.4"
        />

        {/* area + line */}
        <motion.path
          d={areaPath}
          fill="url(#flux-fill)"
          initial={false}
          animate={{ d: areaPath }}
          transition={{ duration: 0.18, ease: "linear" }}
        />
        <motion.path
          d={linePath}
          fill="none"
          stroke="url(#flux-line)"
          strokeWidth="0.9"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={false}
          animate={{ d: linePath }}
          transition={{ duration: 0.18, ease: "linear" }}
          style={{ filter: `drop-shadow(0 0 1.5px ${lineColor}aa)` }}
        />

        {/* live-edge marker on the latest point */}
        <circle cx={lastPt.x} cy={lastPt.y} r="1.2" fill="#fff" />
        <circle
          cx={lastPt.x} cy={lastPt.y} r="2.2"
          fill="none" stroke={lineColor} strokeWidth="0.6"
        >
          <animate attributeName="r" values="2;6;2" dur="1.4s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="1;0;1" dur="1.4s" repeatCount="indefinite" />
        </circle>

        {/* live vertical line */}
        <line
          x1={VB_W} x2={VB_W}
          y1={PAD_T} y2={VB_H - PAD_B}
          stroke={lineColor}
          strokeWidth="0.4"
          strokeOpacity="0.6"
          strokeDasharray="1 1"
        />
      </svg>

      {/* y-axis ceiling */}
      <div className="pointer-events-none absolute left-2 top-1.5 font-mono text-[9px] uppercase tracking-[0.18em] text-slate-500 dark:text-gray-500">
        max&nbsp;
        <span className="text-slate-700 dark:text-gray-300">{data.max}</span>
      </div>

      {/* current rate + trend (top-right) */}
      <div className="pointer-events-none absolute right-2 top-1.5 flex items-center gap-2">
        <TrendArrow trend={data.trend} color={lineColor} />
        <div className="flex items-baseline gap-1">
          <span className="font-mono text-lg leading-none tabular-nums text-white">{data.recent}</span>
          <span className="font-mono text-[9px] uppercase tracking-[0.22em] text-slate-500 dark:text-gray-500">
            / 30s
          </span>
        </div>
      </div>
      </div>

      {/* axis strap — sits BELOW the chart panel, never overlaps the area fill */}
      <div className="flex items-center justify-between border-t border-white/[0.04] bg-slate-100/40 px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.25em] text-slate-400 dark:bg-black/30 dark:text-gray-500">
        <span>−5 min</span>
        <span>flux temps réel</span>
        <span style={{ color: lineColor }} className="font-semibold">● live</span>
      </div>
    </div>
  );
};

const TrendArrow = ({ trend, color }: { trend: number; color: string }) => {
  if (trend === 0) {
    return (
      <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-slate-500">−</span>
    );
  }
  const up = trend > 0;
  return (
    <span
      className="inline-flex items-center gap-0.5 rounded-sm px-1 py-0.5 font-mono text-[9px] tabular-nums"
      style={{ color, background: `${color}22`, border: `1px solid ${color}55` }}
    >
      {up ? "▲" : "▼"} {Math.abs(trend)}
    </span>
  );
};

/** Quadratic-bezier smoothing: each segment passes through midpoint, controlled by previous point. */
const smoothPath = (pts: { x: number; y: number }[]): string => {
  if (pts.length === 0) return "";
  if (pts.length === 1) return `M ${pts[0]!.x} ${pts[0]!.y}`;
  let d = `M ${pts[0]!.x} ${pts[0]!.y}`;
  for (let i = 1; i < pts.length; i++) {
    const p0 = pts[i - 1]!;
    const p1 = pts[i]!;
    const mx = (p0.x + p1.x) / 2;
    const my = (p0.y + p1.y) / 2;
    d += ` Q ${p0.x.toFixed(2)} ${p0.y.toFixed(2)}, ${mx.toFixed(2)} ${my.toFixed(2)}`;
  }
  // ensure final point is reached cleanly
  const last = pts[pts.length - 1]!;
  d += ` L ${last.x.toFixed(2)} ${last.y.toFixed(2)}`;
  return d;
};

const ActivityHistogram = ({ buckets }: { buckets: { count: number; peak: Severity }[] }) => {
  const max = Math.max(1, ...buckets.map((b) => b.count));

  // detect bucket-count increases → trigger a brief flash on the affected bar
  const prevCounts = useRef<number[]>(buckets.map((b) => b.count));
  const [flashing, setFlashing] = useState<Set<number>>(new Set());
  const [arrivals, setArrivals] = useState<{ id: number; bucket: number }[]>([]);
  const arrivalIdRef = useRef(0);

  useEffect(() => {
    const prev = prevCounts.current;
    const newFlash = new Set<number>();
    const newArrivals: { id: number; bucket: number }[] = [];
    buckets.forEach((b, i) => {
      const before = prev[i] ?? 0;
      if (b.count > before) {
        newFlash.add(i);
        // emit one "particle" per new alert (capped to keep it tasteful)
        const delta = Math.min(3, b.count - before);
        for (let k = 0; k < delta; k++) {
          arrivalIdRef.current += 1;
          newArrivals.push({ id: arrivalIdRef.current, bucket: i });
        }
      }
    });
    prevCounts.current = buckets.map((b) => b.count);

    if (newFlash.size) {
      setFlashing(newFlash);
      const t = setTimeout(() => setFlashing(new Set()), 700);
      return () => clearTimeout(t);
    }
    if (newArrivals.length) {
      setArrivals((a) => [...a, ...newArrivals]);
      const t = setTimeout(() => {
        setArrivals((a) => a.filter((x) => !newArrivals.find((n) => n.id === x.id)));
      }, 1100);
      return () => clearTimeout(t);
    }
  }, [buckets]);

  return (
    <div className="relative overflow-hidden rounded-md border border-slate-200/60 bg-slate-50/60 p-2 dark:border-white/5 dark:bg-black/30">
      {/* slow scanline sweeping right→left */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 w-[80px]"
        initial={{ x: "100%" }}
        animate={{ x: "-120%" }}
        transition={{ duration: 6.5, ease: "linear", repeat: Infinity }}
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, rgba(239,68,68,0.10) 45%, rgba(239,68,68,0.18) 50%, rgba(239,68,68,0.10) 55%, transparent 100%)",
        }}
      />

      <div className="relative flex items-end gap-0.5" style={{ height: 56 }}>
        {buckets.map((b, i) => {
          const h = (b.count / max) * 52;
          const isLast = i === buckets.length - 1;
          const isFlashing = flashing.has(i);
          const tint = b.count ? SEVERITY_HEX[b.peak] : "rgba(255,255,255,0.06)";

          return (
            <motion.div
              key={i}
              initial={false}
              animate={{ height: Math.max(2, h) }}
              transition={{ type: "spring", stiffness: 200, damping: 22, mass: 0.6 }}
              className="relative flex-1 rounded-sm"
              style={{
                background: tint,
                opacity: b.count ? 0.92 : 1,
                boxShadow: b.count ? `0 0 6px ${tint}55` : undefined,
              }}
              title={b.count ? `${b.count} alerte${b.count > 1 ? "s" : ""}` : ""}
            >
              {/* perpetual breathe on the "maintenant" bar */}
              {isLast && b.count > 0 && (
                <motion.div
                  aria-hidden
                  className="absolute inset-0 rounded-sm"
                  animate={{ opacity: [0, 0.55, 0] }}
                  transition={{ duration: 1.7, repeat: Infinity, ease: "easeInOut" }}
                  style={{ background: tint, boxShadow: `0 0 10px ${tint}` }}
                />
              )}
              {/* flash on new arrival */}
              <AnimatePresence>
                {isFlashing && (
                  <motion.div
                    aria-hidden
                    initial={{ opacity: 0.85, scaleY: 1.25 }}
                    animate={{ opacity: 0, scaleY: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.65, ease: "easeOut" }}
                    className="absolute inset-0 rounded-sm bg-white"
                    style={{ transformOrigin: "bottom" }}
                  />
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}

        {/* "arrival" particles falling onto their bucket */}
        <AnimatePresence>
          {arrivals.map((p) => {
            const left = `${(p.bucket / buckets.length) * 100 + 100 / buckets.length / 2}%`;
            return (
              <motion.span
                key={p.id}
                aria-hidden
                initial={{ opacity: 0, y: -28, left }}
                animate={{ opacity: [0, 1, 1, 0], y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.0, ease: "easeOut" }}
                className="pointer-events-none absolute top-0 size-1.5 -translate-x-1/2 rounded-full"
                style={{
                  background: SEVERITY_HEX[buckets[p.bucket]?.peak ?? "info"],
                  boxShadow: `0 0 8px ${SEVERITY_HEX[buckets[p.bucket]?.peak ?? "info"]}`,
                }}
              />
            );
          })}
        </AnimatePresence>

        {/* "now" tip indicator */}
        <motion.span
          aria-hidden
          className="pointer-events-none absolute bottom-0 right-0.5 size-1.5 rounded-full"
          animate={{ opacity: [0.4, 1, 0.4], scale: [1, 1.4, 1] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
          style={{ background: "#ef4444", boxShadow: "0 0 8px #ef4444" }}
        />
      </div>

      <div className="mt-1.5 flex justify-between font-mono text-[9px] uppercase tracking-[0.25em] text-slate-400 dark:text-gray-600">
        <span>−24h</span>
        <span className="text-red-500/80 dark:text-red-400/80">● maintenant</span>
      </div>
    </div>
  );
};

const FeedRow = ({ alert }: { alert: Alert }) => {
  const tint = SEVERITY_HEX[alert.severity];
  return (
    <li className="flex items-start gap-2.5 rounded-md border border-slate-100 bg-white/60 px-2.5 py-2 transition-colors hover:border-slate-300 dark:border-white/5 dark:bg-white/[0.02] dark:hover:border-white/15">
      <span
        className="mt-1 size-2 shrink-0 rounded-full"
        style={{ background: tint, boxShadow: `0 0 6px ${tint}80` }}
      />
      <div className="min-w-0 flex-1">
        <p className="truncate text-[12px] text-slate-800 dark:text-gray-200">
          {alert.ruleDesc || "Alerte"}
        </p>
        <p className="font-mono text-[10px] tracking-wide text-slate-400 dark:text-gray-500">
          {alert.agent?.name ?? "—"} · {alert.srcIp ?? "—"} · {timeAgo(alert.ts)}
        </p>
      </div>
      <Badge severity={alert.severity} />
    </li>
  );
};

const EmptyFeed = ({ status }: { status: string }) => (
  <div className="flex h-40 flex-col items-center justify-center gap-2 rounded-md border border-dashed border-slate-200 dark:border-white/5">
    <Activity size={20} className="text-slate-300 dark:text-gray-600" />
    <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-slate-400 dark:text-gray-500">
      {status === "connecting" ? "Connexion au flux…" : "En attente d'alertes"}
    </p>
  </div>
);

/* ─────────── posture ─────────── */

const SourceRow = ({ label, tone, value }: {
  label: string; tone: "online" | "warn" | "offline" | "live"; value: string;
}) => (
  <li className="flex items-center justify-between rounded-sm border border-white/5 bg-white/[0.02] px-2 py-1.5 dark:border-white/5">
    <span className="text-slate-700 dark:text-gray-300">{label}</span>
    <StatusDot tone={tone} label={value} />
  </li>
);

const BarRow = ({ label, count, max, tint }: {
  label: string; count: number; max: number; tint: string;
}) => {
  const ratio = count / max;
  return (
    <li className="flex items-center gap-3">
      <span className="w-16 shrink-0 truncate font-mono text-[11px] text-slate-700 dark:text-gray-300" title={label}>
        {label}
      </span>
      <span className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-white/[0.06]">
        <span
          className="absolute inset-y-0 left-0 rounded-full transition-[width] duration-500"
          style={{ width: `${ratio * 100}%`, background: tint, boxShadow: `0 0 8px ${tint}66` }}
        />
      </span>
      <span className="w-6 shrink-0 text-right font-mono text-[10px] tabular-nums text-slate-500 dark:text-gray-400">
        {count}
      </span>
    </li>
  );
};

/* ─────────── quick links ─────────── */

const QuickLink = ({ to, icon: Icon, label, sub, tint }: {
  to: string;
  icon: React.ComponentType<{ size?: number; className?: string; style?: React.CSSProperties }>;
  label: string; sub: string; tint: string;
}) => (
  <Link
    to={to}
    className="group relative flex items-center gap-3 overflow-hidden rounded-lg border border-slate-200 bg-white p-3.5 shadow-sm transition-all hover:border-slate-300 dark:border-white/[0.06] dark:bg-black/20 dark:shadow-none dark:backdrop-blur-sm dark:hover:border-white/15"
  >
    <NeonEdge color={tint} intensity="soft" />
    <div
      className="grid size-9 shrink-0 place-items-center rounded-md"
      style={{ background: `${tint}18`, color: tint, border: `1px solid ${tint}55` }}
    >
      <Icon size={16} />
    </div>
    <div className="min-w-0 flex-1">
      <div className="text-sm font-medium text-slate-900 dark:text-white">{label}</div>
      <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-slate-500 dark:text-gray-500">
        {sub}
      </div>
    </div>
    <ArrowUpRight
      size={14}
      className="text-slate-400 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 dark:text-gray-500"
    />
  </Link>
);

/* ─────────── utils ─────────── */

const timeAgo = (iso: string): string => {
  const ms = Date.now() - Date.parse(iso);
  if (ms < 60_000) return `${Math.max(1, Math.round(ms / 1000))}s`;
  if (ms < HOUR_MS) return `${Math.round(ms / 60_000)}min`;
  if (ms < DAY_MS) return `${Math.round(ms / HOUR_MS)}h`;
  return `${Math.round(ms / DAY_MS)}j`;
};
