import { NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Globe2,
  GitMerge,
  Grid3x3,
  Play,
  ShieldAlert,
  Gauge,
  ChevronRight,
  ChevronLeft,
  type LucideIcon,
} from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";

const EASE_SOFT = [0.32, 0.72, 0, 1] as const;

interface NavItem {
  to: string;
  label: string;
  icon: LucideIcon;
  end?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { to: "/dashboard", label: "Vue d'ensemble", icon: LayoutDashboard, end: true },
  { to: "/dashboard/map", label: "GeoIP Map", icon: Globe2 },
  { to: "/dashboard/timeline", label: "Timeline", icon: GitMerge },
  { to: "/dashboard/mitre", label: "MITRE ATT&CK", icon: Grid3x3 },
  { to: "/dashboard/replay", label: "Attack Replay", icon: Play },
  { to: "/dashboard/incidents", label: "Incidents", icon: ShieldAlert },
  { to: "/dashboard/coverage", label: "Coverage", icon: Gauge },
];

export const RAIL_WIDTH = 64;
export const DRAWER_WIDTH = 280;

interface SidebarProps {
  open: boolean;
  onToggle: () => void;
}

export const Sidebar = ({ open, onToggle }: SidebarProps) => {
  const { theme } = useTheme();
  const isLight = theme === "light";

  const palette = isLight
    ? {
        drawerBg: "bg-coffee-bean-50",
        drawerBorder: "border-terracotta-clay-700/40",
        drawerText: "text-coffee-bean-900",
        headerBorder: "border-terracotta-clay-700/30",
        kicker: "text-terracotta-clay-700/80",
        titleColor: "#633638",
        titleAccent: "text-coffee-bean-900",
        titleShadow: "0 0 14px rgba(166,89,93,0.45)",
        itemText: "text-coffee-bean-800/85",
        itemActive: "text-coffee-bean-900 bg-terracotta-clay-200/45",
        itemHover: "hover:text-coffee-bean-900 hover:bg-terracotta-clay-200/45",
        accentBar: "bg-terracotta-clay-600",
        accentBarShadow: "0 0 10px rgba(133,71,74,0.85)",
        sweep:
          "bg-gradient-to-r from-transparent via-terracotta-clay-300/40 to-transparent",
        footerBorder: "border-terracotta-clay-700/30",
        footerText: "text-terracotta-clay-700/70",
        toggleBg: "bg-coffee-bean-50",
        toggleBorder: "border-terracotta-clay-700/40",
        toggleText: "text-coffee-bean-900",
      }
    : {
        drawerBg: "bg-pitch-black-950",
        drawerBorder: "border-night-bordeaux-800/50",
        drawerText: "text-coffee-bean-100",
        headerBorder: "border-night-bordeaux-800/50",
        kicker: "text-night-bordeaux-500/80",
        titleColor: "#c43b3b",
        titleAccent: "text-coffee-bean-50",
        titleShadow: "0 0 14px rgba(196,59,59,0.55)",
        itemText: "text-coffee-bean-200/75",
        itemActive: "text-coffee-bean-50 bg-night-bordeaux-900/45",
        itemHover: "hover:text-coffee-bean-50 hover:bg-night-bordeaux-900/45",
        accentBar: "bg-night-bordeaux-500",
        accentBarShadow: "0 0 10px rgba(196,59,59,0.9)",
        sweep:
          "bg-gradient-to-r from-transparent via-night-bordeaux-700/25 to-transparent",
        footerBorder: "border-night-bordeaux-800/50",
        footerText: "text-night-bordeaux-700/80",
        toggleBg: "bg-pitch-black-950",
        toggleBorder: "border-night-bordeaux-800/60",
        toggleText: "text-coffee-bean-100",
      };

  return (
    <motion.aside
      initial={false}
      animate={{ width: open ? DRAWER_WIDTH : RAIL_WIDTH }}
      transition={{ duration: 0.42, ease: EASE_SOFT }}
      className={`fixed top-0 left-0 h-full z-50
        backdrop-blur-xl border-r overflow-visible
        ${palette.drawerBg} ${palette.drawerBorder} ${palette.drawerText}`}
    >
      {/* Toggle chevron */}
      <button
        onClick={onToggle}
        aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
        className={`absolute top-20 -right-3 z-10 w-6 h-6 rounded-full
          flex items-center justify-center border
          transition-transform duration-300
          ${palette.toggleBg} ${palette.toggleBorder} ${palette.toggleText}
          hover:scale-110`}
        style={{ transitionTimingFunction: "cubic-bezier(0.22,0.61,0.36,1)" }}
      >
        <motion.span
          animate={{ rotate: open ? 0 : 180 }}
          transition={{ duration: 0.42, ease: EASE_SOFT }}
          className="inline-flex"
        >
          <ChevronLeft size={14} />
        </motion.span>
      </button>

      {/* Header brand — crossfade between full and abbreviated */}
      <div
        className={`px-4 pt-8 pb-6 border-b ${palette.headerBorder}
          relative flex items-center h-[88px]
          ${open ? "justify-start" : "justify-center"}`}
      >
        <AnimatePresence mode="wait" initial={false}>
          {open ? (
            <motion.h2
              key="brand-full"
              initial={{ opacity: 0, x: -6, filter: "blur(4px)" }}
              animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, x: -4, filter: "blur(2px)" }}
              transition={{ duration: 0.34, ease: EASE_SOFT }}
              className="font-cinematic text-[26px] tracking-[0.04em] whitespace-nowrap text-red-600 select-none"
              style={{ textShadow: "0 0 14px rgba(220,38,38,0.45)" }}
            >
              TRACKS<span className="text-slate-900 dark:text-white">4</span>HACKS
            </motion.h2>
          ) : (
            <motion.span
              key="brand-short"
              initial={{ opacity: 0, scale: 0.85, filter: "blur(4px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 0.9, filter: "blur(2px)" }}
              transition={{ duration: 0.34, ease: EASE_SOFT }}
              className="font-cinematic text-[26px] tracking-[0.04em] text-red-600 select-none"
              style={{ textShadow: "0 0 14px rgba(220,38,38,0.45)" }}
            >
              T<span className="text-slate-900 dark:text-white">4</span>H
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Items */}
      <nav className="px-2 py-4 flex flex-col gap-1 overflow-y-auto overflow-x-hidden h-[calc(100%-180px)]">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              title={!open ? item.label : undefined}
              className={({ isActive }) =>
                `group relative flex items-center gap-4 rounded-lg
                  font-mono text-xs uppercase tracking-[0.2em] overflow-hidden
                  transition-all duration-300
                  ${open ? "px-4 py-3" : "px-0 py-3 justify-center"}
                  ${isActive ? palette.itemActive : `${palette.itemText} ${palette.itemHover}`}`
              }
            >
              {({ isActive }) => (
                <>
                  <span
                    className={`absolute left-0 top-1/2 -translate-y-1/2 w-[2px] rounded-full
                      transition-all duration-300 ${palette.accentBar}
                      ${isActive ? "h-2/3" : "h-0 group-hover:h-2/3"}`}
                    style={{ boxShadow: palette.accentBarShadow }}
                  />
                  <span
                    className={`absolute inset-0 -translate-x-full group-hover:translate-x-full
                      transition-transform duration-700 ease-out pointer-events-none
                      ${palette.sweep}`}
                  />
                  <Icon size={18} strokeWidth={1.5} className="shrink-0" />
                  {open && <span className="relative whitespace-nowrap">{item.label}</span>}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer — fade with brand */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="footer"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.28, ease: EASE_SOFT }}
            className={`absolute bottom-0 left-0 right-0 px-6 py-4 border-t font-mono text-[9px] uppercase tracking-widest
              ${palette.footerBorder} ${palette.footerText}`}
          >
            AUTH: M.T. SLIMANI &amp; ISMAIL
            <br />
            ENSA BERRECHID
          </motion.div>
        )}
      </AnimatePresence>
    </motion.aside>
  );
};
