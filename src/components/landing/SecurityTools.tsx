import { motion } from "framer-motion";
import { Database, Network, BookOpen } from "lucide-react";
import { SectionHeader } from "./SectionHeader";
import { fadeUp, stagger, viewport } from "./anim";

const TOOLS = [
  {
    icon: Database,
    label: "SIEM",
    fullName: "Security Information and Event Management",
    analogy: "Un centre de vidéosurveillance intelligent.",
    description:
      "Une plateforme qui centralise tous les journaux d'événements d'un réseau et les analyse automatiquement pour détecter des comportements suspects.",
    detail:
      "Au lieu de caméras, il collecte des logs (tentatives de connexion, modifications de fichiers, trafic réseau…). Au lieu d'un agent qui regarde les écrans, des règles automatiques analysent chaque événement et déclenchent une alarme quand quelque chose correspond à un schéma d'attaque connu.",
    inProject: "Wazuh (open-source) tourne sur la VM Azure et expose une API REST sur le port 55000.",
  },
  {
    icon: Network,
    label: "IDS",
    fullName: "Intrusion Detection System",
    analogy: "Un douanier qui inspecte chaque colis.",
    description:
      "Un analyseur de trafic réseau en temps réel. Il inspecte chaque paquet de données qui transite et le compare à une base de signatures d'attaques connues.",
    detail:
      "L'analogie : un douanier à la frontière qui inspecte chaque colis et le compare à une liste de marchandises interdites. Si un colis correspond, il lève un drapeau.",
    inProject: "Suricata (open-source). Ses alertes sont injectées dans Wazuh — tout converge dans un flux unique.",
  },
  {
    icon: BookOpen,
    label: "MITRE ATT&CK",
    fullName: "Adversarial Tactics, Techniques & Common Knowledge",
    analogy: "L'encyclopédie publique des comportements d'attaquants.",
    description:
      "Catalogue 14 tactiques (le pourquoi : reconnaissance, accès initial, persistance, exfiltration…) et environ 200 techniques (le comment : scan de ports, brute-force, injection SQL…).",
    detail:
      "Chaque technique a un identifiant unique (T1046 pour le scan réseau, T1110 pour le brute-force). Maintenue par MITRE Corporation, organisation à but non lucratif.",
    inProject:
      "Les attaques Red Team ET les alertes Blue Team sont étiquetées avec ces identifiants — c'est ce qui rend la corrélation automatique possible. On parle le même langage des deux côtés.",
  },
];

export const SecurityTools = () => (
  <section id="tools" className="relative py-32 px-6 lg:px-16 xl:px-24">
    <div className="max-w-7xl mx-auto">
      <SectionHeader
        eyebrow="Comprendre les outils"
        title="Les piliers de la détection"
        description="Trois concepts essentiels pour comprendre comment Tracks4Hacks corrèle attaque et défense."
      />

      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="show"
        viewport={viewport}
        className="space-y-5 mt-14"
      >
        {TOOLS.map((tool, i) => {
          const Icon = tool.icon;
          return (
            <motion.div
              key={tool.label}
              variants={fadeUp}
              className="group relative grid grid-cols-1 md:grid-cols-12 gap-6 p-7 md:p-8 rounded-xl border border-slate-200 dark:border-white/5 bg-white dark:bg-white/[0.02] backdrop-blur-sm hover:border-red-500/40 dark:hover:border-red-500/40 transition-all duration-500"
            >
              {/* Number + icon column */}
              <div className="md:col-span-3 flex md:flex-col items-center md:items-start gap-4">
                <div className="w-14 h-14 rounded-xl border border-red-500/30 bg-red-500/5 dark:bg-red-600/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <Icon size={24} className="text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <p className="font-mono text-[10px] text-red-600 dark:text-red-400 tracking-[0.3em] uppercase mb-1">
                    0{i + 1}
                  </p>
                  <h3 className="font-cinematic text-slate-900 dark:text-white text-2xl uppercase tracking-wide">
                    {tool.label}
                  </h3>
                  <p className="font-mono text-[10px] text-slate-500 dark:text-gray-500 mt-1.5 max-w-[180px] leading-relaxed">
                    {tool.fullName}
                  </p>
                </div>
              </div>

              {/* Content column */}
              <div className="md:col-span-9 space-y-4 md:border-l md:border-slate-200 dark:md:border-white/5 md:pl-8">
                <p className="font-cinematic text-lg italic text-red-600 dark:text-red-300/90">
                  « {tool.analogy} »
                </p>
                <p className="text-slate-700 dark:text-gray-300 text-sm md:text-base leading-relaxed">
                  {tool.description}
                </p>
                <p className="text-slate-600 dark:text-gray-400 text-sm leading-relaxed">{tool.detail}</p>
                <div className="pt-3 border-t border-slate-200 dark:border-white/5">
                  <p className="font-mono text-[10px] text-red-600 dark:text-red-400 tracking-[0.25em] uppercase mb-1.5">
                    Dans Tracks4Hacks
                  </p>
                  <p className="text-slate-700 dark:text-gray-300 text-sm leading-relaxed">{tool.inProject}</p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  </section>
);
