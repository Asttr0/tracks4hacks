import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  LayoutDashboard,
  Globe2,
  GitMerge,
  Grid3x3,
  ShieldAlert,
  Gauge,
  Home,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { useUiStore } from "../../store/useUiStore";

interface CommandItem {
  id: string;
  label: string;
  description?: string;
  icon: LucideIcon;
  performOnClick: () => void;
}

export const CommandPalette = () => {
  const navigate = useNavigate();
  const open = useUiStore((s) => s.paletteOpen);
  const onClose = useUiStore((s) => s.closePalette);
  const [query, setQuery] = useState("");

  const items: CommandItem[] = [
    { id: "home",      label: "Accueil",             description: "Retour à la landing page",  icon: Home,            performOnClick: () => { navigate("/"); onClose(); } }, 
    { id: "overview",  label: "Vue d'ensemble",      description: "Tableau de bord principal", icon: LayoutDashboard, performOnClick: () => { navigate("/dashboard"); onClose(); } },
    { id: "map",       label: "GeoIP Map",           description: "Carte des sources IP",      icon: Globe2,          performOnClick: () => { navigate("/dashboard/map"); onClose(); } },
    { id: "timeline",  label: "Timeline",            description: "Corrélation chronologique", icon: GitMerge,        performOnClick: () => { navigate("/dashboard/timeline"); onClose(); } },
    { id: "mitre",     label: "MITRE ATT&CK",        description: "Heatmap des techniques",    icon: Grid3x3,         performOnClick: () => { navigate("/dashboard/mitre"); onClose(); } },
    { id: "incidents", label: "Incidents",           description: "Liste des incidents SOC",   icon: ShieldAlert,     performOnClick: () => { navigate("/dashboard/incidents"); onClose(); } },
    { id: "coverage",  label: "Coverage Scoreboard", description: "Couverture de détection",   icon: Gauge,           performOnClick: () => { navigate("/dashboard/coverage"); onClose(); } },
  ];

  const filtered = query.trim()
    ? items.filter((i) => i.label.toLowerCase().includes(query.toLowerCase()))
    : items;

  useEffect(() => {
    if (open) setQuery("");
  }, [open]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (!open) return;
      if (e.key === "Escape") { e.preventDefault(); onClose(); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

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
              <div className="h-px bg-gradient-to-r from-transparent via-night-bordeaux-500/60 to-transparent" />

              <div className="flex items-center gap-3 border-b border-white/5 px-5 py-4">
                <Sparkles size={16} className="text-night-bordeaux-400" />
                <input
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

              <div className="max-h-[400px] overflow-y-auto p-2">
                {filtered.length === 0 ? (
                  <div className="flex flex-col items-center gap-2 px-4 py-10 text-center">
                    <Search size={20} className="text-coffee-bean-200/30" />
                    <p className="font-mono text-xs text-coffee-bean-200/50">
                      Aucun résultat pour "{query}"
                    </p>
                  </div>
                ) : (
                  filtered.map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.id}
                        onClick={() => item.performOnClick()}
                        className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-coffee-bean-200/80 transition-all duration-150 hover:bg-white/[0.03]"
                      >
                        <div className="flex size-9 items-center justify-center rounded-md bg-white/[0.04] text-coffee-bean-300">
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
                      </button>
                    );
                  })
                )}
              </div>

              <div className="flex items-center justify-end border-t border-white/5 bg-black/40 px-5 py-2.5 font-mono text-[10px] text-coffee-bean-200/50">
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
