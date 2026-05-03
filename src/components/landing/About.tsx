import { motion } from "framer-motion";
import { Eye, AlertTriangle, Target, Zap, Swords, ShieldCheck } from "lucide-react";
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

const TEAMS = [
  {
    id: "red",
    icon: Swords,
    title: "Red Team",
    subtitle: "Les Attaquants Éthiques",
    tagline: "« On simule les pirates pour trouver les failles. »",
    definition:
      "Une équipe de professionnels en cybersécurité dont le métier est d'attaquer leur propre entreprise — légalement. Ils reproduisent fidèlement les techniques d'un vrai cybercriminel pour découvrir les vulnérabilités avant qu'un pirate malveillant ne les exploite.",
    mission: "Trouver les portes ouvertes avant les méchants.",
    example:
      "Une banque embauche une Red Team pendant deux semaines. Les experts scannent les serveurs, tentent des mots de passe, exploitent un logiciel non mis à jour. Au final : un rapport listant les 12 chemins d'intrusion qu'ils ont réussi à emprunter.",
    glyphs: ["nmap", "hydra", "metasploit", "gobuster"],
  },
  {
    id: "blue",
    icon: ShieldCheck,
    title: "Blue Team",
    subtitle: "Les Défenseurs",
    tagline: "« On surveille, on détecte, on neutralise. »",
    definition:
      "L'équipe qui protège le système d'information au quotidien. Elle analyse les journaux d'événements, configure les outils de détection, et déclenche la riposte dès qu'un comportement suspect est repéré sur le réseau.",
    mission: "Détecter et stopper l'intrusion le plus vite possible.",
    example:
      "Pendant que la Red Team attaque la banque, la Blue Team scrute ses écrans : « 500 tentatives de connexion en 10 secondes sur le serveur mail — c'est du brute-force. » L'IP est bloquée, l'incident remonté, l'investigation lancée dans la minute.",
    glyphs: ["Wazuh", "Suricata", "SIEM", "IDS"],
  },
];

