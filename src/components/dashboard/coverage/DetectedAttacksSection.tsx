import { CheckCircle2, Eye } from "lucide-react";
import { DrillDownRow } from "./DrillDownRow";
import type { CoverageKpi, DetectedAttack } from "../../../types/coverage";

interface Props {
  detected: DetectedAttack[];
  kpi: CoverageKpi;
  minDelay: number;
  maxDelay: number;
}

export const DetectedAttacksSection = ({ detected, kpi, minDelay, maxDelay }: Props) => (
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
          { label: "Délai min", value: `${minDelay}s`,    cls: "text-green-600 dark:text-green-400" },
          { label: "Délai max", value: `${maxDelay}s`,    cls: "text-orange-600 dark:text-orange-400" },
          { label: "MTTD moy",  value: `${kpi.mttdAvg}s`, cls: "text-blue-600 dark:text-blue-400" },
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
);
