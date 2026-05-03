import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Swords, ShieldCheck, GitMerge, type LucideIcon } from "lucide-react";
import { SectionHeader } from "./SectionHeader";
import { fadeUp, stagger, viewport } from "./anim";

type Team = {
  id: string;
  icon: LucideIcon;
  title: string;
  subtitle: string;
  definition: string;
  goal: string;
  example: string;
  inProject: string;
  bullets: string[];
  // Theme-aware classes (light defaults, dark: variants)
  accent: string;
  border: string;
  borderHover: string;
  bg: string;
  glowDark: string;
};

const TEAMS: Team[] = [
  {
    id: "red",
    icon: Swords,
    title: "Red Team",
    subtitle: "Les Attaquants Éthiques",
    definition:
      "Un groupe de professionnels en sécurité dont le métier est… d'attaquer. Mais pas pour nuire : ils simulent de vraies cyberattaques contre leur propre entreprise pour trouver les failles avant qu'un vrai pirate ne le fasse.",
    goal: "Identifier les vulnérabilités concrètes en reproduisant les techniques qu'utiliserait un cybercriminel.",
    example:
      "Une banque engage une Red Team. Ces experts tentent de s'introduire dans le réseau exactement comme le ferait un hacker : scan de ports, brute-force de mots de passe, exploitation de logiciels non patchés. À la fin, un rapport : « Voici les 12 portes que nous avons réussi à ouvrir. »",
    inProject:
      "L'attaquant utilise Kali Linux. Chaque commande lancée (nmap, hydra, metasploit, gobuster) est enregistrée dans attack-log.json avec son horodatage et sa classification MITRE ATT&CK.",
    bullets: ["Kali Linux — arsenal offensif", "nmap, hydra, metasploit, gobuster", "Logs MITRE ATT&CK temps réel"],
    accent: "text-red-500 dark:text-red-400",
    border: "border-red-500/30 dark:border-red-500/40",
    borderHover: "hover:border-red-500 dark:hover:border-red-400",
    bg: "bg-red-50/50 dark:bg-transparent",
    glowDark: "from-red-500/20 to-transparent",
  },
  {
    id: "blue",
    icon: ShieldCheck,
    title: "Blue Team",
    subtitle: "Les Défenseurs",
    definition:
      "L'équipe qui protège et surveille. Ce sont les gardiens du réseau : ils analysent les journaux d'activité (logs), configurent les systèmes de détection, et réagissent quand quelque chose de suspect se passe.",
    goal: "Détecter, analyser et neutraliser les menaces le plus rapidement possible.",
    example:
      "Reprenons notre banque. Pendant que la Red Team tente de s'introduire, la Blue Team surveille : « Tiens, 500 tentatives de connexion en 10 secondes sur le serveur mail… c'est une attaque par brute-force ! » Ils bloquent l'IP source et lancent une investigation.",
    inProject:
      "Incarnée par Wazuh (le SIEM) qui reçoit tous les logs, les analyse et génère des alertes, et Suricata (l'IDS) qui surveille le trafic réseau en temps réel et détecte les schémas d'attaque connus.",
    bullets: ["Wazuh SIEM — corrélation d'alertes", "Suricata IDS — inspection réseau", "Réponse aux incidents"],
    accent: "text-blue-500 dark:text-blue-400",
    border: "border-blue-500/30 dark:border-blue-500/40",
    borderHover: "hover:border-blue-500 dark:hover:border-blue-400",
    bg: "bg-blue-50/50 dark:bg-transparent",
    glowDark: "from-blue-500/20 to-transparent",
  },
  {
    id: "purple",
    icon: GitMerge,
    title: "Purple Team",
    subtitle: "Le Pont Entre les Deux",
    definition:
      "Pas une troisième équipe séparée. C'est la collaboration active entre la Red Team et la Blue Team. Le nom vient du mélange des couleurs : rouge + bleu = violet (purple).",
    goal: "Mesurer précisément ce que la défense détecte (et ce qu'elle rate) quand l'attaque frappe. Puis améliorer la détection en boucle.",
    example:
      "La Red dit « J'ai lancé un scan à 14h32 ». La Blue vérifie : « Oui, alerte vue à 14h32, 3s de latence. » Parfait. Mais pour l'attaque suivante : « J'ai exfiltré des données à 15h10. » La Blue : « …On n'a rien vu. » C'est un angle mort. Le Purple Teaming sert à les trouver et les combler.",
    inProject:
      "Le moteur de corrélation compare automatiquement chaque attaque Red avec les alertes Blue. Si une attaque a été lancée et qu'une alerte correspondante apparaît dans les 120 secondes (même technique MITRE), c'est une détection réussie. Sinon, c'est un angle mort affiché en rouge vif sur la heatmap.",
    bullets: ["Corrélation automatique en direct", "Fenêtre de détection 120s", "Heatmap des angles morts"],
    accent: "text-purple-500 dark:text-purple-400",
    border: "border-purple-500/30 dark:border-purple-500/40",
    borderHover: "hover:border-purple-500 dark:hover:border-purple-400",
    bg: "bg-purple-50/50 dark:bg-transparent",
    glowDark: "from-purple-500/20 to-transparent",
  },
];

