import { motion } from "framer-motion";
import { Eye, AlertTriangle, Target, Zap } from "lucide-react";
import { SectionHeader } from "./SectionHeader";
import { fadeUp, stagger, viewport } from "./anim";

const STEPS = [
  {
    step: "01",
    icon: Eye,
    title: "Lancement isolé",
    desc: "L'équipe offensive lance une campagne d'attaques simulées pendant une semaine. Aucune communication directe avec les défenseurs.",
  },
  {
    step: "02",
    icon: AlertTriangle,
    title: "Surveillance à l'aveugle",
    desc: "L'équipe défensive continue de surveiller ses écrans, sans savoir quand ni comment les attaques arrivent. Beaucoup passent inaperçues.",
  },
  {
    step: "03",
    icon: Target,
    title: "Réunion post-mortem",
    desc: "Plusieurs semaines plus tard, les deux équipes comparent leurs notes dans des tableurs Excel et tentent de reconstruire ce qui s'est passé.",
  },
];

export const About = () => (
  <section id="about" className="relative py-32 px-6 lg:px-16 xl:px-24">
    <div className="max-w-7xl mx-auto">
      <SectionHeader
        eyebrow="Le Problème"
        title="Et si vous pouviez voir une cyberattaque... en direct ?"
        description="Chaque jour, des milliers d'entreprises subissent des tentatives d'intrusion sans même le savoir. Des hackers scannent des ports, forcent des mots de passe, exploitent des failles — le tout en quelques secondes. La vraie question n'est pas « est-ce qu'on nous attaque ? » mais plutôt :"
      />

      {/* Lead paragraph */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={viewport}
        className="mt-10 max-w-4xl"
      >
        <div className="border-l-2 border-red-600/60 pl-6 py-2">
          <p className="font-cinematic text-xl md:text-2xl text-slate-900 dark:text-white italic">
            « Quand on nous a attaqués... est-ce qu'on l'a vu passer ? »
          </p>
        </div>
      </motion.div>

      {/* Problem explanation */}
      <div className="mt-24 mb-14">
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewport}
          transition={{ duration: 0.5 }}
          className="font-mono text-[11px] tracking-[0.4em] uppercase text-red-500 dark:text-red-400 mb-5"
        >
          ▲ Le Problème Opérationnel ▲
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={viewport}
          transition={{ duration: 0.8, ease: [0.2, 0.8, 0.2, 1] }}
          className="font-cinematic text-3xl md:text-5xl uppercase leading-[1.05] text-slate-900 dark:text-white mb-6"
        >
          Les équipes travaillent{" "}
          <span
            className="bg-clip-text text-transparent"
            style={{ backgroundImage: "linear-gradient(90deg,#ef4444,#dc2626 50%,#7f1d1d)" }}
          >
            en silos.
          </span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={viewport}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="max-w-2xl text-slate-600 dark:text-gray-400 text-base md:text-lg leading-relaxed"
        >
          Pas de canal direct. Pas de tableau commun. L'équipe offensive et l'équipe défensive
          travaillent chacune dans son coin — et c'est là que les attaques passent inaperçues.
        </motion.p>
      </div>

      {/* 3-step process */}
      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="show"
        viewport={viewport}
        className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-12"
      >
        {STEPS.map((s) => {
          const Icon = s.icon;
          return (
            <motion.div
              key={s.step}
              variants={fadeUp}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="group relative p-7 rounded-xl border border-slate-200/60 dark:border-white/5 bg-white/[0.04] backdrop-blur-sm hover:border-red-500/50 dark:hover:border-red-600/40 hover:shadow-xl hover:shadow-red-500/5 transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-5">
                <div className="w-11 h-11 rounded-lg bg-red-500/10 dark:bg-red-600/10 border border-red-500/30 dark:border-red-600/30 flex items-center justify-center group-hover:bg-red-500/20 dark:group-hover:bg-red-600/20 transition-colors">
                  <Icon size={20} className="text-red-600 dark:text-red-400" />
                </div>
                <span className="font-cinematic text-3xl text-slate-200/20 dark:text-white/10 group-hover:text-red-500/30 dark:group-hover:text-red-500/30 transition-colors">
                  {s.step}
                </span>
              </div>
              <h3 className="font-cinematic text-slate-900 dark:text-white text-lg uppercase tracking-wide mb-3">
                {s.title}
              </h3>
              <p className="text-slate-600 dark:text-gray-400 text-sm leading-relaxed">{s.desc}</p>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Solution highlight */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={viewport}
        className="mt-16 p-8 md:p-10 rounded-2xl border border-red-500/30 bg-gradient-to-br from-red-500/5 via-transparent to-purple-500/5 dark:from-red-600/10 dark:to-purple-600/10 backdrop-blur-sm"
      >
        <div className="flex flex-col md:flex-row gap-6 items-start">
          <div className="w-14 h-14 rounded-xl bg-red-500 dark:bg-red-600 flex items-center justify-center shrink-0 shadow-lg shadow-red-500/30">
            <Zap size={26} className="text-white" />
          </div>
          <div>
            <p className="font-mono text-[10px] text-red-600 dark:text-red-400 tracking-[0.3em] uppercase mb-3">
              ● La solution Tracks4Hacks
            </p>
            <h3 className="font-cinematic text-slate-900 dark:text-white text-2xl md:text-3xl uppercase tracking-wide mb-4">
              Élimine ce décalage
            </h3>
            <p className="text-slate-700 dark:text-gray-300 text-base leading-relaxed">
              Chaque attaque et chaque alerte de détection sont{" "}
              <span className="text-red-600 dark:text-red-400 font-semibold">corrélées automatiquement</span>,
              en direct, et affichées sur un tableau de bord unique. Plus besoin de tableurs : l'écart
              de détection est visible en un coup d'œil.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  </section>
);
