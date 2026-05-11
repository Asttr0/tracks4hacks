import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

/**
 *sans lazy loading, on importerait tous les composants en haut du fichier, ce qui ferait que tout le code de l'application serait chargé dès le départ, même les parties qui ne sont pas immédiatement nécessaires. 
 *Avec lazy loading, les composants ne sont chargés que lorsqu'ils sont réellement utilisés, ce qui peut améliorer les performances et réduire le temps de chargement initial de l'application. 
 *
 */
const Landing = lazy(() => import("./pages/Landing"));
const AppShell = lazy(() => import("./components/layout/AppShell"));
const Overview = lazy(() => import("./pages/dashboard/Overview"));
const Map = lazy(() => import("./pages/dashboard/Map"));
const Timeline = lazy(() => import("./pages/dashboard/Timeline"));
const Mitre = lazy(() => import("./pages/dashboard/Mitre"));
const Replay = lazy(() => import("./pages/dashboard/Replay"));
const Incidents = lazy(() => import("./pages/dashboard/Incidents"));
const IncidentDetail = lazy(() => import("./pages/dashboard/IncidentDetail"));
const Coverage = lazy(() => import("./pages/dashboard/Coverage"));

const RouteFallback = () => (
  <div className="flex h-screen w-full items-center justify-center bg-soc-bg">
    <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-red-400">
      Loading…
    </span>
  </div>
);

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<RouteFallback />}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/dashboard" element={<AppShell />}>  //Si l'URL est /dashboard, affiche AppShell
            // AppShell contient le squellette de la page, et les routes enfants définissent le contenu principal
            <Route index element={<Overview />} />
            //c'est la route par défaut du parent. Quand l'URL est exactement /dashboard (sans rien après), c'est Overview  qui est affiché dans l'Outlet
            <Route path="map" element={<Map />} />
            <Route path="timeline" element={<Timeline />} />
            <Route path="mitre" element={<Mitre />} />
            <Route path="replay" element={<Replay />} />
            <Route path="incidents" element={<Incidents />} />
            <Route path="incidents/:id" element={<IncidentDetail />} />
            <Route path="coverage" element={<Coverage />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} /> //rediriger toutes les URLs inconnues vers / 

        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
