import { useState } from "react";
import { Outlet } from "react-router-dom";
import { TopBar } from "./TopBar";
import { Sidebar } from "./Sidebar";

export default function AppShell() {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-soc-bg dark:text-white">
      <TopBar onToggleSidebar={() => setCollapsed((c) => !c)} />
      <div className="flex">
        <Sidebar collapsed={collapsed} />
        <main className="min-w-0 flex-1">
          <div className="mx-auto max-w-[1600px] px-4 py-6 lg:px-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
