import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cloud, Shield, Server, Layout, Wrench } from "lucide-react";
import { SectionHeader } from "./SectionHeader";
import { fadeUp, stagger, viewport } from "./anim";

type Tech = { name: string; role: string; meta: string };
type Category = { id: string; label: string; icon: typeof Cloud; items: Tech[] };

const CATEGORIES: Category[] = [
  {
    id: "cloud",
    label: "Cloud & Infra",
    icon: Cloud,
    items: [
      {
        name: "Microsoft Azure",
        role: "Fournisseur de cloud computing (VMs, stockage, réseau)",
        meta: "Héberge la VM Debian (Wazuh + Suricata). B2ls_v2 — 2 vCPU, 4 Go RAM, Sweden Central. Financé par Azure for Students.",
      },
      {
        name: "Debian 12",
        role: "Distribution Linux stable, standard pour les serveurs",
        meta: "Système d'exploitation de la VM Azure. Supporte Wazuh Manager et Suricata.",
      },
      {
        name: "Kali Linux",
        role: "Distribution Linux spécialisée en tests d'intrusion",
        meta: "Poste local de l'attaquant. Lance les campagnes (nmap, hydra, metasploit, gobuster) contre la VM Azure.",
      },
    ],
  },
  {
    id: "security",
    label: "Sécurité & Détection",
    icon: Shield,
    items: [
      {
        name: "Wazuh",
        role: "SIEM open-source — centralisation et analyse des logs",
        meta: "Cœur de la Blue Team. Reçoit les événements, applique les règles de détection, étiquette MITRE ATT&CK. API REST :55000.",
      },
      {
        name: "Suricata",
        role: "IDS open-source — inspection du trafic réseau temps réel",
        meta: "Surveille les paquets sur la VM. Alertes intégrées dans le flux Wazuh.",
      },
      {
        name: "nmap",
        role: "Scanner de ports et de services réseau",
        meta: "Cartographie les ports ouverts de la cible — MITRE T1046.",
      },
      {
        name: "hydra",
        role: "Outil de brute-force de mots de passe",
        meta: "Teste des combinaisons de mots de passe — MITRE T1110.",
      },
      {
        name: "metasploit",
        role: "Framework d'exploitation de vulnérabilités",
        meta: "Exploite des failles logicielles identifiées — MITRE T1190.",
      },
      {
        name: "gobuster",
        role: "Scanner de répertoires et sous-domaines web",
        meta: "Brute-force des chemins URL — MITRE T1595.",
      },
    ],
  },
  {
    id: "backend",
    label: "Backend & Hébergement",
    icon: Server,
    items: [
      {
        name: "Netlify",
        role: "Plateforme d'hébergement moderne (CDN + serverless)",
        meta: "Sert le bundle React via CDN mondial. Déploiement auto depuis GitHub.",
      },
      {
        name: "Netlify Functions",
        role: "Backend serverless — fonctions Node.js à la demande",
        meta: "4 fonctions : proxy alertes Wazuh, cache JWT, streaming SSE, déclencheur replay. Credentials côté serveur uniquement.",
      },
      {
        name: "JWT",
        role: "Standard d'authentification par jeton signé",
        meta: "Authentifie les requêtes vers l'API Wazuh. Cache 14 minutes, auto-rafraîchi avant expiration.",
      },
      {
        name: "SSE",
        role: "Server-Sent Events — streaming HTTP unidirectionnel",
        meta: "Pousse les nouvelles alertes Wazuh vers le dashboard toutes les 5 secondes, sans polling.",
      },
    ],
  },
  {
    id: "frontend",
    label: "Frontend & Interface",
    icon: Layout,
    items: [
      {
        name: "React 19",
        role: "Bibliothèque UI (créée par Meta)",
        meta: "Structure le dashboard en composants réutilisables. SPA — navigation instantanée.",
      },
      {
        name: "TypeScript 5.4",
        role: "JavaScript typé — détecte les erreurs avant exécution",
        meta: "Mode strict activé. Interfaces typées pour alertes, attaques, tactiques MITRE. Zéro erreur de compilation.",
      },
      {
        name: "Vite 6",
        role: "Build frontend ultra-rapide + bundler de production",
        meta: "Rechargement instantané en dev. Build minifié et tree-shaké en ~10 fichiers optimisés.",
      },
      {
        name: "Tailwind CSS 3",
        role: "Framework CSS utility-first",
        meta: "Stylisation directement dans le HTML. Palette sombre adaptée aux dashboards SOC.",
      },
      {
        name: "Zustand",
        role: "Gestion d'état global (alternative légère à Redux)",
        meta: "Stores : useUiStore (mode démo, vue, alerte), useLogStore (logs d'attaque). Sans prop drilling.",
      },
      {
        name: "TanStack Query",
        role: "Gestionnaire d'état serveur — fetch, cache, retry",
        meta: "Interroge /api/wazuh-alerts toutes les 10s hors démo. Loading, errors, cache transparents.",
      },
      {
        name: "Recharts",
        role: "Bibliothèque de graphiques React (basée sur D3)",
        meta: "Génère la Timeline Red/Blue (double axe + zones ombrées) et le Coverage Scoreboard.",
      },
      {
        name: "Fuse.js",
        role: "Moteur de recherche floue côté client",
        meta: "Alimente la Command Palette (Cmd+K). Trouve les vues même avec des fautes de frappe.",
      },
      {
        name: "react-simple-maps",
        role: "Bibliothèque de cartes géographiques React",
        meta: "Carte du monde avec IPs source des attaquants, dimensionnées par volume d'alertes.",
      },
      {
        name: "lucide-react",
        role: "Icônes SVG optimisées et tree-shakeable",
        meta: "Icônes du dashboard. Seules les icônes importées finissent dans le bundle.",
      },
      {
        name: "date-fns",
        role: "Manipulation de dates (alternative légère à Moment.js)",
        meta: "Formate les horodatages, calcule les écarts attaque/alerte pour la corrélation.",
      },
      {
        name: "Framer Motion",
        role: "Bibliothèque d'animations React déclaratives",
        meta: "Anime les cartes, transitions, scroll-reveal et toute la landing page.",
      },
    ],
  },
  {
    id: "devops",
    label: "Qualité & DevOps",
    icon: Wrench,
    items: [
      {
        name: "Vitest",
        role: "Test runner unitaire optimisé pour Vite",
        meta: "Teste correlator.ts, coverage.ts. >80% couverture. Vérifie la fenêtre de corrélation 120s.",
      },
      {
        name: "GitHub",
        role: "Plateforme d'hébergement de code basée sur Git",
        meta: "Stocke le dépôt, suit les issues et discussions entre développeurs.",
      },
      {
        name: "GitHub Actions",
        role: "Pipeline CI/CD — tests automatisés et déploiement continu",
        meta: "Sur chaque push : types TS + tests Vitest. Sur main : déploiement Netlify auto.",
      },
    ],
  },
];

