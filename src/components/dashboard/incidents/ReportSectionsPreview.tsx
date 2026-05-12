import { motion } from "framer-motion";
import { FileText, Target, CheckCircle2, AlertCircle, Layers } from "lucide-react";

const SECTIONS = [
  { icon: Target,       label: "Indicateurs Clés",       desc: "Taux de détection, MTTD, angles morts",       color: "#0ea5e9" },
  { icon: CheckCircle2, label: "Preuves de Corrélation", desc: "Chaque ATK ↔ ALR avec commande & règle",      color: "#16a34a" },
  { icon: AlertCircle,  label: "Angles Morts",           desc: "Attaques manquées par cause classifiée",      color: "#dc2626" },
  { icon: Layers,       label: "Répartition par Outil",  desc: "Stats par outil Red Team & délai moyen",      color: "#a855f7" },
  { icon: FileText,     label: "Charges Utiles",         desc: "Commandes des angles morts (base de règles)", color: "#f97316" },
];

export const ReportSectionsPreview = () => (
  <motion.section
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: 0.15 }}
  >
    <div className="mb-5 flex items-center gap-3">
      <div className="flex size-9 items-center justify-center rounded-xl border border-slate-200 bg-white dark:border-white/10 dark:bg-white/5">
        <FileText size={15} className="text-slate-700 dark:text-coffee-bean-100" />
      </div>
      <div>
        <p className="font-cinematic text-sm uppercase tracking-[0.22em] text-slate-900 dark:text-coffee-bean-50">Contenu du rapport</p>
        <p className="mt-0.5 font-mono text-[10px] uppercase tracking-widest text-slate-400 dark:text-coffee-bean-200/35">5 sections · 2 pages A4</p>
      </div>
    </div>

    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
      {SECTIONS.map((s, i) => (
        <motion.div
          key={s.label}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.25 + i * 0.07, ease: [0.32, 0.72, 0, 1] }}
          whileHover={{ y: -4 }}
          className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 transition-all hover:border-slate-300 hover:shadow-md dark:border-white/[0.06] dark:bg-black/30 dark:hover:border-white/[0.12] dark:hover:shadow-none dark:hover:bg-black/40 dark:backdrop-blur-sm"
        >
          <div
            className="absolute inset-x-0 top-0 h-0.5 transition-opacity opacity-0 group-hover:opacity-100"
            style={{ background: `linear-gradient(90deg, transparent, ${s.color}, transparent)` }}
          />
          <p className="font-mono text-[9px] uppercase tracking-widest text-slate-300 dark:text-coffee-bean-200/25">§ {i + 1}</p>
          <div className="mt-2 flex size-9 items-center justify-center rounded-xl border"
            style={{ borderColor: `${s.color}30`, background: `${s.color}10` }}>
            <s.icon size={15} style={{ color: s.color }} />
          </div>
          <p className="mt-3 font-cinematic text-xs uppercase tracking-[0.18em] text-slate-900 dark:text-coffee-bean-50">{s.label}</p>
          <p className="mt-1 font-mono text-[10px] leading-relaxed text-slate-500 dark:text-coffee-bean-200/55">{s.desc}</p>
        </motion.div>
      ))}
    </div>
  </motion.section>
);
