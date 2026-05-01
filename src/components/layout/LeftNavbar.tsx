import { useState } from "react";
import {
  Menu,
  X,
  Home,
  Terminal,
  Shield,
  Activity,
  Database,
  GitBranch,
  Settings,
  Mail,
} from "lucide-react";

type NavItem = {
  label: string;
  icon: React.ComponentType<{ size?: number; strokeWidth?: number }>;
  href?: string;
};

const NAV_ITEMS: NavItem[] = [
  { label: "Accueil", icon: Home, href: "#home" },
  { label: "Terminal", icon: Terminal, href: "#terminal" },
  { label: "Dashboard", icon: Shield, href: "#dashboard" },
  { label: "Corrélation", icon: Activity, href: "#correlation" },
  { label: "MITRE ATT&CK", icon: GitBranch, href: "#mitre" },
  { label: "Logs SIEM", icon: Database, href: "#siem" },
  { label: "Paramètres", icon: Settings, href: "#settings" },
  { label: "Contact", icon: Mail, href: "#contact" },
];

export function LeftNavbar({ theme }: { theme: "dark" | "light" }) {
  const [open, setOpen] = useState(false);
  const isLight = theme === "light";

  // Palette appliquée selon le thème
  const palette = isLight
    ? {
        toggleBg: "bg-coffee-bean-50/60",
        toggleBorder: "border-terracotta-clay-600/50",
        toggleText: "text-coffee-bean-900",
        toggleHover:
          "hover:bg-coffee-bean-100/80 hover:shadow-[0_0_22px_rgba(166,89,93,0.45)]",
        backdrop: "bg-coffee-bean-900/15",
        drawerBg: "bg-coffee-bean-50/65",
        drawerBorder: "border-terracotta-clay-700/40",
        drawerText: "text-coffee-bean-900",
        headerBorder: "border-terracotta-clay-700/30",
        kicker: "text-terracotta-clay-700/80",
        titleColor: "#633638",
        titleAccent: "text-coffee-bean-900",
        titleShadow: "0 0 14px rgba(166,89,93,0.45)",
        itemText: "text-coffee-bean-800/85",
        itemHover:
          "hover:text-coffee-bean-900 hover:bg-terracotta-clay-200/45",
        accentBar: "bg-terracotta-clay-600",
        accentBarShadow: "0 0 10px rgba(133,71,74,0.85)",
        sweep:
          "bg-gradient-to-r from-transparent via-terracotta-clay-300/40 to-transparent",
        footerBorder: "border-terracotta-clay-700/30",
        footerText: "text-terracotta-clay-700/70",
        drawerShadow: "-22px 0 60px -10px rgba(133, 71, 74, 0.30)",
      }
    : {
        toggleBg: "bg-pitch-black-950/55",
        toggleBorder: "border-night-bordeaux-700/55",
        toggleText: "text-night-bordeaux-300",
        toggleHover:
          "hover:border-night-bordeaux-500 hover:shadow-[0_0_22px_rgba(196,59,59,0.55)]",
        backdrop: "bg-pitch-black-950/55",
        drawerBg: "bg-pitch-black-950/70",
        drawerBorder: "border-night-bordeaux-800/50",
        drawerText: "text-coffee-bean-100",
        headerBorder: "border-night-bordeaux-800/50",
        kicker: "text-night-bordeaux-500/80",
        titleColor: "#c43b3b",
        titleAccent: "text-coffee-bean-50",
        titleShadow: "0 0 14px rgba(196,59,59,0.55)",
        itemText: "text-coffee-bean-200/75",
        itemHover:
          "hover:text-coffee-bean-50 hover:bg-night-bordeaux-900/45",
        accentBar: "bg-night-bordeaux-500",
        accentBarShadow: "0 0 10px rgba(196,59,59,0.9)",
        sweep:
          "bg-gradient-to-r from-transparent via-night-bordeaux-700/25 to-transparent",
        footerBorder: "border-night-bordeaux-800/50",
        footerText: "text-night-bordeaux-700/80",
        drawerShadow: "22px 0 60px -10px rgba(196, 59, 59, 0.30)",
      };

  return (
    <>
      {/* Toggle (toujours visible, en haut à gauche) */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
        className={`fixed top-4 left-4 z-[60] w-11 h-11 rounded-full flex items-center justify-center
          backdrop-blur-md border transition-all duration-500
          ${palette.toggleBg} ${palette.toggleBorder} ${palette.toggleText} ${palette.toggleHover}
          ${open ? "rotate-90" : "rotate-0"}`}
      >
        {open ? <X size={18} /> : <Menu size={18} />}
      </button>

      {/* Backdrop flou */}
      <div
        onClick={() => setOpen(false)}
        className={`fixed inset-0 z-40 backdrop-blur-sm transition-opacity duration-500
          ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}
          ${palette.backdrop}`}
      />

      {/* Drawer (gauche) */}
      <aside
        className={`fixed top-0 left-0 h-full z-50 w-[280px] sm:w-[320px]
          backdrop-blur-xl border-r transition-transform duration-700 ease-[cubic-bezier(0.4,0,0.2,1)]
          ${open ? "translate-x-0" : "-translate-x-full"}
          ${palette.drawerBg} ${palette.drawerBorder} ${palette.drawerText}`}
        style={{ boxShadow: palette.drawerShadow }}
      >
        {/* Bandeau supérieur */}
        <div className={`px-6 pt-8 pb-6 border-b ${palette.headerBorder}`}>
          <div
            className={`text-[10px] tracking-[0.3em] uppercase font-mono mb-2 ${palette.kicker}`}
          >
            // Navigation
          </div>
          <h2
            className="text-2xl font-cinematic uppercase tracking-wider"
            style={{
              color: palette.titleColor,
              textShadow: palette.titleShadow,
            }}
          >
            Tracks
            <span className={palette.titleAccent}>4</span>
            Hacks
          </h2>
        </div>

        {/* Items */}
        <nav className="px-3 py-4 flex flex-col gap-1 overflow-y-auto h-[calc(100%-180px)]">
          {NAV_ITEMS.map((item, idx) => {
            const Icon = item.icon;
            return (
              <a
                key={item.label}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`group relative flex items-center gap-4 px-4 py-3 rounded-lg
                  font-mono text-xs uppercase tracking-[0.2em] overflow-hidden
                  transition-all duration-300
                  ${palette.itemText} ${palette.itemHover}`}
                style={{
                  transitionDelay: open ? `${idx * 40 + 200}ms` : "0ms",
                  transform: open ? "translateX(0)" : "translateX(-40px)",
                  opacity: open ? 1 : 0,
                  transitionProperty:
                    "transform, opacity, color, background-color",
                }}
              >
                {/* Indicateur lumineux gauche */}
                <span
                  className={`absolute left-0 top-1/2 -translate-y-1/2 w-[2px] h-0 rounded-full
                    transition-all duration-300 group-hover:h-2/3 ${palette.accentBar}`}
                  style={{ boxShadow: palette.accentBarShadow }}
                />
                {/* Sweep effect */}
                <span
                  className={`absolute inset-0 -translate-x-full group-hover:translate-x-full
                    transition-transform duration-700 ease-out pointer-events-none
                    ${palette.sweep}`}
                />
                <Icon size={16} strokeWidth={1.5} />
                <span className="relative">{item.label}</span>
              </a>
            );
          })}
        </nav>

        {/* Footer */}
        <div
          className={`absolute bottom-0 left-0 right-0 px-6 py-4 border-t font-mono text-[9px] uppercase tracking-widest
            ${palette.footerBorder} ${palette.footerText}`}
        >
          AUTH: M.T. SLIMANI & ISMAIL
          <br />
          ENSA BERRECHID
        </div>
      </aside>
    </>
  );
}
