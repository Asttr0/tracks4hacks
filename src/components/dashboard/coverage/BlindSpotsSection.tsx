import { motion } from "framer-motion";
import { AlertCircle, Clock } from "lucide-react";
import { MissedRow } from "./MissedRow";
import type { MissedAttack } from "../../../types/coverage";

interface Props {
  missed: MissedAttack[];
  noRuleCount: number;
  timeoutCount: number;
}

export const BlindSpotsSection = ({ missed, noRuleCount, timeoutCount }: Props) => (
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
);
