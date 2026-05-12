import { motion } from "framer-motion";
import { AlertCircle, Clock, Activity, Target } from "lucide-react";
import { SpeedometerGauge } from "./SpeedometerGauge";
import { KpiCard } from "./KpiCard";
import type { CoverageKpi } from "../../../types/coverage";

const SCORE_ZONES = [
  { color: "#22c55e", label: "0–33%" },
  { color: "#eab308", label: "33–67%" },
  { color: "#ef4444", label: "67–100%" },
];

interface Props {
  kpi: CoverageKpi;
  noRuleCount: number;
  timeoutCount: number;
  minDelay: number;
  maxDelay: number;
}

export const CoverageKpiBento = ({ kpi, noRuleCount, timeoutCount, minDelay, maxDelay }: Props) => (
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
);
