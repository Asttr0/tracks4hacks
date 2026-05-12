import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Fuse from "fuse.js";
import {
  Search,
  LayoutDashboard,
  Globe2,
  GitMerge,
  Grid3x3,
  Play,
  ShieldAlert,
  Gauge,
  Sun,
  Moon,
  Home,
  ArrowRight,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";
import { useUiStore } from "../../store/useUiStore";

type Group = "Pages" | "Actions";

interface CommandItem {
  id: string;
  label: string;
  description?: string;
  icon: LucideIcon;
  group: Group;
  perform: () => void;
}

export const CommandPalette = () => {
  const navigate = useNavigate();
  const { theme, toggle: toggleTheme } = useTheme();
  const open = useUiStore((s) => s.paletteOpen);
  const onClose = useUiStore((s) => s.closePalette);
  const [query, setQuery] = useState("");
  const [selectedIdx, setSelectedIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const items: CommandItem[] = useMemo(
    () => [
      { id: "home",      label: "Accueil",            description: "Retour à la landing page",   icon: Home,             group: "Pages",   perform: () => { navigate("/"); onClose(); } },
      { id: "overview",  label: "Vue d'ensemble",     description: "Tableau de bord principal",  icon: LayoutDashboard,  group: "Pages",   perform: () => { navigate("/dashboard"); onClose(); } },
      { id: "map",       label: "GeoIP Map",          description: "Carte des sources IP",       icon: Globe2,           group: "Pages",   perform: () => { navigate("/dashboard/map"); onClose(); } },
      { id: "timeline",  label: "Timeline",           description: "Corrélation chronologique",  icon: GitMerge,         group: "Pages",   perform: () => { navigate("/dashboard/timeline"); onClose(); } },
      { id: "mitre",     label: "MITRE ATT&CK",       description: "Heatmap des techniques",     icon: Grid3x3,          group: "Pages",   perform: () => { navigate("/dashboard/mitre"); onClose(); } },
      { id: "replay",    label: "Attack Replay",      description: "Rejouer une campagne Kali",  icon: Play,             group: "Pages",   perform: () => { navigate("/dashboard/replay"); onClose(); } },
      { id: "incidents", label: "Incidents",          description: "Liste des incidents SOC",    icon: ShieldAlert,      group: "Pages",   perform: () => { navigate("/dashboard/incidents"); onClose(); } },
      { id: "coverage",  label: "Coverage Scoreboard",description: "Couverture de détection",    icon: Gauge,            group: "Pages",   perform: () => { navigate("/dashboard/coverage"); onClose(); } },
      {
        id: "theme",
        label: theme === "dark" ? "Passer en mode clair" : "Passer en mode sombre",
        description: "Basculer le thème",
        icon: theme === "dark" ? Sun : Moon,
        group: "Actions",
        perform: () => { toggleTheme(); onClose(); },
      },
    ],
    [navigate, theme, toggleTheme, onClose],
  );

  const fuse = useMemo(
    () => new Fuse(items, { keys: ["label", "description"], threshold: 0.4 }),
    [items],
  );

  const filtered = useMemo(() => {
    if (!query.trim()) return items;
    return fuse.search(query).map((r) => r.item);
  }, [query, fuse, items]);

  const grouped = useMemo(() => {
    const map = new Map<Group, CommandItem[]>();
    for (const item of filtered) {
      const arr = map.get(item.group) ?? [];
      arr.push(item);
      map.set(item.group, arr);
    }
    return Array.from(map.entries());
  }, [filtered]);

  useEffect(() => {
    if (open) {
      setQuery("");
      setSelectedIdx(0);
      const t = setTimeout(() => inputRef.current?.focus(), 50);
      return () => clearTimeout(t);
    }
  }, [open]);

  useEffect(() => {
    setSelectedIdx(0);
  }, [query]);

  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      if (!open) return;
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIdx((i) => Math.min(i + 1, filtered.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIdx((i) => Math.max(i - 1, 0));
      } else if (e.key === "Enter") {
        e.preventDefault();
        filtered[selectedIdx]?.perform();
      }
    },
    [open, filtered, selectedIdx, onClose],
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [handleKey]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={onClose}
            className="fixed inset-0 z-[80] bg-black/70 backdrop-blur-md"
          />
          <div className="pointer-events-none fixed inset-0 z-[81] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: -10 }}
              transition={{ duration: 0.18, ease: [0.4, 0, 0.2, 1] }}
              className="pointer-events-auto w-full max-w-xl overflow-hidden rounded-2xl border border-night-bordeaux-800/40 bg-gradient-to-b from-pitch-black-950/95 to-pitch-black-900/95 shadow-[0_25px_80px_-15px_rgba(196,59,59,0.45)] backdrop-blur-2xl"
            >
              {/* Top accent line */}
              <div className="h-px bg-gradient-to-r from-transparent via-night-bordeaux-500/60 to-transparent" />

              {/* Search input */}
              <div className="flex items-center gap-3 border-b border-white/5 px-5 py-4">
                <Sparkles size={16} className="text-night-bordeaux-400" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Tapez une commande ou recherchez…"
                  className="flex-1 bg-transparent font-mono text-sm text-coffee-bean-50 placeholder:text-coffee-bean-200/40 focus:outline-none"
                />
                <kbd className="rounded border border-white/10 bg-white/5 px-2 py-0.5 font-mono text-[10px] text-coffee-bean-200/60">
                  ESC
                </kbd>
              </div>

              {/* Results */}
              <div className="max-h-[400px] overflow-y-auto p-2">
                {filtered.length === 0 ? (
                  <div className="flex flex-col items-center gap-2 px-4 py-10 text-center">
                    <Search size={20} className="text-coffee-bean-200/30" />
                    <p className="font-mono text-xs text-coffee-bean-200/50">
                      Aucun résultat pour "{query}"
                    </p>
                  </div>
                ) : (
                  grouped.map(([group, groupItems]) => (
                    <div key={group} className="mb-2">
                      <div className="px-3 py-2 font-mono text-[10px] uppercase tracking-[0.3em] text-night-bordeaux-400/70">
                        {group}
                      </div>
                      {groupItems.map((item) => {
                        const globalIdx = filtered.indexOf(item);
                        const isSelected = globalIdx === selectedIdx;
                        const Icon = item.icon;
                        return (
                          <button
                            key={item.id}
                            onClick={() => item.perform()}
                            onMouseEnter={() => setSelectedIdx(globalIdx)}
                            className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-all duration-150 ${
                              isSelected
                                ? "bg-gradient-to-r from-night-bordeaux-800/50 to-night-bordeaux-900/30 text-coffee-bean-50 shadow-[inset_2px_0_0_0_rgba(196,59,59,0.8)]"
                                : "text-coffee-bean-200/80 hover:bg-white/[0.03]"
                            }`}
                          >
                            <div
                              className={`flex size-9 items-center justify-center rounded-md transition-all ${
                                isSelected
                                  ? "bg-night-bordeaux-600/40 text-night-bordeaux-100 shadow-[0_0_12px_rgba(196,59,59,0.4)]"
                                  : "bg-white/[0.04] text-coffee-bean-300"
                              }`}
                            >
                              <Icon size={16} />
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="truncate font-mono text-xs uppercase tracking-wider">
                                {item.label}
                              </div>
                              {item.description && (
                                <div className="truncate text-[10px] text-coffee-bean-200/50">
                                  {item.description}
                                </div>
                              )}
                            </div>
                            <AnimatePresence>
                              {isSelected && (
                                <motion.div
                                  initial={{ opacity: 0, x: -6 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  exit={{ opacity: 0, x: -6 }}
                                  className="text-night-bordeaux-300"
                                >
                                  <ArrowRight size={14} />
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </button>
                        );
                      })}
                    </div>
                  ))
                )}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between border-t border-white/5 bg-black/40 px-5 py-2.5 font-mono text-[10px] text-coffee-bean-200/50">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1.5">
                    <kbd className="rounded border border-white/10 bg-white/5 px-1.5 py-0.5">↑↓</kbd>
                    Naviguer
                  </span>
                  <span className="flex items-center gap-1.5">
                    <kbd className="rounded border border-white/10 bg-white/5 px-1.5 py-0.5">↵</kbd>
                    Sélectionner
                  </span>
                </div>
                <span>
                  Tracks<span className="text-night-bordeaux-400">4</span>Hacks
                </span>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};
