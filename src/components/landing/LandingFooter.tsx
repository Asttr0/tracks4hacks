import { ExternalLink } from "lucide-react";

const RESOURCES = [
  { label: "MITRE ATT&CK", href: "https://attack.mitre.org" },
  { label: "Wazuh Docs", href: "https://documentation.wazuh.com" },
  { label: "Suricata Docs", href: "https://docs.suricata.io" },
];

export const LandingFooter = () => (
  <footer className="relative border-t border-slate-200 dark:border-white/5 bg-white/60 dark:bg-black/40 backdrop-blur-sm">
    <div className="max-w-7xl mx-auto py-12 px-6 lg:px-16 grid grid-cols-1 md:grid-cols-3 gap-8">
      <div>
        <span className="font-cinematic text-red-500 text-base tracking-[0.3em] uppercase">
          Tracks<span className="text-slate-900 dark:text-white">4</span>Hacks
        </span>
        <p className="font-mono text-xs text-slate-600 dark:text-gray-500 mt-3 leading-relaxed">
          Tracer chaque pas du hacker — du terminal de l'attaquant au tableau de bord du défenseur.
        </p>
      </div>

      <div>
        <p className="font-mono text-[10px] text-red-600 dark:text-red-400 tracking-[0.3em] uppercase mb-3">
          Ressources
        </p>
        <ul className="space-y-2">
          {RESOURCES.map((r) => (
            <li key={r.label}>
              <a
                href={r.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 font-mono text-xs text-slate-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
              >
                {r.label}
                <ExternalLink size={11} />
              </a>
            </li>
          ))}
        </ul>
      </div>

      <div className="md:text-right">
        <p className="font-mono text-[10px] text-red-600 dark:text-red-400 tracking-[0.3em] uppercase mb-3">
          Crédits
        </p>
        <p className="font-mono text-xs text-slate-600 dark:text-gray-500 leading-relaxed">
          M.T. Slimani & I. Garnaoui
          <br />
          ENSA Berrechid 2025/2026
          <br />
          Encadré par Pr. Ilhame Ait Lbachir
        </p>
      </div>
    </div>

    <div className="border-t border-slate-200 dark:border-white/5 py-4 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2">
        <span className="font-mono text-[10px] text-slate-400 dark:text-gray-600 tracking-widest uppercase">
          Educational / Non-Commercial
        </span>
        <span className="font-mono text-[10px] text-slate-400 dark:text-gray-600">
          © 2026 Tracks4Hacks
        </span>
      </div>
    </div>
  </footer>
);
