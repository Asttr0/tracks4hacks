import { motion } from "framer-motion";
import { Github } from "lucide-react";
import { SectionHeader } from "./SectionHeader";
import { fadeUp, stagger, viewport } from "./anim";

const AUTHORS = [
  {
    name: "Mohamed Taha Slimani",
    handle: "Asttr0",
    github: "https://github.com/Asttr0",
    avatar: "https://github.com/Asttr0.png?size=300",
  },
  {
    name: "Ismail Garnaoui",
    handle: "ismailgr10",
    github: "https://github.com/ismailgr10",
    avatar: "https://github.com/ismailgr10.png?size=300",
  },
];

export const Authors = () => (
  <section id="authors" className="relative py-32 px-6 lg:px-16 xl:px-24">
    <div className="max-w-5xl mx-auto">
      <SectionHeader
        eyebrow="Operatives"
        title="L'équipe"
        description="Projet réalisé dans le cadre du module Technologies Web — ENSA Berrechid 2025-2026, encadré par Pr. Ilhame Ait Lbachir."
        align="center"
      />

      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="show"
        viewport={viewport}
        className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16"
      >
        {AUTHORS.map((a) => (
          <motion.div
            key={a.handle}
            variants={fadeUp}
            whileHover={{ y: -4 }}
            className="group relative p-7 rounded-xl border border-slate-300/60 dark:border-white/[0.08] bg-slate-100/60 dark:bg-white/[0.03] backdrop-blur-sm hover:border-red-500/40 dark:hover:border-red-500/40 hover:bg-white dark:hover:bg-white/[0.05] transition-all duration-500"
          >
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-red-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            <div className="relative flex items-center gap-5">
              <img
                src={a.avatar}
                alt={a.name}
                className="w-20 h-20 rounded-full border-2 border-red-500/30 object-cover shrink-0 group-hover:border-red-500 transition-colors"
              />
              <div className="min-w-0 flex-1">
                <p className="font-mono text-[10px] text-red-600 dark:text-red-400 tracking-[0.3em] uppercase mb-1">
                  Operative
                </p>
                <h3 className="font-cinematic text-slate-900 dark:text-white text-xl tracking-wide leading-tight">
                  {a.name}
                </h3>
                <a
                  href={a.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 mt-3 font-mono text-xs text-slate-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                >
                  <Github size={13} />@{a.handle}
                </a>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  </section>
);
