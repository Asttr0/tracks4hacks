import { motion } from "framer-motion";
import { Radio } from "lucide-react";

export const LiveEmptyState = ({ onToggle }: { onToggle: () => void }) => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
    className="flex min-h-[400px] flex-col items-center justify-center gap-8 rounded-2xl border border-slate-200 bg-slate-50 shadow-sm dark:border-white/[0.06] dark:bg-black/20 dark:shadow-none dark:backdrop-blur-sm">
    <div className="relative flex size-24 items-center justify-center">
      {[1, 2, 3].map((i) => (
        <motion.div key={i} animate={{ scale: [1, 1.7 * i, 1], opacity: [0.4, 0, 0.4] }}
          transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.5, ease: "easeOut" }}
          className="absolute size-full rounded-full border border-red-200 dark:border-night-bordeaux-500/25" />
      ))}
      <Radio size={28} className="text-red-500 dark:text-night-bordeaux-400" />
    </div>
    <div className="text-center">
      <p className="font-cinematic text-xl uppercase tracking-widest text-slate-800 dark:text-coffee-bean-50">Aucun exercice actif</p>
      <p className="mt-2 font-mono text-xs text-slate-400 dark:text-coffee-bean-200/40">Les données de corrélation apparaîtront dès qu'un exercice Red Team sera en cours.</p>
    </div>
    <button onClick={onToggle}
      className="rounded-full border border-red-200 bg-red-50 px-6 py-2.5 font-mono text-[11px] uppercase tracking-widest text-red-600 transition-all hover:bg-red-100 dark:border-night-bordeaux-500/50 dark:bg-night-bordeaux-500/10 dark:text-night-bordeaux-300 dark:hover:bg-night-bordeaux-500/20 dark:hover:shadow-[0_0_24px_-4px_rgba(196,59,59,0.5)]">
      Activer le mode Demo
    </button>
  </motion.div>
);
