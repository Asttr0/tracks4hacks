import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { TopBar } from "./TopBar";
import { Sidebar, LARGEUR_REDUITE, LARGEUR_OUVERTE } from "./Sidebar";
import { CommandPalette } from "../common/CommandPalette";
import { useUiStore } from "../../store/useUiStore";
import { useStream } from "../../hooks/useStream";

export default function AppShell() {
  useStream();

  const location = useLocation();
  const sidebarOpen = useUiStore((s) => s.sidebarOpen);
  const margeGauche = sidebarOpen ? LARGEUR_OUVERTE : LARGEUR_REDUITE;
  const openPalette = useUiStore((s) => s.openPalette);
  const closePalette = useUiStore((s) => s.closePalette);
  const paletteOpen = useUiStore((s) => s.paletteOpen);

  //gerer les touches du clavier pour ouvrir la palette de commandes (ctrl+k)
  useEffect(() => {
    //fonction qui gère l'événement de pression de touche.
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        //metakey --> cmd sur mac, ctrl sur windows/linux
        e.preventDefault(); //annule le comportement par défaut du navigateur
        paletteOpen ? closePalette() : openPalette();
      }
    };

    window.addEventListener("keydown", handler); //chaque clique sur clavier appel fct handler
    return () => window.removeEventListener("keydown", handler); // nettoyage de l'evenement dans la memoire
  }, [paletteOpen, openPalette, closePalette]); 

  return (
    <div
      className="min-h-screen text-slate-900 dark:text-white
        [background:radial-gradient(125%_125%_at_50%_10%,#f8fafc_40%,#c2a7a3_100%)]
        dark:[background:radial-gradient(125%_125%_at_50%_10%,#000_40%,#c43b3b_100%)]">
      <Sidebar />
      <div
        style={{
          marginLeft: margeGauche,
          transition: "margin 420ms cubic-bezier(0.32,0.72,0,1)",
        }}>
        <TopBar />
        <main className="min-w-0">
          <div className="mx-auto max-w-[1600px] px-4 py-6 lg:px-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
              >
                <Outlet />
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>
      <CommandPalette />
    </div>
  );
}
