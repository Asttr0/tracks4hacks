import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { TopBar } from "./TopBar";
import { Sidebar, RAIL_WIDTH, DRAWER_WIDTH } from "./Sidebar";
import { CommandPalette } from "../common/CommandPalette";

export default function AppShell() {
  const [open, setOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const offset = open ? DRAWER_WIDTH : RAIL_WIDTH;

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <div
      className="min-h-screen text-slate-900 dark:text-white
        [background:radial-gradient(125%_125%_at_50%_10%,#f8fafc_40%,#c2a7a3_100%)]
        dark:[background:radial-gradient(125%_125%_at_50%_10%,#000_40%,#c43b3b_100%)]"
    >
      <Sidebar open={open} onToggle={() => setOpen((v) => !v)} />
      <div
        style={{ marginLeft: offset }}
        className="transition-[margin] duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]"
      >
        <TopBar onOpenPalette={() => setPaletteOpen(true)} />
        <main className="min-w-0">
          <div className="mx-auto max-w-[1600px] px-4 py-6 lg:px-8">
            <Outlet />
          </div>
        </main>
      </div>
      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />
    </div>
  );
}
