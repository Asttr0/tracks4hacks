import { motion } from "framer-motion";
import {
  BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine, PieChart, Pie,
} from "recharts";
import {
  AlertCircle, Clock, ArrowRight, Activity, Target,
  CheckCircle2, Eye, FileDown,
} from "lucide-react";
import { Link } from "react-router-dom";

import { PageHeader } from "../../components/ui/PageHeader";
import { useUiStore } from "../../store/useUiStore";
import { useTheme } from "../../contexts/ThemeContext";

import {
  SpeedometerGauge, KpiCard, DrillDownRow, MissedRow, LiveEmptyState,
  TOOL_COLORS, delayColor, getDelayLabel, groupByTool,
} from "../../components/dashboard/coverage";
import { DEMO_KPI, DEMO_MISSED, DEMO_DETECTED, DEMO_MTTD_BARS } from "../../data/demo-coverage";
import type { CoverageKpi } from "../../types/coverage";

// Re-exports for backwards compatibility (Incidents page imports these from here)
export { PrintableReport, type PrintableReportProps } from "../../components/dashboard/coverage";
export { DEMO_KPI, DEMO_MISSED, DEMO_DETECTED } from "../../data/demo-coverage";

const EMPTY_KPI: CoverageKpi = { coverage: 0, totalAttacks: 0, detectedAttacks: 0, missedAttacks: 0, mttdAvg: 0, exerciseDuration: "—" };

const DELAY_LEGEND = [
  { l: "#16a34a", d: "#22c55e", label: "0–30s · Excellent" },
  { l: "#65a30d", d: "#84cc16", label: "30–60s · Bon" },
  { l: "#d97706", d: "#eab308", label: "60–90s · Passable" },
  { l: "#ea580c", d: "#f97316", label: "90–120s · Attention" },
];
const SCORE_ZONES = [
  { color: "#22c55e", label: "0–33%" }, { color: "#eab308", label: "33–67%" }, { color: "#ef4444", label: "67–100%" },
];

