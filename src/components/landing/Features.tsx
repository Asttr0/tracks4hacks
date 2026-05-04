import { motion } from "framer-motion";
import {
  Activity,
  Grid3x3,
  BarChart3,
  PlayCircle,
  Globe2,
  FileText,
  Command,
  PlayCircle as Demo,
  type LucideIcon,
} from "lucide-react";
import { SectionHeader } from "./SectionHeader";
import { fadeUp, stagger, viewport } from "./anim";

type Feature = {
  num: string;
  icon: LucideIcon;
  title: string;
  desc: string;
  tag: string;
};

const FEATURES: Feature[] = [
  {
    num: "01",
    icon: Activity,
    title: "Timeline de Corrélation Red/Blue",
    desc: "Graphique à double axe (Recharts). Voie haute = actions d'attaque, voie basse = alertes de détection. Bandes ombrées automatiques sur les corrélations dans une fenêtre de 120s — l'histoire complète de l'engagement en un seul visuel.",
    tag: "Recharts ● Live correlation",
  },
  {
    num: "02",
    icon: Grid3x3,
    title: "Heatmap MITRE ATT&CK",
    desc: "Grille à 14 colonnes, une par tactique MITRE, colorée par volume d'alertes. Vert = attaque détectée. Rouge vif = attaque lancée mais rien détecté — les angles morts de la défense, exposés instantanément.",
    tag: "ATT&CK v14 ● Coverage map",
  },
  {
    num: "03",
    icon: BarChart3,
    title: "Tableau de Couverture",
    desc: "Quatre indicateurs clés : pourcentage global de détection, par outil, par technique MITRE, et latence moyenne attaque → alerte. La réponse chiffrée à : « Sommes-nous protégés ? »",
    tag: "KPI ● Realtime metrics",
  },
  {
    num: "04",
    icon: PlayCircle,
    title: "Attack Replay",
    desc: "Un bouton qui déclenche une campagne d'attaque scriptée depuis Kali via /api/attack-replay (protégé par header secret). Permet de relancer une démo complète sans retaper les commandes manuellement.",
    tag: "Endpoint protégé ● Scripted",
  },
  {
    num: "05",
    icon: Globe2,
    title: "Carte du Monde GeoIP",
    desc: "Carte interactive (react-simple-maps) qui plote les adresses IP source des attaquants. Chaque marqueur est dimensionné selon le volume d'alertes associé — utile pour repérer des patterns géographiques.",
    tag: "react-simple-maps ● Visual",
  },
  {
    num: "06",
    icon: FileText,
    title: "Rapport d'Incident PDF",
    desc: "Un clic sur n'importe quelle alerte génère un rapport imprimable d'une page (window.print + CSS @media print). Reproduit le format qu'un analyste SOC remettrait à sa direction après un incident.",
    tag: "@media print ● Audit-ready",
  },
];

const BONUS = [
  {
    icon: Command,
    title: "Command Palette",
    desc: "Cmd+K pour naviguer instantanément entre les vues. Recherche floue alimentée par Fuse.js — tape « geo » et arrive sur la GeoIP Map même avec une faute de frappe.",
  },
  {
    icon: Demo,
    title: "Mode Démo",
    desc: "Données pré-remplies pour démontrer le projet sans consommer les crédits Azure. Toggle accessible depuis la nav du dashboard.",
  },
];

export const Features = () => (
  <section id="features" className="relative py-32 px-6 lg:px-16 xl:px-24">
    <div className="max-w-7xl mx-auto">
      <SectionHeader
        eyebrow="Capacités Système"
        title="Six vues. Une seule histoire."
        description="Chaque module répond à une question opérationnelle précise du SOC."
        align="center"
      />

      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="show"
        viewport={viewport}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-16"
      >
        {FEATURES.map((feature) => {
          const Icon = feature.icon;
          return (
            <motion.div
              key={feature.num}
              variants={fadeUp}
              whileHover={{ y: -6, transition: { duration: 0.25 } }}
              className="group relative p-7 rounded-xl border border-slate-300/60 dark:border-white/[0.07] bg-slate-100/60 dark:bg-white/[0.03] backdrop-blur-sm hover:border-red-500/40 dark:hover:border-red-500/40 hover:bg-white dark:hover:bg-white/[0.05] hover:shadow-xl hover:shadow-red-500/10 transition-all duration-500 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-red-500/[0.04] dark:from-red-500/[0.06] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

              <span className="absolute top-4 right-5 font-cinematic text-5xl text-slate-300/70 dark:text-white/[0.04] group-hover:text-red-500/15 dark:group-hover:text-red-500/10 transition-colors duration-500">
                {feature.num}
              </span>

              <div className="relative">
                <div className="w-12 h-12 rounded-lg bg-red-500/10 dark:bg-red-600/10 border border-red-500/30 dark:border-red-600/30 flex items-center justify-center mb-5 group-hover:bg-red-500/20 dark:group-hover:bg-red-600/20 group-hover:border-red-500 group-hover:shadow-[0_0_20px_rgba(220,38,38,0.3)] transition-all duration-300">
                  <Icon size={20} className="text-red-600 dark:text-red-400" />
                </div>
                <h3 className="font-cinematic text-slate-900 dark:text-white text-lg uppercase tracking-wide mb-3">
                  {feature.title}
                </h3>
                <p className="text-slate-600 dark:text-gray-400 text-sm leading-relaxed mb-5">
                  {feature.desc}
                </p>
                <span className="font-mono text-[10px] text-red-600 dark:text-red-400/70 tracking-[0.25em] uppercase border-t border-slate-300/60 dark:border-white/5 pt-3 block">
                  {feature.tag}
                </span>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Bonus features */}
      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="show"
        viewport={viewport}
        className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        {BONUS.map((b) => {
          const Icon = b.icon;
          return (
            <motion.div
              key={b.title}
              variants={fadeUp}
              whileHover={{ scale: 1.01 }}
              className="flex items-start gap-4 p-5 rounded-lg border border-slate-300/60 dark:border-white/[0.06] bg-slate-100/60 dark:bg-white/[0.02] hover:border-red-500/30 dark:hover:border-red-500/30 hover:bg-white dark:hover:bg-white/[0.04] transition-all"
            >
              <div className="w-10 h-10 rounded-lg bg-red-500/10 dark:bg-red-600/10 border border-red-500/20 dark:border-red-600/30 flex items-center justify-center shrink-0">
                <Icon size={18} className="text-red-600 dark:text-red-400" />
              </div>
              <div>
                <p className="font-mono text-[10px] text-red-600 dark:text-red-400 tracking-[0.25em] uppercase mb-1">
                  Bonus
                </p>
                <h4 className="font-mono text-sm text-slate-900 dark:text-white tracking-wide mb-1">
                  {b.title}
                </h4>
                <p className="text-slate-600 dark:text-gray-400 text-xs leading-relaxed">{b.desc}</p>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  </section>
);
