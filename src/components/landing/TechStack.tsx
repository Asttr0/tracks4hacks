import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Cloud,
  Shield,
  Server,
  Layout,
  Wrench,
  Database,
  Search,
  KeyRound,
  Radio,
  Map,
  Sparkles,
  CalendarDays,
  Network,
  Crosshair,
  type LucideIcon,
} from "lucide-react";
import { SectionHeader } from "./SectionHeader";
import { fadeUp, stagger, viewport } from "./anim";

type Tech = { name: string; role: string; meta: string };
type Category = { id: string; label: string; icon: LucideIcon; items: Tech[] };

/* ─── Logo source map ─────────────────────────────────────── */
type LogoSource =
  | { kind: "cdn"; slug: string; color?: string; alt?: string }
  | { kind: "url"; url: string; alt?: string }
  | { kind: "icon"; icon: LucideIcon; color: string };

const LOGOS: Record<string, LogoSource> = {
  "Microsoft Azure":   { kind: "cdn", slug: "microsoftazure", color: "0078D4" },
  "Debian 12":         { kind: "cdn", slug: "debian", color: "A81D33" },
  "Kali Linux":        { kind: "cdn", slug: "kalilinux", color: "557C94" },
  "Wazuh":             { kind: "icon", icon: Shield, color: "#00A3CF" },
  "Suricata":          { kind: "cdn", slug: "suricata", color: "EF7D1F" },
  "nmap":              { kind: "icon", icon: Network, color: "#4169E1" },
  "hydra":             { kind: "icon", icon: KeyRound, color: "#DC143C" },
  "metasploit":        { kind: "cdn", slug: "metasploit", color: "2596CD" },
  "gobuster":          { kind: "icon", icon: Crosshair, color: "#22C55E" },
  "Netlify":           { kind: "cdn", slug: "netlify", color: "00C7B7" },
  "Netlify Functions": { kind: "cdn", slug: "netlify", color: "00A896" },
  "JWT":               { kind: "cdn", slug: "jsonwebtokens", color: "D63AFF" },
  "SSE":               { kind: "icon", icon: Radio, color: "#F59E0B" },
  "React 19":          { kind: "cdn", slug: "react", color: "61DAFB" },
  "TypeScript 5.4":    { kind: "cdn", slug: "typescript", color: "3178C6" },
  "Vite 6":            { kind: "cdn", slug: "vite", color: "646CFF" },
  "Tailwind CSS 3":    { kind: "cdn", slug: "tailwindcss", color: "06B6D4" },
  "Zustand":           { kind: "icon", icon: Database, color: "#FF7849" },
  "TanStack Query":    { kind: "cdn", slug: "reactquery", color: "FF4154" },
  "Recharts":          { kind: "cdn", slug: "d3dotjs", color: "F9A03C" },
  "Fuse.js":           { kind: "icon", icon: Search, color: "#F59E0B" },
  "react-simple-maps": { kind: "icon", icon: Map, color: "#10B981" },
  "lucide-react":      { kind: "icon", icon: Sparkles, color: "#E11D48" },
  "date-fns":          { kind: "icon", icon: CalendarDays, color: "#770C56" },
  "Framer Motion":     { kind: "cdn", slug: "framer", color: "0055FF" },
  "Vitest":            { kind: "cdn", slug: "vitest", color: "6E9F18" },
  "GitHub":            { kind: "cdn", slug: "github", color: "181717" },
  "GitHub Actions":    { kind: "cdn", slug: "githubactions", color: "2088FF" },
};

/* Logo renderer: <img> with onError fallback to lucide icon */
const ToolLogo = ({ name }: { name: string }) => {
  const src = LOGOS[name];
  const [errored, setErrored] = useState(false);

  // Determine fallback icon + tint
  const FallbackIcon: LucideIcon =
    src && src.kind === "icon" ? src.icon : Shield;
  const fallbackColor =
    src && src.kind === "icon"
      ? src.color
      : src && "color" in src && src.color
      ? `#${src.color}`
      : "#9ca3af";

  if (!src || src.kind === "icon" || errored) {
    return (
      <span
        className="inline-flex items-center justify-center w-9 h-9 rounded-md shrink-0 bg-slate-200/70 dark:bg-white/[0.04] border border-slate-300/60 dark:border-white/[0.06]"
        aria-label={name}
      >
        <FallbackIcon size={18} style={{ color: fallbackColor }} />
      </span>
    );
  }

  const url =
    src.kind === "cdn"
      ? `https://cdn.simpleicons.org/${src.slug}${src.color ? `/${src.color}` : ""}`
      : src.url;

  return (
    <span className="inline-flex items-center justify-center w-9 h-9 shrink-0 p-1">
      <img
        src={url}
        alt={`${name} logo`}
        loading="lazy"
        className="w-full h-full object-contain"
        onError={() => setErrored(true)}
      />
    </span>
  );
};

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
                    ? "border-red-500 bg-red-500/10 text-red-600 dark:text-red-400 shadow-[0_0_20px_rgba(220,38,38,0.2)]"
                    : "border-slate-300/60 dark:border-white/10 bg-slate-100/60 dark:bg-white/[0.02] text-slate-600 dark:text-gray-400 hover:border-slate-400 dark:hover:border-white/20 hover:text-slate-900 dark:hover:text-white"
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
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-3"
          >
            {current.items.map((item, i) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04, duration: 0.35 }}
                whileHover={{ y: -3, scale: 1.005 }}
                className="group relative p-5 rounded-lg border border-slate-300/60 dark:border-white/[0.07] bg-slate-100/60 dark:bg-white/[0.03] hover:border-red-500/40 dark:hover:border-red-500/40 hover:bg-slate-100 dark:hover:bg-white/[0.05] transition-all duration-300"
              >
                {/* Hover glow */}
                <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-red-500/[0.04] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                <div className="relative flex items-start gap-3">
                  <ToolLogo name={item.name} />
                  <div className="flex-1 min-w-0">
                    <span className="font-mono text-sm font-semibold text-slate-900 dark:text-white tracking-wide">
                      {item.name}
                    </span>
                    <p className="text-slate-700 dark:text-gray-300 text-sm leading-relaxed mt-1">
                      {item.role}
                    </p>
                    <p className="font-mono text-xs text-slate-500 dark:text-gray-500 leading-relaxed mt-2 pl-3 border-l border-slate-300/60 dark:border-white/[0.07]">
                      {item.meta}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};
