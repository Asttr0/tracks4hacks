import { motion } from "framer-motion";
import { AlertCircle, Clock, ArrowRight, CheckCircle2, Eye } from "lucide-react";

export const DetectionExplainer = () => (
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
);