export const TechStack = () => {
  const [active, setActive] = useState(CATEGORIES[0]!.id);
  const current = CATEGORIES.find((c) => c.id === active) ?? CATEGORIES[0]!;

  return (
    <section id="tech" className="relative py-32 px-6 lg:px-16 xl:px-24">
      <div className="max-w-7xl mx-auto">
        <SectionHeader
          eyebrow="Stack Technique"
          title="Outils & Technologies"
          description="Une stack moderne couvrant l'infrastructure cloud, la sécurité, le backend serverless, le frontend réactif et l'intégration continue."
        />

        {/* Tabs */}
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={viewport}
          className="flex flex-wrap gap-2 mt-12 mb-10"
        >
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isActive = cat.id === active;
            return (
              <motion.button
                key={cat.id}
                variants={fadeUp}
                onClick={() => setActive(cat.id)}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.97 }}
                className={`flex items-center gap-2 px-5 py-3 rounded-lg border font-mono text-xs uppercase tracking-widest transition-all ${
                  isActive
                    ? "border-red-500 bg-red-500/10 text-red-600 dark:text-red-300 shadow-[0_0_20px_rgba(220,38,38,0.2)]"
                    : "border-slate-200 dark:border-white/10 bg-white dark:bg-white/[0.02] text-slate-600 dark:text-gray-400 hover:border-slate-400 dark:hover:border-white/30 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <Icon size={14} />
                {cat.label}
              </motion.button>
            );
          })}
        </motion.div>

        {/* Items grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.35 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-3"
          >
            {current.items.map((item, i) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04, duration: 0.4 }}
                whileHover={{ y: -3, scale: 1.005 }}
                className="group relative p-5 rounded-lg border border-slate-200 dark:border-white/5 bg-white dark:bg-white/[0.02] hover:border-red-500/50 dark:hover:border-red-500/40 hover:bg-red-50/40 dark:hover:bg-red-500/[0.03] transition-all duration-300"
              >
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-red-500 font-mono text-sm opacity-50 group-hover:opacity-100 transition-opacity">
                    ›
                  </span>
                  <span className="font-mono text-sm font-semibold text-slate-900 dark:text-white tracking-wide">
                    {item.name}
                  </span>
                </div>
                <p className="text-slate-700 dark:text-gray-300 text-sm leading-relaxed mb-2 pl-4">
                  {item.role}
                </p>
                <p className="font-mono text-xs text-slate-500 dark:text-gray-500 leading-relaxed pl-4 border-l border-slate-200 dark:border-white/5 ml-0">
                  {item.meta}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};
