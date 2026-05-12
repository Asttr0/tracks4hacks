import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, FileDown } from "lucide-react";

export const ExportReportCta = () => (
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
);
