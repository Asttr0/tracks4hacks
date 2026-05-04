import { motion } from "framer-motion";
import { ArrowRight, Github } from "lucide-react";
import { fadeUp, viewport } from "./anim";

interface CTASectionProps {
  onLaunch?: () => void;
}

export const CTASection = ({ onLaunch }: CTASectionProps) => (
  <section className="relative py-32 px-6 lg:px-16 xl:px-24">
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={viewport}
      className="relative max-w-4xl mx-auto text-center rounded-2xl border border-red-500/30 bg-gradient-to-br from-red-50 via-white to-red-50/50 dark:from-red-950/20 dark:via-black/40 dark:to-black/40 backdrop-blur-md p-12 md:p-16 overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 via-transparent to-purple-500/10 dark:from-red-600/10 dark:to-purple-600/10 pointer-events-none" />
      <div className="absolute -top-20 -left-20 w-60 h-60 bg-red-500/20 dark:bg-red-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -right-20 w-60 h-60 bg-purple-500/15 dark:bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative">
        <p className="font-mono text-[11px] text-red-600 dark:text-red-400 tracking-[0.35em] uppercase mb-4">
          ● Simulation Environment Ready
        </p>
        <h2 className="font-cinematic text-slate-900 dark:text-white text-3xl md:text-5xl uppercase tracking-wide mb-5">
          Voir le purple team en action
        </h2>
        <p className="text-slate-700 dark:text-gray-400 text-base md:text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
          Lancez le dashboard live ou explorez le code source. Mode démo disponible — aucune
          configuration requise.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            onClick={onLaunch}
            className="group flex items-center gap-3 px-8 py-4 rounded-lg bg-red-600 hover:bg-red-500 text-white font-mono text-sm uppercase tracking-[0.25em] font-bold shadow-[0_0_30px_rgba(220,38,38,0.4)] hover:shadow-[0_0_50px_rgba(220,38,38,0.6)] transition-all"
          >
            Voir le Dashboard
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </motion.button>

          <motion.a
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            href="https://github.com/Asttr0/tracks4hacks"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-8 py-4 rounded-lg border border-slate-300 dark:border-white/15 bg-white dark:bg-white/[0.03] hover:bg-slate-50 dark:hover:bg-white/[0.06] hover:border-slate-400 dark:hover:border-white/30 text-slate-900 dark:text-white font-mono text-sm uppercase tracking-[0.25em] transition-all"
          >
            <Github size={16} />
            GitHub
          </motion.a>
        </div>
      </div>
    </motion.div>
  </section>
);
