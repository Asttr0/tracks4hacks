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

type Tech = { name: string; role: string; meta?: string };
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
    id: "frontend",
    label: "Frontend & Interface",
    icon: Layout,
    items: [
      {
        name: "React 19",
        role: "Structure le tableau de bord en composants réutilisables pour garantir une navigation instantanée et fluide.",
      },
      {
        name: "TypeScript 5.4",
        role: "Sécurise notre code en typant strictement les données d'attaques pour éviter toute erreur d'exécution.",
      },
      {
        name: "Vite 6",
        role: "Accélère considérablement le temps de développement et optimise le chargement de l'application finale.",
      },
      {
        name: "Tailwind CSS 3",
        role: "Permet de concevoir rapidement une interface sur mesure avec une palette sombre idéale pour la cybersécurité.",
      },
      {
        name: "Zustand",
        role: "Gère l'état global de l'application de manière légère et performante, sans complexifier l'architecture.",
      },
      {
        name: "Recharts",
        role: "Transforme nos données complexes en graphiques lisibles pour comparer l'action offensive et défensive.",
      },
      {
        name: "react-simple-maps",
        role: "Géolocalise les adresses IP sur une carte interactive pour visualiser l'origine physique des menaces.",
      },
      {
        name: "lucide-react",
        role: "Fournit des icônes modernes et optimisées qui rendent notre tableau de bord intuitif sans l'alourdir.",
      },
      {
        name: "Framer Motion",
        role: "Donne vie à la plateforme grâce à des animations fluides qui guident l'œil de l'utilisateur.",
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
        role: "Héberge et déploie automatiquement l'application sur un réseau mondial pour garantir une disponibilité maximale.",
      },
      {
        name: "Netlify Functions",
        role: "Exécute notre logique backend Node.js de manière sécurisée et à la demande, sans avoir à gérer de serveur physique.",
      },
      {
        name: "JWT",
        role: "Assure l'authentification sécurisée et le maintien de nos sessions lors des requêtes vers l'API externe.",
      },
      {
        name: "SSE",
        role: "Pousse les nouvelles alertes en temps réel vers le tableau de bord pour une surveillance réactive et sans latence.",
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
        role: "Garantit la fiabilité de notre logique de corrélation grâce à des tests unitaires rigoureux à chaque étape.",
      },
      {
        name: "GitHub Actions",
        role: "Automatise nos pipelines de tests et de déploiement continu pour assurer une mise en production fluide.",
      },
      {
        name: "GitHub",
        role: "Centralise notre code source et structure efficacement la collaboration et le suivi de nos développements.",
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
                    {item.meta && (
                      <p className="font-mono text-xs text-slate-500 dark:text-gray-500 leading-relaxed mt-2 pl-3 border-l border-slate-300/60 dark:border-white/[0.07]">
                        {item.meta}
                      </p>
                    )}
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
