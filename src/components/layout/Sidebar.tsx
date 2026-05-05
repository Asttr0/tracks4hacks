import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Globe2,
  GitMerge,
  Grid3x3,
  Play,
  ShieldAlert,
  Gauge,
  type LucideIcon,
} from "lucide-react";
import { clsx } from "../../lib/clsx";

interface NavItem {
  to: string;
  label: string;
  icon: LucideIcon;
  end?: boolean;
}

const items: NavItem[] = [
  { to: "/dashboard", label: "Vue d'ensemble", icon: LayoutDashboard, end: true },
  { to: "/dashboard/map", label: "GeoIP Map", icon: Globe2 },
  { to: "/dashboard/timeline", label: "Timeline", icon: GitMerge },
  { to: "/dashboard/mitre", label: "MITRE ATT&CK", icon: Grid3x3 },
  { to: "/dashboard/replay", label: "Attack Replay", icon: Play },
  { to: "/dashboard/incidents", label: "Incidents", icon: ShieldAlert },
  { to: "/dashboard/coverage", label: "Coverage", icon: Gauge },
];

interface SidebarProps {
  collapsed: boolean;
}

export const Sidebar = ({ collapsed }: SidebarProps) => (
  <aside
    className={clsx(
      "sticky top-14 hidden h-[calc(100vh-3.5rem)] flex-col border-r border-slate-200 bg-white/80 backdrop-blur-sm transition-[width] duration-200 dark:border-white/5 dark:bg-soc-panel/60 md:flex",
      collapsed ? "w-16" : "w-60",
    )}
  >
    <nav className="flex-1 space-y-1 px-2 py-4">
      {items.map(({ to, label, icon: Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          className={({ isActive }) =>
            clsx(
              "group relative flex items-center gap-3 rounded-md px-3 py-2 font-mono text-[11px] tracking-[0.2em] uppercase transition-colors",
              isActive
                ? "bg-red-500/10 text-red-600 dark:text-red-300"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-white",
            )
          }
        >
          {({ isActive }) => (
            <>
              <span
                className={clsx(
                  "absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-r bg-red-500 transition-opacity",
                  isActive ? "opacity-100" : "opacity-0",
                )}
              />
              <Icon size={16} className="shrink-0" />
              {!collapsed && <span className="truncate">{label}</span>}
            </>
          )}
        </NavLink>
      ))}
    </nav>

    {!collapsed && (
      <div className="border-t border-slate-200 px-4 py-4 dark:border-white/5">
        <p className="font-mono text-[9px] tracking-[0.3em] uppercase text-slate-400 dark:text-gray-500">
          Tracks<span className="text-red-500">4</span>Hacks · v0.1
        </p>
      </div>
    )}
  </aside>
);
