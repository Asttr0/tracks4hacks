import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom"; //recupere l'url courante pour afficher le titre de la page dans la topbar
import { motion, AnimatePresence } from "framer-motion";
import { Search, Activity, Beaker } from "lucide-react";
import { ThemeToggle } from "../landing/ThemeToggle";
import { useUiStore } from "../../store/useUiStore";

export const TopBar = () => {
  const [time, setTime] = useState(() => new Date()); // heure actuelle
  const location = useLocation(); // url courant
  const demoMode = useUiStore((s) => s.demoMode);
  const toggleDemo = useUiStore((s) => s.toggleDemo);
  const openPalette = useUiStore((s) => s.openPalette);

  let pageLabel: string;

  if (location.pathname === "/dashboard")           pageLabel = "Vue d'ensemble";
  else if (location.pathname === "/dashboard/map")       pageLabel = "GeoIP Map";
  else if (location.pathname === "/dashboard/timeline")  pageLabel = "Timeline";
  else if (location.pathname === "/dashboard/mitre")     pageLabel = "MITRE ATT&CK";
  else if (location.pathname === "/dashboard/replay")    pageLabel = "Attack Replay";
  else if (location.pathname === "/dashboard/incidents") pageLabel = "Incidents";
  else if (location.pathname === "/dashboard/coverage")  pageLabel = "Coverage Scoreboard";
  else                                                   pageLabel = "SOC Console";
  
  //horloge qui se met à jour chaque seconde
  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    /* Animation d'entrée */
    <motion.header
      initial={{ y: -16, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      className="sticky top-0 z-30 grid h-16 grid-cols-[1fr_auto_1fr] items-center gap-4 border-b border-slate-200/60 bg-white/40 px-6 backdrop-blur-xl
        dark:border-night-bordeaux-900/30 dark:bg-black/40"
    >
      {/* une ligne decoratif en haut */}
      <span className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-night-bordeaux-500/40 to-transparent" />

      {/*  COLONNE GAUCHE — icône + titre de page */}
      <div className="flex min-w-0 items-center gap-3">
        <div className="relative flex size-10 shrink-0 items-center justify-center rounded-xl border border-night-bordeaux-700/40 bg-gradient-to-br from-night-bordeaux-900/40 to-pitch-black-950/60 shadow-[inset_0_0_14px_rgba(196,59,59,0.18)]">
          <Activity size={16} className="text-night-bordeaux-500 dark:text-night-bordeaux-300" strokeWidth={2} />
          <motion.span
            animate={{ opacity: [1, 0.4, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -right-0.5 -top-0.5 size-2 rounded-full bg-night-bordeaux-500 shadow-[0_0_8px_rgba(196,59,59,0.95)]"
          />
        </div>
        <div className="hidden min-w-0 md:block">
          <div className="font-mono text-[9px] uppercase tracking-[0.3em] text-slate-500 dark:text-coffee-bean-200/50">
            SOC Console
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={pageLabel}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.22 }}
              className="truncate font-cinematic text-sm uppercase tracking-[0.22em] text-slate-900 dark:text-coffee-bean-50"
            >
              {pageLabel}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* COLONNE CENTRE — bouton recherche */}
      <button
        onClick={openPalette} 
        className="group flex w-[min(560px,80vw)] items-center gap-3 rounded-full border border-slate-300/60 bg-white/60 px-5 py-3 shadow-[0_4px_20px_-8px_rgba(0,0,0,0.15)] transition-all duration-300
          hover:border-night-bordeaux-500/50 hover:bg-night-bordeaux-50/30 hover:shadow-[0_0_30px_-4px_rgba(196,59,59,0.4)]
          focus:outline-none focus:border-night-bordeaux-500/70 focus:bg-night-bordeaux-50/40
          dark:border-white/10 dark:bg-white/[0.03] dark:hover:border-night-bordeaux-500/40 dark:hover:bg-night-bordeaux-500/5
          dark:focus:border-night-bordeaux-500/60 dark:focus:bg-night-bordeaux-500/10"
        aria-label="Open command palette"
      >
        {/* Search icon */}
        <Search
          size={16}
          className="text-slate-500 transition-colors group-hover:text-night-bordeaux-600 dark:text-coffee-bean-200/50 dark:group-hover:text-night-bordeaux-400"
        />
        <span className="flex-1 text-left font-mono text-xs text-slate-500 dark:text-coffee-bean-200/50">
          Rechercher pages, actions, alertes…
        </span>
        
        {/* kbd indique au utilisateur les raccourcis clavier */}
        <kbd className="hidden items-center rounded-md border border-slate-300/70 bg-slate-100/80 px-2 py-0.5 font-mono text-[10px] text-slate-500 dark:border-white/10 dark:bg-white/5 dark:text-coffee-bean-200/60 sm:inline-flex">
          Ctrl+K
        </kbd>
      </button>

      {/* COLONNE DROITE — switch mode + horloge + thème */}
      <div className="flex items-center justify-end gap-3">
        {/* Merged segmented switch */}
        <div
          className="relative hidden h-10 items-center rounded-full border border-slate-300/60 bg-white/50 p-1 shadow-[inset_0_1px_2px_rgba(0,0,0,0.04)] backdrop-blur-md
            dark:border-white/10 dark:bg-black/30 dark:shadow-[inset_0_1px_2px_rgba(0,0,0,0.4)] md:flex"
          role="group"
          aria-label="Mode sélecteur"
        >
          {/* Sliding active indicator */}
          <motion.div
            initial={false}
            animate={{
              x: demoMode ? "100%" : "0%",
              backgroundColor: demoMode
                ? "rgba(196,59,59,0.18)"
                : "rgba(34,197,94,0.18)",
              borderColor: demoMode
                ? "rgba(196,59,59,0.55)"
                : "rgba(34,197,94,0.5)",
              boxShadow: demoMode
                ? "0 0 22px -4px rgba(196,59,59,0.55)"
                : "0 0 22px -4px rgba(34,197,94,0.55)",
            }}
            transition={{ type: "spring", stiffness: 380, damping: 30 }}
            className="absolute left-1 top-1 bottom-1 w-[calc(50%-4px)] rounded-full border"
          />

          {/* LIVE segment */}
          <button
            type="button"
            onClick={() => demoMode && toggleDemo()}
            className="relative z-10 flex h-8 w-[88px] items-center justify-center gap-2 rounded-full font-mono text-[10px] font-semibold uppercase tracking-[0.28em] transition-colors"
            aria-pressed={!demoMode}
          >
            <motion.span
              animate={
                !demoMode
                  ? { scale: [1, 1.45, 1], opacity: [1, 0.5, 1] }
                  : { scale: 1, opacity: 0.5 }
              }
              transition={
                !demoMode
                  ? { duration: 1.8, repeat: Infinity, ease: "easeInOut" }
                  : { duration: 0.25 }
              }
              className={`size-2 rounded-full transition-colors ${
                !demoMode
                  ? "bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.95)]"
                  : "bg-slate-400/60 dark:bg-coffee-bean-200/30"
              }`}
            />
            <span
              className={`transition-colors ${
                !demoMode
                  ? "text-green-700 dark:text-green-300"
                  : "text-slate-500 dark:text-coffee-bean-200/50"
              }`}
            >
              Live
            </span>
          </button>

          {/* DEMO segment */}
          <button
            type="button"
            onClick={() => !demoMode && toggleDemo()}
            className="relative z-10 flex h-8 w-[88px] items-center justify-center gap-2 rounded-full font-mono text-[10px] font-semibold uppercase tracking-[0.28em] transition-colors"
            aria-pressed={demoMode}
          >
            <motion.span
              animate={demoMode ? { rotate: [0, -8, 8, 0] } : { rotate: 0 }}
              transition={
                demoMode
                  ? { duration: 1.6, repeat: Infinity, ease: "easeInOut" }
                  : { duration: 0.25 }
              }
              className="flex items-center"
            >
              <Beaker
                size={12}
                className={`transition-colors ${
                  demoMode
                    ? "text-night-bordeaux-600 dark:text-night-bordeaux-300"
                    : "text-slate-500 dark:text-coffee-bean-200/40"
                }`}
              />
            </motion.span>
            <span
              className={`transition-colors ${
                demoMode
                  ? "text-night-bordeaux-700 dark:text-night-bordeaux-200"
                  : "text-slate-500 dark:text-coffee-bean-200/50"
              }`}
            >
              Demo
            </span>
          </button>
        </div>

        {/* Clock — minimal, separate */}
        <div className="hidden items-center gap-1.5 font-mono text-[11px] text-slate-600 dark:text-coffee-bean-100/70 lg:flex">
          <Activity size={12} className="text-night-bordeaux-600 dark:text-night-bordeaux-400" />
          <span className="tabular-nums">{time.toTimeString().slice(0, 8)}</span>
        </div>

        <ThemeToggle />
      </div>
    </motion.header>
  );
};