export const About = () => (
  <section id="about" className="relative py-32 px-6 lg:px-16 xl:px-24">
    <div className="max-w-7xl mx-auto">
      <SectionHeader
        eyebrow="Le Problème"
        title="Et si vous pouviez voir une cyberattaque... en direct ?"
        description="Chaque jour, des milliers d'entreprises subissent des tentatives d'intrusion sans même le savoir. Des hackers scannent des ports, forcent des mots de passe, exploitent des failles — le tout en quelques secondes. La vraie question n'est pas est-ce qu'on nous attaque ? mais plutôt :"
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

      {/* === Red vs Blue — Grand titre animé === */}
      <div id="concepts" className="mt-32 mb-12 text-center relative">
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewport}
          transition={{ duration: 0.5 }}
          className="font-mono text-[11px] tracking-[0.4em] uppercase text-slate-500 dark:text-gray-400 mb-5"
        >
          ● Les Deux Camps de la Cybersécurité
        </motion.p>

        <div className="relative font-cinematic text-4xl md:text-6xl lg:text-7xl uppercase leading-[0.95] flex items-center justify-center flex-wrap gap-x-3 md:gap-x-5">
          {/* Shockwave ring — triggers at impact */}
          <motion.span
            aria-hidden
            initial={{ scale: 0, opacity: 0 }}
            whileInView={{ scale: [0, 1.4, 2.2], opacity: [0, 0.9, 0] }}
            viewport={viewport}
            transition={{ duration: 1.1, delay: 0.85, ease: "easeOut" }}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 md:w-48 md:h-48 rounded-full pointer-events-none"
            style={{
              border: "2px solid rgba(255,255,255,0.7)",
              boxShadow:
                "0 0 60px rgba(239,68,68,0.6), inset 0 0 40px rgba(59,130,246,0.5)",
            }}
          />
          {/* Second wave */}
          <motion.span
            aria-hidden
            initial={{ scale: 0, opacity: 0 }}
            whileInView={{ scale: [0, 1.8, 3], opacity: [0, 0.5, 0] }}
            viewport={viewport}
            transition={{ duration: 1.4, delay: 0.95, ease: "easeOut" }}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 md:w-32 md:h-32 rounded-full pointer-events-none"
            style={{
              border: "1px solid rgba(239,68,68,0.5)",
            }}
          />
          {/* Impact flash */}
          <motion.span
            aria-hidden
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: [0, 1, 0], scale: [0, 1.5, 2.5] }}
            viewport={viewport}
            transition={{ duration: 0.5, delay: 0.8, ease: "easeOut" }}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 md:w-28 md:h-28 rounded-full pointer-events-none blur-xl"
            style={{
              background:
                "radial-gradient(circle, rgba(255,255,255,0.95), rgba(239,68,68,0.6) 40%, rgba(59,130,246,0.6) 70%, transparent 90%)",
            }}
          />

          {/* RED TEAM — charges from left with motion blur trail */}
          <motion.span
            initial={{ x: -400, opacity: 0, filter: "blur(20px)", skewX: -15 }}
            whileInView={{ x: 0, opacity: 1, filter: "blur(0px)", skewX: 0 }}
            viewport={viewport}
            transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
            className="relative inline-block"
          >
            <motion.span
              animate={{
                textShadow: [
                  "0 0 20px rgba(239,68,68,0.4)",
                  "0 0 35px rgba(239,68,68,0.8)",
                  "0 0 20px rgba(239,68,68,0.4)",
                ],
              }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              className="bg-clip-text text-transparent inline-block"
              style={{
                backgroundImage:
                  "linear-gradient(90deg,#dc2626 0%,#ef4444 50%,#f87171 100%)",
                WebkitBackgroundClip: "text",
              }}
            >
              Red Team
            </motion.span>
          </motion.span>

          {/* VS — appears with explosive punch + tremor */}
          <motion.span
            initial={{ scale: 0, opacity: 0, rotate: -180 }}
            whileInView={{
              scale: [0, 1.8, 0.9, 1.1, 1],
              opacity: [0, 1, 1, 1, 1],
              rotate: [-180, 0, 8, -5, 0],
            }}
            viewport={viewport}
            transition={{
              duration: 0.8,
              delay: 0.85,
              ease: "easeOut",
              times: [0, 0.4, 0.6, 0.8, 1],
            }}
            className="relative inline-block font-thin text-slate-400 dark:text-gray-500 mx-1 md:mx-2"
            style={{
              textShadow: "0 0 20px rgba(255,255,255,0.5)",
            }}
          >
            vs
          </motion.span>

          {/* BLUE TEAM — charges from right with motion blur trail */}
          <motion.span
            initial={{ x: 400, opacity: 0, filter: "blur(20px)", skewX: 15 }}
            whileInView={{ x: 0, opacity: 1, filter: "blur(0px)", skewX: 0 }}
            viewport={viewport}
            transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
            className="relative inline-block"
          >
            <motion.span
              animate={{
                textShadow: [
                  "0 0 20px rgba(59,130,246,0.4)",
                  "0 0 35px rgba(59,130,246,0.8)",
                  "0 0 20px rgba(59,130,246,0.4)",
                ],
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1.25,
              }}
              className="bg-clip-text text-transparent inline-block"
              style={{
                backgroundImage:
                  "linear-gradient(90deg,#60a5fa 0%,#3b82f6 50%,#2563eb 100%)",
                WebkitBackgroundClip: "text",
              }}
            >
              Blue Team
            </motion.span>
          </motion.span>

          {/* Spark particles emitted from collision */}
          {[...Array(6)].map((_, i) => {
            const angle = (i * 60 * Math.PI) / 180;
            const dx = Math.cos(angle) * 80;
            const dy = Math.sin(angle) * 80;
            return (
              <motion.span
                key={i}
                aria-hidden
                initial={{ x: 0, y: 0, opacity: 0, scale: 0 }}
                whileInView={{
                  x: [0, dx],
                  y: [0, dy],
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0],
                }}
                viewport={viewport}
                transition={{ duration: 0.7, delay: 0.85 + i * 0.02, ease: "easeOut" }}
                className="absolute left-1/2 top-1/2 w-1.5 h-1.5 rounded-full pointer-events-none"
                style={{
                  background: i % 2 === 0 ? "#ef4444" : "#3b82f6",
                  boxShadow: i % 2 === 0 ? "0 0 8px #ef4444" : "0 0 8px #3b82f6",
                }}
              />
            );
          })}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={viewport}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-6 max-w-2xl mx-auto text-slate-600 dark:text-gray-400 text-base md:text-lg leading-relaxed"
        >
          Deux équipes, un seul terrain de jeu. L'une attaque, l'autre défend.
          Tracks4Hacks les fait dialoguer en temps réel — pour la première fois.
        </motion.p>

        {/* Animated divider with crossing swords/shield motion */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          whileInView={{ scaleX: 1, opacity: 1 }}
          viewport={viewport}
          transition={{ duration: 1.2, delay: 0.6 }}
          className="mt-10 mx-auto h-px w-2/3 origin-center"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(239,68,68,0.7), rgba(255,255,255,0.5), rgba(59,130,246,0.7), transparent)",
          }}
        />
      </div>

      {/* === Red & Blue cards === */}
      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="show"
        viewport={viewport}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 relative"
      >
        {/* Center "VS" badge for desktop */}
        <div
          aria-hidden
          className="hidden lg:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none"
        >
          <motion.div
            initial={{ scale: 0, rotate: -45 }}
            whileInView={{ scale: 1, rotate: 0 }}
            viewport={viewport}
            transition={{ duration: 0.6, delay: 0.4, type: "spring", stiffness: 180 }}
            className="w-16 h-16 rounded-full flex items-center justify-center font-cinematic text-lg uppercase tracking-widest text-white shadow-2xl"
            style={{
              background: "linear-gradient(135deg,#ef4444 0%,#7c3aed 50%,#3b82f6 100%)",
              boxShadow: "0 0 40px rgba(239,68,68,0.5),0 0 60px rgba(59,130,246,0.4)",
            }}
          >
            VS
          </motion.div>
        </div>

        {TEAMS.map((team, idx) => {
          const Icon = team.icon;
          const isRed = team.id === "red";
          return (
            <motion.div
              key={team.id}
              variants={fadeUp}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className="group relative rounded-2xl overflow-hidden border-2 backdrop-blur-sm transition-all duration-500"
              style={{
                borderColor: isRed ? "rgba(239,68,68,0.45)" : "rgba(59,130,246,0.45)",
                background: isRed
                  ? "linear-gradient(145deg, rgba(239,68,68,0.08), rgba(127,29,29,0.04) 60%, transparent)"
                  : "linear-gradient(145deg, rgba(59,130,246,0.08), rgba(30,58,138,0.04) 60%, transparent)",
              }}
            >
              {/* Glow corner */}
              <div
                aria-hidden
                className="absolute -top-24 -right-24 w-72 h-72 rounded-full blur-3xl opacity-40 group-hover:opacity-70 transition-opacity duration-700"
                style={{
                  background: isRed
                    ? "radial-gradient(circle, rgba(239,68,68,0.55), transparent 70%)"
                    : "radial-gradient(circle, rgba(59,130,246,0.55), transparent 70%)",
                }}
              />
              {/* Animated top border bar */}
              <motion.div
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={viewport}
                transition={{ duration: 0.9, delay: 0.2 + idx * 0.15 }}
                className="absolute top-0 left-0 right-0 h-1 origin-left"
                style={{
                  background: isRed
                    ? "linear-gradient(90deg,#ef4444,#f87171,transparent)"
                    : "linear-gradient(90deg,#3b82f6,#60a5fa,transparent)",
                }}
              />

              <div className="relative p-8 md:p-10">
                {/* Icon + label */}
                <div className="flex items-center gap-4 mb-6">
                  <motion.div
                    whileHover={{ rotate: isRed ? -12 : 12, scale: 1.08 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="w-16 h-16 rounded-xl flex items-center justify-center shadow-lg"
                    style={{
                      background: isRed
                        ? "linear-gradient(135deg,#dc2626,#7f1d1d)"
                        : "linear-gradient(135deg,#2563eb,#1e3a8a)",
                      boxShadow: isRed
                        ? "0 8px 32px rgba(239,68,68,0.45)"
                        : "0 8px 32px rgba(59,130,246,0.45)",
                    }}
                  >
                    <Icon size={30} className="text-white" />
                  </motion.div>
                  <div>
                    <p
                      className="font-mono text-[10px] tracking-[0.3em] uppercase mb-1"
                      style={{ color: isRed ? "#ef4444" : "#3b82f6" }}
                    >
                      {team.subtitle}
                    </p>
                    <h3 className="font-cinematic text-3xl md:text-4xl text-slate-900 dark:text-white uppercase tracking-wide">
                      {team.title}
                    </h3>
                  </div>
                </div>

                {/* Tagline */}
                <p
                  className="font-cinematic italic text-lg md:text-xl mb-6 pl-4 border-l-2"
                  style={{
                    borderColor: isRed ? "#ef4444" : "#3b82f6",
                    color: isRed ? "#dc2626" : "#2563eb",
                  }}
                >
                  {team.tagline}
                </p>

                {/* Definition */}
                <div className="mb-5">
                  <p
                    className="font-mono text-[10px] tracking-[0.25em] uppercase mb-2"
                    style={{ color: isRed ? "#ef4444" : "#3b82f6" }}
                  >
                    En clair
                  </p>
                  <p className="text-slate-700 dark:text-gray-300 text-[15px] leading-relaxed">
                    {team.definition}
                  </p>
                </div>

                {/* Mission */}
                <div className="mb-5 pt-4 border-t border-slate-200 dark:border-white/10">
                  <p
                    className="font-mono text-[10px] tracking-[0.25em] uppercase mb-2"
                    style={{ color: isRed ? "#ef4444" : "#3b82f6" }}
                  >
                    Sa mission
                  </p>
                  <p className="text-slate-800 dark:text-white text-[15px] font-semibold leading-relaxed">
                    {team.mission}
                  </p>
                </div>

                {/* Example */}
                <div className="mb-5 pt-4 border-t border-slate-200 dark:border-white/10">
                  <p
                    className="font-mono text-[10px] tracking-[0.25em] uppercase mb-2"
                    style={{ color: isRed ? "#ef4444" : "#3b82f6" }}
                  >
                    Exemple concret
                  </p>
                  <p className="text-slate-600 dark:text-gray-400 text-sm leading-relaxed italic">
                    {team.example}
                  </p>
                </div>

                {/* Glyphs */}
                <div className="flex flex-wrap gap-2 pt-4 border-t border-slate-200 dark:border-white/10">
                  {team.glyphs.map((g) => (
                    <span
                      key={g}
                      className="font-mono text-[11px] px-3 py-1 rounded-md border"
                      style={{
                        borderColor: isRed ? "rgba(239,68,68,0.4)" : "rgba(59,130,246,0.4)",
                        color: isRed ? "#dc2626" : "#2563eb",
                        background: isRed ? "rgba(239,68,68,0.06)" : "rgba(59,130,246,0.06)",
                      }}
                    >
                      {g}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* === Problematic intro title === */}
      <div className="mt-32 mb-14 text-center relative">
        {/* Glitch / scan line behind */}
        <motion.div
          aria-hidden
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={viewport}
          transition={{ duration: 1 }}
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(239,68,68,0.04) 3px, rgba(239,68,68,0.04) 4px)",
            maskImage: "radial-gradient(ellipse at center, black 30%, transparent 70%)",
            WebkitMaskImage: "radial-gradient(ellipse at center, black 30%, transparent 70%)",
          }}
        />

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewport}
          transition={{ duration: 0.5 }}
          className="relative font-mono text-[11px] tracking-[0.4em] uppercase text-red-500 dark:text-red-400 mb-5"
        >
          ▲ Avertissement Système ▲
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, scale: 0.92, filter: "blur(10px)" }}
          whileInView={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          viewport={viewport}
          transition={{ duration: 1, ease: [0.2, 0.8, 0.2, 1] }}
          className="relative font-cinematic text-3xl md:text-5xl lg:text-6xl uppercase leading-[1.05] text-slate-900 dark:text-white"
        >
          Mais en réalité,{" "}
          <span className="relative inline-block">
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage:
                  "linear-gradient(90deg,#ef4444,#dc2626 50%,#7f1d1d)",
              }}
            >
              ces deux mondes
            </span>
            <motion.span
              aria-hidden
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={viewport}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="absolute -bottom-1 left-0 right-0 h-[3px] origin-left"
              style={{
                background: "linear-gradient(90deg,#ef4444,transparent)",
                boxShadow: "0 0 12px #ef4444",
              }}
            />
          </span>
          <br />
          <span className="text-slate-700 dark:text-gray-300">
            ne se parlent{" "}
          </span>
          <span
            className="italic font-cinematic"
            style={{
              color: "#ef4444",
              textShadow: "0 0 25px rgba(239,68,68,0.6)",
            }}
          >
            jamais.
          </span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={viewport}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="relative mt-7 max-w-2xl mx-auto text-slate-600 dark:text-gray-400 text-base md:text-lg leading-relaxed"
        >
          Pas de canal direct. Pas de tableau commun. Chacun travaille dans
          son silo — et c'est là que les attaques passent inaperçues.
        </motion.p>

        {/* Dual pulsing dots — red/blue disconnected */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={viewport}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="relative mt-10 flex items-center justify-center gap-4"
        >
          <motion.span
            animate={{ scale: [1, 1.3, 1], opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="block w-2.5 h-2.5 rounded-full bg-red-500"
            style={{ boxShadow: "0 0 14px #ef4444" }}
          />
          <span className="font-mono text-[10px] tracking-[0.5em] uppercase text-slate-500 dark:text-gray-500">
            ╳ aucune liaison ╳
          </span>
          <motion.span
            animate={{ scale: [1, 1.3, 1], opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="block w-2.5 h-2.5 rounded-full bg-blue-500"
            style={{ boxShadow: "0 0 14px #3b82f6" }}
          />
        </motion.div>
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
              className="group relative p-7 rounded-xl border border-slate-200 dark:border-white/5 bg-white dark:bg-white/[0.02] backdrop-blur-sm hover:border-red-500/50 dark:hover:border-red-600/40 hover:shadow-xl hover:shadow-red-500/5 transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-5">
                <div className="w-11 h-11 rounded-lg bg-red-500/10 dark:bg-red-600/10 border border-red-500/30 dark:border-red-600/30 flex items-center justify-center group-hover:bg-red-500/20 dark:group-hover:bg-red-600/20 transition-colors">
                  <Icon size={20} className="text-red-600 dark:text-red-400" />
                </div>
                <span className="font-cinematic text-3xl text-slate-200 dark:text-white/10 group-hover:text-red-500/30 dark:group-hover:text-red-500/30 transition-colors">
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
              Chaque attaque et chaque alerte de détection sont <span className="text-red-600 dark:text-red-400 font-semibold">corrélées automatiquement</span>, en direct, et affichées sur un tableau de bord unique. Plus besoin de tableurs : l'écart de détection est visible en un coup d'œil.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  </section>
);
