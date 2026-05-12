import { motion } from "framer-motion";
import {
  Activity,
  Grid3x3,
  BarChart3,
  Globe2,
  FileText,
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
    desc: "Visualise sur un même graphique chaque attaque lancée et l'alerte défensive correspondante, en mettant en évidence les détections réussies dans une fenêtre de corrélation de 120 secondes.",
    tag: "Recharts ● Live correlation",
  },
  {
    num: "02",
    icon: Grid3x3,
    title: "Heatmap MITRE ATT&CK",
    desc: "Affiche les techniques d'attaque utilisées sur la grille officielle MITRE ATT&CK et révèle en rouge les angles morts — les attaques lancées qui n'ont généré aucune alerte de détection.",
    tag: "ATT&CK v14 ● Coverage map",
  },
  {
    num: "03",
    icon: BarChart3,
    title: "Tableau de Couverture",
    desc: "Concentre en un seul écran le taux global de détection, les performances par outil de sécurité et la latence moyenne entre une attaque et l'alerte correspondante.",
    tag: "KPI ● Realtime metrics",
  },
  {
    num: "04",
    icon: Globe2,
    title: "Carte du Monde GeoIP",
    desc: "Localise géographiquement les adresses IP sources des attaquants sur une carte interactive, avec des marqueurs proportionnels au volume d'alertes générées.",
    tag: "react-simple-maps ● Visual",
  },
  {
    num: "05",
    icon: FileText,
    title: "Rapport d'Incident PDF",
    desc: "Génère en un clic un rapport d'incident imprimable à partir de n'importe quelle alerte, reproduisant le format qu'un analyste SOC remettrait après un engagement.",
    tag: "@media print ● Audit-ready",
  },
];


export const Features = () => (
  <section id="features" className="relative py-32 px-6 lg:px-16 xl:px-24">
    <div className="max-w-7xl mx-auto">
      <SectionHeader
        eyebrow="Capacités Système"
        title="Cinq vues. Une seule histoire."
        description="Chaque module répond à une question opérationnelle précise."
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

    </div>
  </section>
);
