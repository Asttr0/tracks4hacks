import { motion } from "framer-motion";
import { Lock, Key, ShieldOff, Network, Ban, FileWarning, FolderLock } from "lucide-react";
import { SectionHeader } from "./SectionHeader";
import { fadeUp, stagger, viewport } from "./anim";

const PRACTICES = [
  {
    icon: Lock,
    title: "Séparation client / serveur",
    desc: "Aucun identifiant dans le code React. Les credentials Wazuh vivent exclusivement dans les variables d'environnement Netlify, accessibles uniquement par les fonctions BFF.",
  },
  {
    icon: Key,
    title: "Gestion des tokens JWT",
    desc: "Les JWT sont mis en cache 14 minutes et rafraîchis automatiquement avant expiration.",
  },
  {
    icon: ShieldOff,
    title: "Endpoint protégé",
    desc: "/api/attack-replay exige un header x-replay-secret pour éviter tout déclenchement non autorisé.",
  },
  {
    icon: Network,
    title: "Pare-feu Azure (NSG)",
    desc: "Seuls les ports 22 (SSH), 443 (HTTPS) et 55000 (API Wazuh) sont ouverts.",
  },
  {
    icon: Ban,
    title: "fail2ban actif",
    desc: "Bannit automatiquement les IPs qui échouent 3 tentatives SSH consécutives.",
  },
  {
    icon: FileWarning,
    title: "TLS partout",
    desc: "HTTPS sur Netlify (certificat automatique) et sur l'API Wazuh.",
  },
  {
    icon: FolderLock,
    title: "Secrets protégés",
    desc: "Le fichier .env est dans le .gitignore — aucun secret ne transite par le dépôt.",
  },
];

export const SecurityPosture = () => (
  <section id="security" className="relative py-32 px-6 lg:px-16 xl:px-24">
    <div className="max-w-7xl mx-auto">
      <SectionHeader
        eyebrow="Posture Sécurité"
        title="Hardened by design"
        description="Le projet applique les bonnes pratiques de sécurité à chaque niveau — du frontend au pare-feu Azure."
      />

      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="show"
        viewport={viewport}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-14"
      >
        {PRACTICES.map((p) => {
          const Icon = p.icon;
          return (
            <motion.div
              key={p.title}
              variants={fadeUp}
              whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
              className="group flex items-start gap-4 p-5 rounded-lg border border-slate-200 dark:border-white/5 bg-white dark:bg-white/[0.02] hover:border-emerald-500/40 hover:bg-emerald-50/30 dark:hover:bg-emerald-500/[0.03] transition-all"
            >
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shrink-0 group-hover:bg-emerald-500/20 transition-colors">
                <Icon size={18} className="text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <h4 className="font-mono text-sm text-slate-900 dark:text-white tracking-wide">{p.title}</h4>
                <p className="text-slate-600 dark:text-gray-400 text-xs leading-relaxed mt-1">{p.desc}</p>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  </section>
);