export default function Coverage() {
  const { theme } = useTheme();
  const dark = theme === "dark";
  const demoMode   = useUiStore((s) => s.demoMode);
  const toggleDemo = useUiStore((s) => s.toggleDemo);

  const kpi      = demoMode ? DEMO_KPI      : EMPTY_KPI;
  const missed   = demoMode ? DEMO_MISSED   : [];
  const detected = demoMode ? DEMO_DETECTED : [];
  const noRuleCount  = missed.filter((a) => a.missReason === "NO_RULE").length;
  const timeoutCount = missed.filter((a) => a.missReason === "TIMEOUT").length;
  const minDelay = detected.length ? Math.min(...detected.map((d) => d.delaySeconds)) : 0;
  const maxDelay = detected.length ? Math.max(...detected.map((d) => d.delaySeconds)) : 0;

  const grid = dark ? "#ffffff08" : "#e2e8f0";
  const axis = dark ? "#ffffff15" : "#e2e8f0";
  const tick = dark ? "#666"      : "#94a3b8";

  const mttdTooltip = ({ active, payload }: any) => {
    if (!active || !payload?.length) return null;
    const d = payload[0]?.payload;
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-lg dark:border-white/10 dark:bg-black/90 dark:backdrop-blur-sm">
        <p className="font-mono text-[10px] uppercase tracking-widest" style={{ color: TOOL_COLORS[d?.tool] }}>{d?.tool}</p>
        <p className="mt-1 font-mono text-sm font-bold" style={{ color: delayColor(d?.delay, dark) }}>{d?.delay}s</p>
        <p className="font-mono text-[9px] uppercase tracking-widest text-slate-400 dark:text-coffee-bean-200/40">{getDelayLabel(d?.delay)}</p>
      </div>
    );
  };

  const toolTooltip = ({ active, payload }: any) => {
    if (!active || !payload?.length) return null;
    const d = payload[0]?.payload;
    const color = TOOL_COLORS[d?.name] ?? "#888";
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-lg dark:border-white/10 dark:bg-black/90 dark:backdrop-blur-sm">
        <p className="font-mono text-[10px] font-bold uppercase tracking-wider" style={{ color }}>{d?.name}</p>
        <p className="mt-1 font-mono text-xs text-slate-600 dark:text-coffee-bean-100">{d?.attacks} attaque{d?.attacks > 1 ? "s" : ""} détectée{d?.attacks > 1 ? "s" : ""}</p>
      </div>
    );
  };

  const detectedByTool = groupByTool(detected);
  const totalDetected  = detectedByTool.reduce((s, d) => s + d.attacks, 0);

  return (
    <div className="space-y-8">

      {/* ── PageHeader ─────────────────────────────────────────────────────── */}
      <PageHeader
        eyebrow="● Analytics — Purple Team"
        title="Coverage Scoreboard"
        description="Corrélation entre les attaques Red Team et les alertes Wazuh. Angles morts identifiés, raisons classifiées, preuves de détection disponibles."
        actions={
          <div className="flex items-center gap-3">
            <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest ${
              demoMode
                ? "border-orange-200 bg-orange-50 text-orange-600 dark:border-night-bordeaux-500/40 dark:bg-night-bordeaux-500/10 dark:text-night-bordeaux-300"
                : "border-green-200 bg-green-50 text-green-700 dark:border-green-500/40 dark:bg-green-500/10 dark:text-green-400"
            }`}>
              <motion.span animate={!demoMode ? { scale: [1, 1.5, 1], opacity: [1, 0.4, 1] } : { scale: 1 }}
                transition={{ duration: 1.8, repeat: Infinity }}
                className={`size-1.5 rounded-full ${demoMode ? "bg-orange-500 dark:bg-night-bordeaux-500" : "bg-green-500"}`} />
              {demoMode ? "Exercice Démo" : "En direct"}
            </span>
            <span className="font-mono text-[10px] uppercase tracking-widest text-slate-400 dark:text-coffee-bean-200/60">{kpi.detectedAttacks}/{kpi.totalAttacks} détectées</span>
          </div>
        }
      />

      {/* ── DETECTION LOGIC EXPLAINER ──────────────────────────────────────── */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
        className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-white/[0.06] dark:bg-black/30 dark:shadow-none dark:backdrop-blur-sm">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 dark:border-white/10 dark:bg-white/5">
            <Eye size={15} className="text-slate-600 dark:text-coffee-bean-100" />
          </div>
          <div>
            <p className="font-cinematic text-sm uppercase tracking-[0.22em] text-slate-900 dark:text-coffee-bean-50">Comment une attaque est-elle classée ?</p>
            <p className="mt-0.5 font-mono text-[10px] uppercase tracking-widest text-slate-400 dark:text-coffee-bean-200/35">Logique de corrélation Red Team ↔ Wazuh</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="rounded-xl border border-green-200 bg-green-50/50 p-4 dark:border-green-500/20 dark:bg-green-500/[0.04]">
            <div className="mb-3 flex items-center gap-2">
              <CheckCircle2 size={14} className="text-green-600 dark:text-green-400" />
              <p className="font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-green-700 dark:text-green-300">Détectée</p>
            </div>
            <p className="font-mono text-[11px] leading-relaxed text-slate-600 dark:text-coffee-bean-100/85">
              Une alerte Wazuh est émise pour la <span className="font-bold text-slate-800 dark:text-coffee-bean-50">même technique MITRE</span> que l'attaque, dans une fenêtre de <span className="font-bold text-green-700 dark:text-green-300">120 secondes</span>.
            </p>
            <div className="mt-3 flex items-center gap-2 font-mono text-[10px] text-slate-500 dark:text-coffee-bean-200/55">
              <span className="rounded border border-red-200 bg-red-50 px-1.5 py-0.5 text-red-600 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-400">ATK</span>
              <ArrowRight size={11} className="text-green-600 dark:text-green-400" />
              <span className="rounded border border-blue-200 bg-blue-50 px-1.5 py-0.5 text-blue-600 dark:border-blue-500/30 dark:bg-blue-500/10 dark:text-blue-400">ALR</span>
              <span className="text-slate-400 dark:text-coffee-bean-200/35">≤ 120 s</span>
            </div>
          </div>

          <div className="rounded-xl border border-red-200 bg-red-50/50 p-4 dark:border-red-500/20 dark:bg-red-500/[0.04]">
            <div className="mb-3 flex items-center gap-2">
              <AlertCircle size={14} className="text-red-600 dark:text-red-400" />
              <p className="font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-red-700 dark:text-red-300">Manquée — NO RULE</p>
            </div>
            <p className="font-mono text-[11px] leading-relaxed text-slate-600 dark:text-coffee-bean-100/85">
              Wazuh ne possède <span className="font-bold text-slate-800 dark:text-coffee-bean-50">aucune règle</span> pour cette technique. L'attaque passe inaperçue — aucun log n'est analysé.
            </p>
            <div className="mt-3 flex items-center gap-2 font-mono text-[10px] text-slate-500 dark:text-coffee-bean-200/55">
              <span className="rounded border border-red-200 bg-red-50 px-1.5 py-0.5 text-red-600 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-400">ATK</span>
              <ArrowRight size={11} className="text-red-500 dark:text-red-400" />
              <span className="rounded border border-slate-200 bg-slate-50 px-1.5 py-0.5 italic text-slate-400 dark:border-white/10 dark:bg-white/5 dark:text-coffee-bean-200/40">∅ alerte</span>
            </div>
          </div>

          <div className="rounded-xl border border-orange-200 bg-orange-50/50 p-4 dark:border-orange-500/20 dark:bg-orange-500/[0.04]">
            <div className="mb-3 flex items-center gap-2">
              <Clock size={14} className="text-orange-600 dark:text-orange-400" />
              <p className="font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-orange-700 dark:text-orange-300">Manquée — TIMEOUT</p>
            </div>
            <p className="font-mono text-[11px] leading-relaxed text-slate-600 dark:text-coffee-bean-100/85">
              La règle existe et l'alerte est levée, mais <span className="font-bold text-slate-800 dark:text-coffee-bean-50">après les 120 s</span>. La détection est trop tardive pour être valide.
            </p>
            <div className="mt-3 flex items-center gap-2 font-mono text-[10px] text-slate-500 dark:text-coffee-bean-200/55">
              <span className="rounded border border-red-200 bg-red-50 px-1.5 py-0.5 text-red-600 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-400">ATK</span>
              <ArrowRight size={11} className="text-orange-500 dark:text-orange-400" />
              <span className="rounded border border-blue-200 bg-blue-50 px-1.5 py-0.5 text-blue-600 dark:border-blue-500/30 dark:bg-blue-500/10 dark:text-blue-400">ALR</span>
              <span className="text-orange-600 dark:text-orange-400">&gt; 120 s</span>
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between gap-3 border-t border-slate-100 pt-3 dark:border-white/[0.05]">
          <p className="font-mono text-[10px] uppercase tracking-widest text-slate-400 dark:text-coffee-bean-200/35">
            Score = détectées / total · objectif ≥ 80 %
          </p>
          <p className="font-mono text-[10px] tracking-widest text-slate-400 dark:text-coffee-bean-200/35">
            Fenêtre de corrélation : <span className="text-slate-600 dark:text-coffee-bean-100">120 s</span>
          </p>
        </div>
      </motion.div>

      {/* ── BENTO KPI GRID ─────────────────────────────────────────────────── */}
      <div className="grid grid-cols-4 grid-rows-2 gap-4" style={{ gridTemplateRows: "repeat(2, 140px)" }}>

        <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}
          className="col-span-2 row-span-2 overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-white/[0.07] dark:bg-black/40 dark:shadow-none">
          <div className="flex h-full flex-col">
            <div className="flex items-center justify-between">
              <p className="font-cinematic text-sm uppercase tracking-[0.22em] text-slate-800 dark:text-coffee-bean-50">Score Global</p>
              <div className="flex gap-3">
                {SCORE_ZONES.map((z) => (
                  <span key={z.label} className="flex items-center gap-1 font-mono text-[9px] text-slate-400 dark:text-coffee-bean-200/40">
                    <span className="size-2 rounded-sm" style={{ backgroundColor: z.color }} />{z.label}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex-1"><SpeedometerGauge value={kpi.coverage} /></div>
            <div className="text-center">
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-slate-500 dark:text-coffee-bean-200/50">Taux de détection</p>
              <p className="mt-0.5 font-mono text-[9px] text-slate-400 dark:text-coffee-bean-200/35">{kpi.detectedAttacks} attaques détectées sur {kpi.totalAttacks}</p>
            </div>
            <div className="flex justify-center gap-6 font-mono text-[9px] uppercase tracking-wider text-slate-400 dark:text-coffee-bean-200/35">
              <span>{kpi.detectedAttacks} détectées</span>
              <span className="text-slate-300 dark:text-night-bordeaux-500/60">·</span>
              <span>{kpi.missedAttacks} manquées</span>
              <span className="text-slate-300 dark:text-night-bordeaux-500/60">·</span>
              <span>{kpi.totalAttacks} total</span>
            </div>
          </div>
        </motion.div>

        {([
          { tone: "red",    title: "Angles Morts",  Icon: AlertCircle, value: kpi.missedAttacks,    sub: `${noRuleCount} NO_RULE · ${timeoutCount} TIMEOUT`,                  delay: 0.10 },
          { tone: "blue",   title: "MTTD Moyen",    Icon: Clock,       value: `${kpi.mttdAvg}s`,    sub: `Min ${minDelay}s · Max ${maxDelay}s`,                               delay: 0.15 },
          { tone: "orange", title: "Total Attacks", Icon: Target,      value: kpi.totalAttacks,     sub: `${kpi.detectedAttacks} détectées · ${kpi.missedAttacks} manquées`, delay: 0.20 },
          { tone: "purple", title: "Durée",         Icon: Activity,    value: kpi.exerciseDuration, sub: "14:00 – 14:28",                                                     delay: 0.25 },
        ] as const).map((c) => <KpiCard key={c.title} {...c} />)}

      </div>

      {/* ── CHARTS ROW ─────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-white/[0.06] dark:bg-black/20 dark:shadow-none dark:backdrop-blur-sm">
          <p className="mb-4 font-cinematic text-base uppercase tracking-[0.2em] text-slate-900 dark:text-coffee-bean-50">Délai de Détection par Événement</p>
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={DEMO_MTTD_BARS} barCategoryGap="18%" margin={{ top: 5, right: 10, left: 0, bottom: 90 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={grid} vertical={false} />
                <XAxis dataKey="name" stroke={axis} interval={0} height={90}
                  tick={(props: { x: number; y: number; payload: { value: string } }) => (
                    <g transform={`translate(${props.x},${props.y})`}>
                      <text x={0} y={0} dy={4} textAnchor="end" transform="rotate(-40)" fill={tick} fontSize={9} fontFamily="JetBrains Mono">
                        {props.payload.value}
                      </text>
                    </g>
                  )} />
                <YAxis stroke={axis} tick={{ fill: tick, fontSize: 10, fontFamily: "JetBrains Mono" }} domain={[0, 130]} />
                <Tooltip content={mttdTooltip} />
                <ReferenceLine y={120} stroke="#ef4444" strokeDasharray="4 4"
                  label={{ value: "120s limite", position: "insideTopRight", fill: "#ef4444", fontSize: 10, fontFamily: "JetBrains Mono" }} />
                <Bar dataKey="delay" name="Délai (s)" radius={[4, 4, 0, 0]}>
                  {DEMO_MTTD_BARS.map((entry, i) => <Cell key={i} fill={delayColor(entry.delay, dark)} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5">
            <p className="mb-1 w-full font-mono text-[9px] uppercase tracking-widest text-slate-400 dark:text-coffee-bean-200/30">Légende — Qualité de détection</p>
            {DELAY_LEGEND.map((c) => (
              <span key={c.label} className="flex items-center gap-1.5 font-mono text-[10px] text-slate-500 dark:text-coffee-bean-200/50">
                <span className="size-2.5 rounded-sm" style={{ backgroundColor: dark ? c.d : c.l }} />{c.label}
              </span>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-white/[0.06] dark:bg-black/20 dark:shadow-none dark:backdrop-blur-sm">
          <p className="mb-4 font-cinematic text-base uppercase tracking-[0.2em] text-slate-900 dark:text-coffee-bean-50">Détection par Outil Red Team</p>
          <div className="grid grid-cols-[1.4fr_1fr] items-center gap-2">
            <div className="relative h-60">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip content={toolTooltip} />
                  <Pie data={detectedByTool} dataKey="attacks" nameKey="name"
                    cx="50%" cy="50%" innerRadius={62} outerRadius={100} paddingAngle={1}
                    stroke={dark ? "#0a0a0a" : "white"} strokeWidth={2}
                    isAnimationActive animationBegin={0} animationDuration={1000}>
                    {detectedByTool.map((d, i) => (
                      <Cell key={i} fill={TOOL_COLORS[d.name] ?? "#888"} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                <p className="font-mono text-2xl font-bold tabular-nums text-slate-900 dark:text-coffee-bean-50">{totalDetected}</p>
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-400 dark:text-coffee-bean-200/45">Détectées</p>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              {detectedByTool.map((d) => {
                const color = TOOL_COLORS[d.name] ?? "#888";
                return (
                  <div key={d.name} className="flex items-center gap-2.5">
                    <span className="size-3 shrink-0 rounded-full" style={{ backgroundColor: color }} />
                    <span className="flex-1 truncate font-mono text-xs capitalize text-slate-700 dark:text-coffee-bean-100">{d.name}</span>
                    <span className="font-mono text-[10px] tabular-nums text-slate-400 dark:text-coffee-bean-200/45">{d.attacks}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ── Gate ───────────────────────────────────────────────────────────── */}
      {!demoMode ? <LiveEmptyState onToggle={toggleDemo} /> : (
        <>
          {/* ── SECTION 1 — ATTAQUES DÉTECTÉES ─────────────────────────────── */}
          <section className="space-y-5">
            <div className="flex items-end justify-between">
              <div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 size={19} className="text-green-600 dark:text-green-400" />
                  <h2 className="font-cinematic text-2xl uppercase tracking-wider text-slate-900 dark:text-coffee-bean-50">Attaques Détectées</h2>
                </div>
                <p className="mt-1 font-mono text-xs text-slate-400 dark:text-coffee-bean-200/40">{detected.length} attaques corrélées — cliquer pour voir la preuve complète</p>
              </div>
              <div className="flex items-center gap-5">
                {[
                  { label: "Délai min", value: `${minDelay}s`,     cls: "text-green-600 dark:text-green-400" },
                  { label: "Délai max", value: `${maxDelay}s`,     cls: "text-orange-600 dark:text-orange-400" },
                  { label: "MTTD moy",  value: `${kpi.mttdAvg}s`,  cls: "text-blue-600 dark:text-blue-400" },
                ].map((s, i) => (
                  <div key={s.label} className="flex items-center gap-5">
                    {i > 0 && <div className="h-8 w-px bg-slate-200 dark:bg-white/10" />}
                    <div className="text-right">
                      <p className="font-mono text-[9px] uppercase tracking-widest text-slate-400 dark:text-coffee-bean-200/30">{s.label}</p>
                      <p className={`font-mono text-sm font-bold ${s.cls}`}>{s.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative overflow-hidden rounded-2xl border border-green-100 bg-white shadow-sm dark:border-green-500/10 dark:bg-black/20 dark:shadow-none dark:backdrop-blur-sm">
              <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-green-400 to-transparent dark:via-green-500/25" />
              <div className="border-b border-slate-100 px-5 py-3 dark:border-white/[0.05]">
                <div className="flex items-center justify-between">
                  <p className="font-cinematic text-base uppercase tracking-[0.2em] text-slate-900 dark:text-coffee-bean-50">Preuves de détection — {detected.length} corrélations</p>
                  <div className="flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-widest text-slate-400 dark:text-coffee-bean-200/25"><Eye size={10} />Cliquer pour voir</div>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-white/[0.04]">
                      {["ID", "Heure", "Outil", "Technique MITRE", "Délai de détection", "Sévérité Wazuh", ""].map((h) => (
                        <th key={h} className="py-2.5 px-3 text-left font-mono text-[9px] uppercase tracking-[0.25em] text-slate-400 first:pl-5 last:pr-5 dark:text-coffee-bean-200/25">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>{detected.map((atk, i) => <DrillDownRow key={atk.id} atk={atk} index={i} />)}</tbody>
                </table>
              </div>
              <div className="border-t border-slate-100 px-5 py-2.5 dark:border-white/[0.04]">
                <p className="font-mono text-[9px] uppercase tracking-widest text-slate-300 dark:text-coffee-bean-200/20">Corrélation MITRE ATT&CK — fenêtre 120s — {detected.length}/{kpi.totalAttacks} corrélées</p>
              </div>
            </div>
          </section>

          {/* ── SECTION 2 — ANGLES MORTS ───────────────────────────────────── */}
          <section className="space-y-5">
            <div className="flex items-end justify-between">
              <div>
                <div className="flex items-center gap-2.5">
                  <motion.span animate={{ opacity: [1, 0.25, 1] }} transition={{ duration: 1.4, repeat: Infinity }}
                    className="size-2 rounded-full bg-red-500 shadow-[0_0_7px_rgba(239,68,68,0.6)]" />
                  <h2 className="font-cinematic text-2xl uppercase tracking-wider text-slate-900 dark:text-coffee-bean-50">Angles Morts</h2>
                </div>
                <p className="mt-1 font-mono text-xs text-slate-400 dark:text-coffee-bean-200/40">{missed.length} attaques non détectées dans la fenêtre de corrélation (120s)</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2 font-mono text-xs text-red-600 dark:border-red-500/25 dark:bg-red-500/[0.08] dark:text-red-400">
                  <AlertCircle size={13} />{noRuleCount} SANS RÈGLE
                </span>
                <span className="inline-flex items-center gap-2 rounded-xl border border-orange-200 bg-orange-50 px-4 py-2 font-mono text-xs text-orange-600 dark:border-orange-500/25 dark:bg-orange-500/[0.08] dark:text-orange-400">
                  <Clock size={13} />{timeoutCount} DÉLAI DÉPASSÉ
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
              <div className="rounded-2xl border border-red-100 bg-red-50 p-5 dark:border-red-500/15 dark:bg-red-500/[0.04]">
                <div className="flex items-start gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-red-100 dark:bg-red-500/12">
                    <AlertCircle size={17} className="text-red-600 dark:text-red-400" />
                  </div>
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-widest text-red-600 dark:text-red-400">SANS RÈGLE</p>
                    <p className="mt-1 font-mono text-2xl font-bold text-red-700 dark:text-red-300">{noRuleCount} attaques</p>
                    <p className="mt-2 font-mono text-[11px] leading-relaxed text-slate-500 dark:text-coffee-bean-200/50">Wazuh ne possède aucune règle pour ces techniques. L'attaque est invisible — aucun log analysé.</p>
                  </div>
                </div>
              </div>
              <div className="rounded-2xl border border-orange-100 bg-orange-50 p-5 dark:border-orange-500/15 dark:bg-orange-500/[0.04]">
                <div className="flex items-start gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-orange-100 dark:bg-orange-500/12">
                    <Clock size={17} className="text-orange-600 dark:text-orange-400" />
                  </div>
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-widest text-orange-600 dark:text-orange-400">DÉLAI DÉPASSÉ</p>
                    <p className="mt-1 font-mono text-2xl font-bold text-orange-700 dark:text-orange-300">{timeoutCount} attaques</p>
                    <p className="mt-2 font-mono text-[11px] leading-relaxed text-slate-500 dark:text-coffee-bean-200/50">Alerte générée après la fenêtre de 120s. La règle existe — c'est la latence de détection qui pose problème.</p>
                  </div>
                </div>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-white/[0.06] dark:bg-white/[0.02]">
                <p className="font-mono text-[10px] uppercase tracking-widest text-slate-400 dark:text-coffee-bean-200/35">Règle de corrélation</p>
                <div className="mt-3 space-y-2.5">
                  {["Même technique MITRE", "Alerte dans les 120 secondes"].map((r) => (
                    <div key={r} className="flex items-center gap-2.5">
                      <span className="size-1.5 shrink-0 rounded-full bg-green-500" />
                      <p className="font-mono text-[11px] text-slate-600 dark:text-coffee-bean-200/65">{r}</p>
                    </div>
                  ))}
                  <div className="mt-3 h-px bg-slate-200 dark:bg-white/5" />
                  <p className="font-mono text-[10px] leading-relaxed text-slate-400 dark:text-coffee-bean-200/35">Les deux conditions doivent être réunies pour compter une attaque comme détectée.</p>
                </div>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-2xl border border-red-100 bg-white shadow-sm dark:border-red-500/10 dark:bg-black/20 dark:shadow-none dark:backdrop-blur-sm">
              <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-red-400 to-transparent dark:via-red-500/30" />
              <div className="border-b border-slate-100 px-5 py-3 dark:border-white/[0.05]">
                <p className="font-cinematic text-base uppercase tracking-[0.2em] text-slate-900 dark:text-coffee-bean-50">Attaques — Angles Morts — {missed.length} non détectées</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-white/[0.04]">
                      {["ID", "Heure", "Outil", "Technique MITRE", "Commande", "Tentatives", "Raison de l'échec"].map((h) => (
                        <th key={h} className="py-2.5 px-3 text-left font-mono text-[9px] uppercase tracking-[0.25em] text-slate-400 first:pl-5 last:pr-5 dark:text-coffee-bean-200/25">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>{missed.map((atk, i) => <MissedRow key={atk.id} atk={atk} index={i} />)}</tbody>
                </table>
              </div>
              <div className="border-t border-slate-100 px-5 py-2.5 dark:border-white/[0.04]">
                <p className="font-mono text-[9px] uppercase tracking-widest text-slate-300 dark:text-coffee-bean-200/20">
                  {noRuleCount} × règle manquante — {timeoutCount} × délai dépassé — fenêtre 120s
                </p>
              </div>
            </div>
          </section>

          {/* ── EXPORT REPORT CTA ──────────────────────────────────────────── */}
          <motion.section
            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
            className="relative overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br from-white via-white to-slate-50 p-6 shadow-sm dark:border-white/[0.08] dark:from-black/40 dark:via-black/30 dark:to-night-bordeaux-950/20 dark:shadow-none dark:backdrop-blur-sm sm:p-8">
            <motion.div aria-hidden
              animate={{ x: [0, 18, 0], y: [0, -10, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="pointer-events-none absolute -right-16 -top-16 size-56 rounded-full bg-gradient-to-br from-red-200/35 via-orange-200/25 to-transparent blur-3xl dark:from-night-bordeaux-500/15 dark:via-orange-500/10" />

            <div className="relative flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-4">
                <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl border border-night-bordeaux-200 bg-night-bordeaux-50 dark:border-night-bordeaux-500/30 dark:bg-night-bordeaux-500/10">
                  <FileDown size={18} className="text-night-bordeaux-600 dark:text-night-bordeaux-400" />
                </div>
                <div>
                  <p className="font-cinematic text-base uppercase tracking-[0.2em] text-slate-900 dark:text-coffee-bean-50">
                    Besoin d'un rapport partageable ?
                  </p>
                  <p className="mt-1.5 max-w-md font-mono text-[11px] leading-relaxed text-slate-500 dark:text-coffee-bean-200/55">
                    Exporte toutes les données de cet exercice en un PDF audit-ready : KPIs, preuves de corrélation Red Team ↔ Wazuh, angles morts et charges utiles.
                  </p>
                </div>
              </div>

              <Link to="/dashboard/incidents"
                className="group inline-flex shrink-0 items-center gap-2.5 rounded-full border border-night-bordeaux-300/60 bg-gradient-to-br from-night-bordeaux-500 via-red-600 to-night-bordeaux-700 px-5 py-2.5 font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-white shadow-[0_8px_28px_-8px_rgba(196,59,59,0.55)] transition-all hover:shadow-[0_14px_40px_-8px_rgba(196,59,59,0.8)] dark:border-night-bordeaux-400/40">
                Générer le rapport
                <motion.span className="inline-flex"
                  animate={{ x: [0, 4, 0] }}
                  transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}>
                  <ArrowRight size={14} />
                </motion.span>
              </Link>
            </div>
          </motion.section>
        </>
      )}
    </div>
  );
}
