import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

export const ExportToast = ({ visible }: { visible: boolean }) => (
  <AnimatePresence>
    {visible && (
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 12, scale: 0.95 }}
        transition={{ duration: 0.32, ease: [0.32, 0.72, 0, 1] }}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl border border-green-200 bg-white px-5 py-3.5 shadow-[0_12px_40px_-8px_rgba(0,0,0,0.18)] dark:border-green-500/25 dark:bg-black/85 dark:shadow-[0_12px_40px_-8px_rgba(34,197,94,0.25)] dark:backdrop-blur-md"
        style={{ visibility: "visible" }}
      >
        <motion.div
          initial={{ scale: 0, rotate: -90 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.08, type: "spring", stiffness: 280, damping: 16 }}
          className="flex size-8 items-center justify-center rounded-full bg-green-100 dark:bg-green-500/15"
        >
          <CheckCircle2 size={16} className="text-green-600 dark:text-green-400" />
        </motion.div>
        <div>
          <p className="font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-slate-900 dark:text-coffee-bean-50">
            Rapport généré
          </p>
          <p className="mt-0.5 font-mono text-[9px] tracking-wider text-slate-400 dark:text-coffee-bean-200/45">
            Vérifie ton dossier de téléchargements
          </p>
        </div>
      </motion.div>
    )}
  </AnimatePresence>
);