export const TeamConcepts = () => {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <section id="concepts" className="relative py-32 px-6 lg:px-16 xl:px-24">
      <div className="max-w-7xl mx-auto">
        <SectionHeader
          eyebrow="Concepts Clés"
          title="Red. Blue. Purple."
          description="Trois rôles fondamentaux de la cybersécurité. Cliquez sur une carte pour découvrir un exemple concret et son rôle exact dans Tracks4Hacks."
          align="center"
        />

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={viewport}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-16"
        >
          {TEAMS.map((team) => {
            const Icon = team.icon;
            const isOpen = expanded === team.id;
            return (
              <motion.div
                key={team.id}
                variants={fadeUp}
                whileHover={{ y: isOpen ? 0 : -6, transition: { duration: 0.25 } }}
                onClick={() => setExpanded(isOpen ? null : team.id)}
                className={`group relative rounded-2xl border bg-white dark:bg-gradient-to-b dark:from-white/[0.04] dark:to-transparent p-8 backdrop-blur-sm transition-all duration-500 cursor-pointer ${team.border} ${team.borderHover} ${team.bg}`}
              >
                <div
                  className={`absolute inset-0 rounded-2xl bg-gradient-to-b dark:${team.glowDark} opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`}
                />
                <div className="relative">
                  <div
                    className={`w-14 h-14 rounded-xl border ${team.border} bg-white dark:bg-black/40 flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110`}
                  >
                    <Icon size={26} className={team.accent} />
                  </div>
                  <p className={`font-mono text-[10px] tracking-[0.3em] uppercase mb-2 ${team.accent}`}>
                    {team.subtitle}
                  </p>
                  <h3 className="font-cinematic text-slate-900 dark:text-white text-2xl uppercase tracking-wide mb-4">
                    {team.title}
                  </h3>

                  {/* Definition (always visible) */}
                  <p className="text-slate-600 dark:text-gray-400 text-sm leading-relaxed mb-4">
                    {team.definition}
                  </p>

                  {/* Goal */}
                  <div className="mb-5 pt-4 border-t border-slate-200 dark:border-white/5">
                    <p className={`font-mono text-[10px] tracking-[0.25em] uppercase mb-2 ${team.accent}`}>
                      Objectif
                    </p>
                    <p className="text-slate-700 dark:text-gray-300 text-sm leading-relaxed">{team.goal}</p>
                  </div>

                  {/* Expandable details */}
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.35 }}
                        className="overflow-hidden"
                      >
                        <div className="pt-4 border-t border-slate-200 dark:border-white/5 mb-4">
                          <p className={`font-mono text-[10px] tracking-[0.25em] uppercase mb-2 ${team.accent}`}>
                            Exemple concret
                          </p>
                          <p className="text-slate-700 dark:text-gray-300 text-xs leading-relaxed italic">
                            {team.example}
                          </p>
                        </div>
                        <div className="pt-4 border-t border-slate-200 dark:border-white/5 mb-4">
                          <p className={`font-mono text-[10px] tracking-[0.25em] uppercase mb-2 ${team.accent}`}>
                            Dans Tracks4Hacks
                          </p>
                          <p className="text-slate-700 dark:text-gray-300 text-xs leading-relaxed">
                            {team.inProject}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <ul className="space-y-2 pt-4 border-t border-slate-200 dark:border-white/5">
                    {team.bullets.map((b) => (
                      <li
                        key={b}
                        className="flex items-start gap-2 text-xs text-slate-600 dark:text-gray-300 font-mono"
                      >
                        <span className={`${team.accent} mt-0.5`}>›</span>
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>

                  <p className={`mt-5 text-[10px] font-mono tracking-widest uppercase ${team.accent} opacity-70`}>
                    {isOpen ? "↑ Réduire" : "↓ Voir l'exemple"}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};
