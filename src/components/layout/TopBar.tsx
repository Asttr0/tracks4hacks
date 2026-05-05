import { Link } from "react-router-dom";
import { Menu, Search } from "lucide-react";
import { ThemeToggle } from "../landing/ThemeToggle";
import { StatusDot } from "../ui/StatusDot";

interface TopBarProps {
  onToggleSidebar: () => void;
}

export const TopBar = ({ onToggleSidebar }: TopBarProps) => (
  <header className="sticky top-0 z-40 flex h-14 items-center gap-4 border-b border-slate-200 bg-white/80 px-4 backdrop-blur-md dark:border-white/5 dark:bg-soc-panel/80">
    <button
      type="button"
      onClick={onToggleSidebar}
      aria-label="Toggle sidebar"
      className="flex size-9 items-center justify-center rounded-md text-slate-700 hover:bg-slate-100 dark:text-gray-300 dark:hover:bg-white/5"
    >
      <Menu size={18} />
    </button>

    <Link to="/" className="flex items-center gap-2">
      <span className="font-cinematic text-base uppercase tracking-[0.3em] text-red-500">
        Tracks<span className="text-slate-900 dark:text-white">4</span>Hacks
      </span>
      <span className="hidden font-mono text-[10px] tracking-[0.3em] uppercase text-slate-400 dark:text-gray-500 md:inline">
        SOC Console
      </span>
    </Link>

    <div className="ml-4 hidden flex-1 max-w-md md:flex">
      <button
        type="button"
        className="flex w-full items-center gap-2 rounded-md border border-slate-200 bg-slate-50 px-3 py-1.5 text-left font-mono text-xs text-slate-500 hover:border-slate-300 dark:border-white/10 dark:bg-black/30 dark:text-gray-400 dark:hover:border-white/20"
      >
        <Search size={14} />
        <span className="flex-1">Rechercher…</span>
        <kbd className="rounded border border-slate-300 bg-white px-1.5 py-0.5 text-[10px] tracking-widest text-slate-500 dark:border-white/10 dark:bg-white/5 dark:text-gray-400">
          ⌘K
        </kbd>
      </button>
    </div>

    <div className="ml-auto flex items-center gap-3">
      <StatusDot tone="live" label="Live" />
      <ThemeToggle />
    </div>
  </header>
);
