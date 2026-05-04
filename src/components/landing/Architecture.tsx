import { motion } from "framer-motion";
import { Terminal, Radar, Cloud, Monitor, ArrowDown, type LucideIcon } from "lucide-react";
import { SectionHeader } from "./SectionHeader";
import { fadeUp, stagger, viewport } from "./anim";

type Layer = {
  step: string;
  title: string;
  subtitle: string;
  desc: string;
  details: string[];
  icon: LucideIcon;
  accent: string;
  border: string;
  glow: string;
};

const LAYERS: Layer[] = [
  {
    step: "01",
    title: "L'Attaque",
    subtitle: "Red Team — Kali Linux local",
    desc: "Le poste Kali Linux local lance des outils offensifs contre la VM Azure. Chaque action est journalisée avec son horodatage, l'outil utilisé, la cible et la technique MITRE correspondante.",
    details: [
      "nmap, hydra, metasploit, gobuster",
      "Chaque commande journalisée dans attack-log.json",
      "Timestamp + outil + cible + technique MITRE",
    ],
    icon: Terminal,
    accent: "text-red-600 dark:text-red-400",
    border: "border-red-500/30",
    glow: "shadow-red-500/10",
  },
  {
    step: "02",
    title: "La Détection",
    subtitle: "Blue Team — VM Azure (Debian 12)",
    desc: "Suricata inspecte le trafic réseau entrant. Wazuh Manager ingère les alertes Suricata + ses propres événements (SSH échoués, modifications de fichiers…), applique ses règles et produit un flux unifié étiqueté MITRE.",
    details: [
      "Suricata → /var/log/suricata/eve.json",
      "Wazuh Manager — règles de détection + tag MITRE",
      "API REST exposée sur :55000",
    ],
    icon: Radar,
    accent: "text-blue-600 dark:text-blue-400",
    border: "border-blue-500/30",
    glow: "shadow-blue-500/10",
  },
  {
    step: "03",
    title: "Le Backend (BFF)",
    subtitle: "Netlify Functions serverless",
    desc: "Les Netlify Functions servent de proxy sécurisé entre le dashboard et l'API Wazuh. Elles détiennent les credentials (env vars Netlify), gèrent le cache JWT et exposent des endpoints propres.",
    details: [
      "/api/wazuh-alerts — fetch des alertes",
      "/api/wazuh-stream — streaming SSE",
      "Le code React n'a jamais accès aux secrets",
    ],
    icon: Cloud,
    accent: "text-purple-600 dark:text-purple-400",
    border: "border-purple-500/30",
    glow: "shadow-purple-500/10",
  },
  {
    step: "04",
    title: "Le Dashboard",
    subtitle: "Frontend React (CDN Netlify)",
    desc: "Le bundle React, servi via le CDN Netlify, affiche les données dans six vues interactives. Zustand pour l'état global, TanStack Query pour la synchro serveur, Recharts pour les graphes.",
    details: [
      "Timeline Red/Blue, Heatmap MITRE, GeoIP",
      "Coverage Scoreboard, Replay, Rapports PDF",
      "CI/CD GitHub Actions — tests + déploiement auto",
    ],
    icon: Monitor,
    accent: "text-cyan-600 dark:text-cyan-400",
    border: "border-cyan-500/30",
    glow: "shadow-cyan-500/10",
  },
];

export const Architecture = () => (
  <section id="architecture" className="relative py-32 px-6 lg:px-16 xl:px-24">
    <div className="max-w-6xl mx-auto">
      <SectionHeader
        eyebrow="Architecture"
        title="Quatre couches, un seul flux"
        description="De l'attaquant au dashboard, chaque couche est isolée, sécurisée, et corrélée automatiquement."
        align="center"
      />

      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="show"
        viewport={viewport}
        className="mt-16 space-y-4"
      >
        {LAYERS.map((layer, i) => {
          const Icon = layer.icon;
          const isLast = i === LAYERS.length - 1;
          return (
            <div key={layer.step}>
              <motion.div
                variants={fadeUp}
                whileHover={{ x: 6, transition: { duration: 0.2 } }}
                className={`group relative p-6 md:p-8 rounded-xl border ${layer.border} bg-slate-100/60 dark:bg-white/[0.03] backdrop-blur-sm transition-all duration-500 hover:shadow-xl hover:${layer.glow} hover:bg-white dark:hover:bg-white/[0.05]`}
              >
                {/* Glow corner accent */}
                <div
                  className="absolute top-0 left-0 right-0 h-px opacity-60 rounded-t-xl"
                  style={{
                    background:
                      i === 0
                        ? "linear-gradient(90deg, #ef4444, transparent)"
                        : i === 1
                        ? "linear-gradient(90deg, #3b82f6, transparent)"
                        : i === 2
                        ? "linear-gradient(90deg, #a855f7, transparent)"
                        : "linear-gradient(90deg, #06b6d4, transparent)",
                  }}
                />
                <div className="flex flex-col md:flex-row md:items-start gap-6">
                  <div className="flex items-center gap-5 md:w-72 shrink-0">
                    <div className="font-cinematic text-5xl text-slate-300/80 dark:text-white/[0.06] group-hover:text-slate-400 dark:group-hover:text-white/[0.12] transition-colors">
                      {layer.step}
                    </div>
                    <div
                      className={`w-14 h-14 rounded-xl border ${layer.border} bg-white/80 dark:bg-black/30 flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110`}
                    >
                      <Icon size={24} className={layer.accent} />
                    </div>
                    <div>
                      <h3 className="font-cinematic text-slate-900 dark:text-white text-xl uppercase tracking-wide">
                        {layer.title}
                      </h3>
                      <p className={`font-mono text-[10px] tracking-[0.25em] uppercase mt-1 ${layer.accent}`}>
                        {layer.subtitle}
                      </p>
                    </div>
                  </div>
                  <div className="md:flex-1 md:border-l md:border-slate-300/60 dark:md:border-white/[0.08] md:pl-8">
                    <p className="text-slate-700 dark:text-gray-300 text-sm md:text-base leading-relaxed mb-4">
                      {layer.desc}
                    </p>
                    <ul className="space-y-1.5">
                      {layer.details.map((d) => (
                        <li
                          key={d}
                          className="flex items-start gap-2 text-xs font-mono text-slate-600 dark:text-gray-500"
                        >
                          <span className={`${layer.accent} mt-0.5`}>›</span>
                          <span>{d}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
              {!isLast && (
                <motion.div variants={fadeUp} className="flex justify-center py-1" aria-hidden>
                  <ArrowDown size={16} className="text-slate-400 dark:text-white/20" />
                </motion.div>
              )}
            </div>
          );
        })}
      </motion.div>
    </div>
  </section>
);
