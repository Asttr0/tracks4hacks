import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { viewport } from "./anim";

/* ─────────────────────────────────────────────────────────
   Architecture diagram — wide horizontal SVG (2400 × 1300)
   All logos rendered INSIDE the SVG via <image> elements
   so they scale exactly with the diagram. No overlay divs.
   Arrow paths are anchored to box edges and routed through
   inter-system gaps so they never cross unrelated cards.
   ───────────────────────────────────────────────────────── */

const VB_W = 2400;
const VB_H = 1320;

/* ─── Theme detection hook ─── */
const useIsDark = (): boolean => {
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof document === "undefined") return true;
    return document.documentElement.classList.contains("dark");
  });

  useEffect(() => {
    const root = document.documentElement;
    const update = () => setIsDark(root.classList.contains("dark"));
    update();
    const observer = new MutationObserver(update);
    observer.observe(root, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  return isDark;
};

const SI = (slug: string, color?: string) =>
  `https://cdn.simpleicons.org/${slug}${color ? `/${color}` : ""}`;

/* Logos NOT available on Simple Icons — sourced from official mirrors. */
const AZURE_LOGO    = "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/azure/azure-original.svg";
const WAZUH_LOGO    = "https://github.com/wazuh.png?size=120";
const SURICATA_LOGO = "https://github.com/OISF.png?size=120";

/* ─── Reusable label-pill component (midpoint-anchored) ─── */
type LabelProps = {
  x: number;
  y: number;
  text: string;
  color: string;
  isDark: boolean;
  delay?: number;
};
const ArrowLabel = ({ x, y, text, color, isDark, delay = 0 }: LabelProps) => {
  const w = text.length * 9.5 + 28;
  const h = 26;
  return (
    <motion.g
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ delay }}
    >
      <rect
        x={x - w / 2}
        y={y - h / 2}
        width={w}
        height={h}
        rx={h / 2}
        fill={isDark ? "rgba(8,8,16,0.96)" : "rgba(255,255,255,0.98)"}
        stroke={color}
        strokeWidth="1.2"
        strokeOpacity="0.7"
      />
      <text
        x={x}
        y={y + 5}
        textAnchor="middle"
        fill={color}
        fontSize="14"
        fontWeight="700"
        letterSpacing="1.5"
        style={{ fontFamily: "'JetBrains Mono', monospace" }}
      >
        {text}
      </text>
    </motion.g>
  );
};

/* ─── Component ─── */
export const ArchitectureDiagram = () => {
  const isDark = useIsDark();

  const c = {
    panelStroke:    isDark ? "rgba(255,255,255,0.08)" : "rgba(15,23,42,0.12)",
    grid:           isDark ? "rgba(255,255,255,0.04)" : "rgba(15,23,42,0.05)",
    title:          isDark ? "#ffffff" : "#0f172a",
    subtitle:       isDark ? "#9ca3af" : "#475569",
    body:           isDark ? "#cbd5e1" : "#334155",
    muted:          isDark ? "#6b7280" : "#64748b",
    subPanelFill:   isDark ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.78)",
    subPanelStroke: isDark ? "rgba(255,255,255,0.08)" : "rgba(15,23,42,0.10)",
  };

  const panel = (rgb: string, dark: number, light: number) =>
    `rgba(${rgb}, ${isDark ? dark : light})`;

  /* ── LAYOUT (single source of truth) ── */

  // GitHub (top, full width)
  const gh    = { x: 80,  y: 40,  w: 2240, h: 260 };
  const ghRepo = { x: 220, y: 130, w: 940, h: 150 };
  const ghAct  = { x: 1260, y: 130, w: 940, h: 150 };

  // Red Team (slightly narrower)
  const rt    = { x: 60,  y: 380, w: 420, h: 460 };
  const rtAtk = { x: 84,  y: 450, w: 372, h: 170 };
  const rtLog = { x: 84,  y: 640, w: 372, h: 180 };

  // Microsoft Azure (narrower so React Dashboard can breathe)
  const az    = { x: 560, y: 380, w: 700, h: 540 };
  const azVm  = { x: 584, y: 450, w: 652, h: 450 };
  const wz    = { x: 604, y: 600, w: 312, h: 280 };
  const sr    = { x: 928, y: 600, w: 308, h: 280 };

  // Netlify (BFF + CDN side-by-side, slightly tighter)
  const nf    = { x: 1360, y: 380, w: 580, h: 460 };
  const bff   = { x: 1384, y: 470, w: 264, h: 350 };
  const cdn   = { x: 1664, y: 470, w: 264, h: 350 };

  // React Dashboard — much wider now (was 200, now 360)
  const rd    = { x: 2020, y: 380, w: 360, h: 700 };
  const zs    = { x: 2044, y: 450, w: 312, h: 110 };
  const rb    = { x: 2044, y: 590, w: 148, h: 150 };
  const mt    = { x: 2208, y: 590, w: 148, h: 150 };

  return (
    <section id="diagram" className="relative py-32 px-4 lg:px-8 xl:px-12">
      <div className="max-w-[1600px] mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewport}
          transition={{ duration: 0.7 }}
          className="mb-12"
        >
          <p className="font-mono text-[11px] tracking-[0.4em] uppercase text-red-600 dark:text-red-400 mb-3 flex items-center gap-3">
            <span className="block w-5 h-px bg-red-600 dark:bg-red-500" />
            Architecture
            <span className="block w-5 h-px bg-red-600 dark:bg-red-500" />
          </p>
          <h2 className="font-cinematic text-3xl md:text-5xl lg:text-6xl text-slate-900 dark:text-white uppercase leading-tight mb-4">
            Diagramme d'Architecture
          </h2>
          <div className="w-14 h-[3px] bg-red-600 mb-5" />
          <p className="text-slate-600 dark:text-gray-400 text-base md:text-lg max-w-2xl leading-relaxed">
            Flux complet de la chaîne d'attaque et de détection — de l'attaquant Kali Linux au
            tableau de bord React en temps réel.
          </p>
        </motion.div>

        {/* SVG container */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewport}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative w-full rounded-2xl border border-slate-300/60 dark:border-white/10 overflow-hidden"
          style={{
            background: isDark
              ? "linear-gradient(135deg, rgba(10,10,20,0.95) 0%, rgba(5,5,12,0.98) 100%)"
              : "linear-gradient(135deg, rgba(248,250,252,1) 0%, rgba(241,245,249,1) 100%)",
          }}
        >
          {/* Grid overlay */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: `linear-gradient(${c.grid} 1px, transparent 1px), linear-gradient(90deg, ${c.grid} 1px, transparent 1px)`,
              backgroundSize: "44px 44px",
            }}
          />

          <svg
            viewBox={`0 0 ${VB_W} ${VB_H}`}
            className="w-full h-auto relative z-10"
            style={{ fontFamily: "'JetBrains Mono', 'Courier New', monospace" }}
          >
            <defs>
              {[
                ["red",    "#ef4444"],
                ["blue",   "#3b82f6"],
                ["orange", "#EF7D1F"],
                ["teal",   "#14b8a6"],
                ["cyan",   "#06b6d4"],
                ["gray",   isDark ? "#9ca3af" : "#475569"],
              ].map(([k, fill]) => (
                <marker
                  key={k}
                  id={`ah-${k}`}
                  viewBox="0 0 10 10"
                  refX="9" refY="5"
                  markerWidth="7" markerHeight="7"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 0 L 10 5 L 0 10 z" fill={fill} />
                </marker>
              ))}

              <filter id="ad-glow" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="2.5" result="b" />
                <feMerge>
                  <feMergeNode in="b" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* ═══════════ GITHUB (top) ═══════════ */}
            <motion.g
              initial={{ opacity: 0, y: -10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <rect x={gh.x} y={gh.y} width={gh.w} height={gh.h} rx="14"
                fill={panel("107,114,128", 0.05, 0.04)}
                stroke={c.panelStroke} strokeWidth="1.2" strokeDasharray="6 4" />
              <image
                href={SI("github", isDark ? "ffffff" : "181717")}
                x={gh.x + 24} y={gh.y + 14} width="32" height="32"
              />
              <text x={gh.x + 70} y={gh.y + 38}
                fill={c.title} fontSize="24" fontWeight="800" letterSpacing="4">
                GITHUB
              </text>
              <text x={gh.x + 70} y={gh.y + 66}
                fill={c.muted} fontSize="15">
                Source de vérité + pipeline CI/CD
              </text>

              {/* Repo card */}
              <rect x={ghRepo.x} y={ghRepo.y} width={ghRepo.w} height={ghRepo.h} rx="10"
                fill={c.subPanelFill} stroke={c.subPanelStroke} strokeWidth="1" />
              <image
                href={SI("github", isDark ? "ffffff" : "181717")}
                x={ghRepo.x + 22} y={ghRepo.y + 22} width="28" height="28"
              />
              <text x={ghRepo.x + 62} y={ghRepo.y + 42}
                fill={c.title} fontSize="22" fontWeight="700">
                GitHub Repository
              </text>
              <text x={ghRepo.x + 22} y={ghRepo.y + 76} fill={c.body} fontSize="15">
                Asttr0/tracks4hacks · branch main
              </text>
              <text x={ghRepo.x + 22} y={ghRepo.y + 100} fill={c.muted} fontSize="14">› Code source · Issues · PRs</text>
              <text x={ghRepo.x + 22} y={ghRepo.y + 122} fill={c.muted} fontSize="14">› Historique commits + tags</text>
              <text x={ghRepo.x + 22} y={ghRepo.y + 144} fill={c.muted} fontSize="14">› Reviews + discussions</text>

              {/* Actions card */}
              <rect x={ghAct.x} y={ghAct.y} width={ghAct.w} height={ghAct.h} rx="10"
                fill={panel("32,136,255", 0.06, 0.05)}
                stroke="rgba(32,136,255,0.35)" strokeWidth="1" />
              <image
                href={SI("githubactions", "2088FF")}
                x={ghAct.x + 22} y={ghAct.y + 22} width="28" height="28"
              />
              <text x={ghAct.x + 62} y={ghAct.y + 42}
                fill={c.title} fontSize="22" fontWeight="700">
                GitHub Actions (CI/CD)
              </text>
              <text x={ghAct.x + 22} y={ghAct.y + 76} fill={c.body} fontSize="15">
                .github/workflows — build · test · deploy
              </text>
              <text x={ghAct.x + 22} y={ghAct.y + 100} fill={c.muted} fontSize="14">› tsc strict + Vitest sur push</text>
              <text x={ghAct.x + 22} y={ghAct.y + 122} fill={c.muted} fontSize="14">› Build Vite production minifié</text>
              <text x={ghAct.x + 22} y={ghAct.y + 144} fill={c.muted} fontSize="14">› Deploy auto vers Netlify</text>
            </motion.g>

            {/* ═══════════ RED TEAM ═══════════ */}
            <motion.g
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.25 }}
            >
              <rect x={rt.x} y={rt.y} width={rt.w} height={rt.h} rx="14"
                fill={panel("239,68,68", 0.10, 0.06)}
                stroke="rgba(239,68,68,0.45)" strokeWidth="1.5" />
              <image
                href={SI("kalilinux", "557C94")}
                x={rt.x + 24} y={rt.y + 14} width="32" height="32"
              />
              <text x={rt.x + 70} y={rt.y + 38}
                fill="#ef4444" fontSize="22" fontWeight="800" letterSpacing="4">
                RED TEAM OPS
              </text>

              {/* Attacker card */}
              <rect x={rtAtk.x} y={rtAtk.y} width={rtAtk.w} height={rtAtk.h} rx="10"
                fill={c.subPanelFill} stroke="rgba(239,68,68,0.30)" strokeWidth="1" />
              <image
                href={SI("kalilinux", "557C94")}
                x={rtAtk.x + 18} y={rtAtk.y + 18} width="28" height="28"
              />
              <text x={rtAtk.x + 56} y={rtAtk.y + 38}
                fill={c.title} fontSize="20" fontWeight="700">Attacker Box</text>
              <text x={rtAtk.x + 18} y={rtAtk.y + 70}
                fill={c.subtitle} fontSize="15">Kali Linux — poste local</text>
              <text x={rtAtk.x + 18} y={rtAtk.y + 100} fill={c.muted} fontSize="14">› nmap · hydra</text>
              <text x={rtAtk.x + 18} y={rtAtk.y + 122} fill={c.muted} fontSize="14">› metasploit · gobuster</text>
              <text x={rtAtk.x + 18} y={rtAtk.y + 144} fill={c.muted} fontSize="14">› MITRE T1046, T1110, T1190</text>

              {/* Attack log card */}
              <rect x={rtLog.x} y={rtLog.y} width={rtLog.w} height={rtLog.h} rx="10"
                fill={panel("239,68,68", 0.08, 0.05)}
                stroke="rgba(239,68,68,0.25)" strokeWidth="1" />
              <g transform={`translate(${rtLog.x + 18}, ${rtLog.y + 20})`}>
                <rect width="24" height="28" rx="3" fill="none" stroke="#ef4444" strokeWidth="1.8" />
                <line x1="6" y1="9" x2="18" y2="9" stroke="#ef4444" strokeWidth="1.4" />
                <line x1="6" y1="15" x2="18" y2="15" stroke="#ef4444" strokeWidth="1.4" />
                <line x1="6" y1="21" x2="14" y2="21" stroke="#ef4444" strokeWidth="1.4" />
              </g>
              <text x={rtLog.x + 56} y={rtLog.y + 40}
                fill={c.title} fontSize="20" fontWeight="700">attack-log.json</text>
              <text x={rtLog.x + 18} y={rtLog.y + 80} fill={c.muted} fontSize="14">› timestamp · tool · target</text>
              <text x={rtLog.x + 18} y={rtLog.y + 102} fill={c.muted} fontSize="14">› MITRE technique · IP cible</text>
              <text x={rtLog.x + 18} y={rtLog.y + 124} fill={c.muted} fontSize="14">› append-only, JSON lines</text>
              <text x={rtLog.x + 18} y={rtLog.y + 158}
                fill="#ef4444" fontSize="13" letterSpacing="2" fontWeight="700">● LIVE STREAM</text>
            </motion.g>

            {/* ═══════════ MICROSOFT AZURE ═══════════ */}
            <motion.g
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <rect x={az.x} y={az.y} width={az.w} height={az.h} rx="14"
                fill={panel("0,120,212", 0.08, 0.05)}
                stroke="rgba(0,120,212,0.45)" strokeWidth="1.5" />
              <image
                href={AZURE_LOGO}
                x={az.x + 24} y={az.y + 14} width="32" height="32"
              />
              <text x={az.x + 70} y={az.y + 38}
                fill="#0078D4" fontSize="22" fontWeight="800" letterSpacing="4">
                MICROSOFT AZURE
              </text>

              {/* Debian VM container */}
              <rect x={azVm.x} y={azVm.y} width={azVm.w} height={azVm.h} rx="12"
                fill={panel("168,29,51", 0.06, 0.04)}
                stroke="rgba(168,29,51,0.40)" strokeWidth="1.2" />
              <image
                href={SI("debian", "A81D33")}
                x={azVm.x + 18} y={azVm.y + 18} width="28" height="28"
              />
              <text x={azVm.x + 56} y={azVm.y + 38}
                fill={c.title} fontSize="20" fontWeight="700">Debian 12 VM</text>
              <text x={azVm.x + 18} y={azVm.y + 66}
                fill={c.subtitle} fontSize="15">B2ls_v2 · 2 vCPU · 4 Go RAM · Sweden Central</text>

              {/* Wazuh sub-card */}
              <rect x={wz.x} y={wz.y} width={wz.w} height={wz.h} rx="10"
                fill={panel("0,163,207", 0.10, 0.06)}
                stroke="rgba(0,163,207,0.45)" strokeWidth="1.2" />
              <image
                href={WAZUH_LOGO}
                x={wz.x + 16} y={wz.y + 16} width="32" height="32"
              />
              <text x={wz.x + 56} y={wz.y + 38}
                fill={c.title} fontSize="20" fontWeight="700">Wazuh Manager</text>
              <text x={wz.x + 16} y={wz.y + 70} fill={c.body} fontSize="14">› SIEM open-source</text>
              <text x={wz.x + 16} y={wz.y + 92} fill={c.body} fontSize="14">› Règles de détection</text>
              <text x={wz.x + 16} y={wz.y + 114} fill={c.body} fontSize="14">› Tag MITRE ATT&CK auto</text>
              <text x={wz.x + 16} y={wz.y + 136} fill={c.body} fontSize="14">› Ingest eve.json + auth</text>
              <text x={wz.x + 16} y={wz.y + 158} fill={c.muted} fontSize="14">› Index alertes (OpenSearch)</text>
              <text x={wz.x + 16} y={wz.y + 200} fill="#00A3CF"
                fontSize="14" letterSpacing="2" fontWeight="700">⇒ API REST :55000</text>
              <text x={wz.x + 16} y={wz.y + 224} fill={c.muted} fontSize="13">/api/v4/alerts · JWT</text>

              {/* Suricata sub-card */}
              <rect x={sr.x} y={sr.y} width={sr.w} height={sr.h} rx="10"
                fill={panel("239,127,31", 0.10, 0.06)}
                stroke="rgba(239,127,31,0.45)" strokeWidth="1.2" />
              <image
                href={SURICATA_LOGO}
                x={sr.x + 16} y={sr.y + 16} width="32" height="32"
              />
              <text x={sr.x + 56} y={sr.y + 38}
                fill={c.title} fontSize="20" fontWeight="700">Suricata IDS</text>
              <text x={sr.x + 16} y={sr.y + 70} fill={c.body} fontSize="14">› Network IDS</text>
              <text x={sr.x + 16} y={sr.y + 92} fill={c.body} fontSize="14">› Inspecte les paquets</text>
              <text x={sr.x + 16} y={sr.y + 114} fill={c.body} fontSize="14">› Signatures + scoring</text>
              <text x={sr.x + 16} y={sr.y + 136} fill={c.body} fontSize="14">› eve.json output</text>
              <text x={sr.x + 16} y={sr.y + 158} fill={c.muted} fontSize="14">› /var/log/suricata/eve.json</text>
              <text x={sr.x + 16} y={sr.y + 200} fill="#EF7D1F"
                fontSize="14" letterSpacing="2" fontWeight="700">→ Wazuh agent</text>
            </motion.g>

            {/* ═══════════ NETLIFY EDGE ═══════════ */}
            <motion.g
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.55 }}
            >
              <rect x={nf.x} y={nf.y} width={nf.w} height={nf.h} rx="14"
                fill={panel("20,184,166", 0.08, 0.05)}
                stroke="rgba(20,184,166,0.45)" strokeWidth="1.5" />
              <image
                href={SI("netlify", "00C7B7")}
                x={nf.x + 24} y={nf.y + 14} width="32" height="32"
              />
              <text x={nf.x + 70} y={nf.y + 38}
                fill="#14b8a6" fontSize="22" fontWeight="800" letterSpacing="4">
                NETLIFY EDGE
              </text>

              {/* BFF */}
              <rect x={bff.x} y={bff.y} width={bff.w} height={bff.h} rx="10"
                fill={c.subPanelFill} stroke="rgba(20,184,166,0.40)" strokeWidth="1.2" />
              <image
                href={SI("nodedotjs", "5FA04E")}
                x={bff.x + 16} y={bff.y + 16} width="28" height="28"
              />
              <text x={bff.x + 52} y={bff.y + 36}
                fill={c.title} fontSize="20" fontWeight="700">BFF Function</text>
              <text x={bff.x + 16} y={bff.y + 68} fill={c.body} fontSize="14">› /api/wazuh-alerts (proxy)</text>
              <text x={bff.x + 16} y={bff.y + 90} fill={c.body} fontSize="14">› /api/wazuh-stream (SSE)</text>
              <text x={bff.x + 16} y={bff.y + 112} fill={c.body} fontSize="14">› /api/attack-replay</text>
              <text x={bff.x + 16} y={bff.y + 134} fill={c.body} fontSize="14">› JWT cache 14 min</text>
              <text x={bff.x + 16} y={bff.y + 168} fill={c.muted} fontSize="13">Credentials Wazuh</text>
              <text x={bff.x + 16} y={bff.y + 188} fill={c.muted} fontSize="13">server-side only</text>
              <text x={bff.x + 16} y={bff.y + 230} fill="#14b8a6"
                fontSize="13" letterSpacing="2" fontWeight="700">Node.js · Edge</text>

              {/* Static CDN */}
              <rect x={cdn.x} y={cdn.y} width={cdn.w} height={cdn.h} rx="10"
                fill={panel("20,184,166", 0.10, 0.06)}
                stroke="rgba(20,184,166,0.40)" strokeWidth="1.2" />
              <image
                href={SI("netlify", "00C7B7")}
                x={cdn.x + 16} y={cdn.y + 16} width="28" height="28"
              />
              <text x={cdn.x + 52} y={cdn.y + 36}
                fill={c.title} fontSize="20" fontWeight="700">Static CDN</text>
              <text x={cdn.x + 16} y={cdn.y + 68} fill={c.body} fontSize="14">› Bundle React (Vite)</text>
              <text x={cdn.x + 16} y={cdn.y + 90} fill={c.body} fontSize="14">› Edge nodes worldwide</text>
              <text x={cdn.x + 16} y={cdn.y + 112} fill={c.body} fontSize="14">› HTTPS · Let's Encrypt</text>
              <text x={cdn.x + 16} y={cdn.y + 134} fill={c.body} fontSize="14">› Cache headers tunés</text>
              <text x={cdn.x + 16} y={cdn.y + 168} fill={c.muted} fontSize="13">Déploiement auto</text>
              <text x={cdn.x + 16} y={cdn.y + 188} fill={c.muted} fontSize="13">via GitHub Actions</text>
            </motion.g>

            {/* ═══════════ REACT DASHBOARD ═══════════ */}
            <motion.g
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.7 }}
            >
              <rect x={rd.x} y={rd.y} width={rd.w} height={rd.h} rx="14"
                fill={panel("97,218,251", 0.08, 0.05)}
                stroke="rgba(97,218,251,0.45)" strokeWidth="1.5" />
              <image
                href={SI("react", "61DAFB")}
                x={rd.x + 24} y={rd.y + 12} width="36" height="36"
              />
              <text x={rd.x + 72} y={rd.y + 38}
                fill={isDark ? "#61DAFB" : "#0891b2"}
                fontSize="22" fontWeight="800" letterSpacing="4">
                REACT DASHBOARD
              </text>

              {/* Zustand Store */}
              <rect x={zs.x} y={zs.y} width={zs.w} height={zs.h} rx="10"
                fill={c.subPanelFill} stroke="rgba(97,218,251,0.40)" strokeWidth="1.2" />
              <text x={zs.x + zs.w / 2} y={zs.y + 38} textAnchor="middle"
                fill={c.title} fontSize="20" fontWeight="700">Zustand Store</text>
              <text x={zs.x + zs.w / 2} y={zs.y + 66} textAnchor="middle"
                fill={c.body} fontSize="15">useUiStore · useLogStore</text>
              <text x={zs.x + zs.w / 2} y={zs.y + 90} textAnchor="middle"
                fill={c.muted} fontSize="13">État global typé · sans drilling</text>

              {/* R/B Timeline */}
              <rect x={rb.x} y={rb.y} width={rb.w} height={rb.h} rx="10"
                fill={panel("239,68,68", 0.08, 0.05)}
                stroke="rgba(239,68,68,0.35)" strokeWidth="1" />
              <text x={rb.x + rb.w / 2} y={rb.y + 36} textAnchor="middle"
                fill={c.title} fontSize="17" fontWeight="700">R/B Timeline</text>
              <text x={rb.x + rb.w / 2} y={rb.y + 64} textAnchor="middle"
                fill={c.body} fontSize="13">Recharts</text>
              <text x={rb.x + rb.w / 2} y={rb.y + 88} textAnchor="middle"
                fill={c.muted} fontSize="12">double axe</text>
              <text x={rb.x + rb.w / 2} y={rb.y + 110} textAnchor="middle"
                fill={c.muted} fontSize="12">120s window</text>
              <text x={rb.x + rb.w / 2} y={rb.y + 134} textAnchor="middle"
                fill="#ef4444" fontSize="11" letterSpacing="1.5" fontWeight="700">RED ⇄ BLUE</text>

              {/* MITRE Heatmap */}
              <rect x={mt.x} y={mt.y} width={mt.w} height={mt.h} rx="10"
                fill={panel("168,85,247", 0.08, 0.05)}
                stroke="rgba(168,85,247,0.35)" strokeWidth="1" />
              <text x={mt.x + mt.w / 2} y={mt.y + 36} textAnchor="middle"
                fill={c.title} fontSize="17" fontWeight="700">MITRE Heatmap</text>
              <text x={mt.x + mt.w / 2} y={mt.y + 64} textAnchor="middle"
                fill={c.body} fontSize="13">ATT&CK v14</text>
              <text x={mt.x + mt.w / 2} y={mt.y + 88} textAnchor="middle"
                fill={c.muted} fontSize="12">14 tactiques</text>
              <text x={mt.x + mt.w / 2} y={mt.y + 110} textAnchor="middle"
                fill={c.muted} fontSize="12">coverage map</text>
              <text x={mt.x + mt.w / 2} y={mt.y + 134} textAnchor="middle"
                fill="#a855f7" fontSize="11" letterSpacing="1.5" fontWeight="700">DETECTION</text>

              {/* Features sub-box */}
              <rect x={rd.x + 24} y={760} width={rd.w - 48} height={300} rx="10"
                fill={c.subPanelFill} stroke="rgba(97,218,251,0.40)" strokeWidth="1.2" />
              <text x={rd.x + rd.w / 2} y={790} textAnchor="middle"
                fill={isDark ? "#61DAFB" : "#0891b2"}
                fontSize="15" letterSpacing="3" fontWeight="700">FEATURES</text>

              <g transform={`translate(${rd.x + 36}, 808)`}>
                <rect width={rd.w - 72} height="64" rx="8"
                  fill={panel("239,68,68", 0.10, 0.06)} stroke="rgba(239,68,68,0.30)" />
                <text x={(rd.w - 72) / 2} y="30" textAnchor="middle"
                  fill={c.title} fontSize="15" fontWeight="700">Rapport PDF</text>
                <text x={(rd.w - 72) / 2} y="50" textAnchor="middle"
                  fill={c.muted} fontSize="12">@media print · audit-ready</text>
              </g>
              <g transform={`translate(${rd.x + 36}, 884)`}>
                <rect width={rd.w - 72} height="64" rx="8"
                  fill={panel("16,185,129", 0.10, 0.06)} stroke="rgba(16,185,129,0.30)" />
                <text x={(rd.w - 72) / 2} y="30" textAnchor="middle"
                  fill={c.title} fontSize="15" fontWeight="700">GeoIP Map</text>
                <text x={(rd.w - 72) / 2} y="50" textAnchor="middle"
                  fill={c.muted} fontSize="12">react-simple-maps</text>
              </g>
              <g transform={`translate(${rd.x + 36}, 960)`}>
                <rect width={rd.w - 72} height="64" rx="8"
                  fill={panel("245,158,11", 0.10, 0.06)} stroke="rgba(245,158,11,0.30)" />
                <text x={(rd.w - 72) / 2} y="30" textAnchor="middle"
                  fill={c.title} fontSize="15" fontWeight="700">Coverage Scoreboard</text>
                <text x={(rd.w - 72) / 2} y="50" textAnchor="middle"
                  fill={c.muted} fontSize="12">% détection · KPI temps réel</text>
              </g>

            </motion.g>

            {/* ════════════════════════════════════════════════════
                ARROWS — every endpoint anchored to a box edge.
                Every label sits in inter-system gap, never on text.
                ════════════════════════════════════════════════════ */}

            {/* 1. Attacker → Wazuh (red dashed = ATTACK)
                  Label sits in the gap between Red Team (right=500) and Azure (left=580). */}
            {(() => {
              const x1 = rtAtk.x + rtAtk.w;             // 476
              const y1 = rtAtk.y + rtAtk.h / 2;         // 535
              const x2 = wz.x - 6;                      // 618
              const y2 = wz.y + 90;                     // 690 — anchor near top of Wazuh
              const d = `M ${x1},${y1} C ${x1 + 80},${y1} ${x2 - 80},${y2} ${x2},${y2}`;
              return (
                <>
                  <motion.path
                    d={d}
                    stroke="#ef4444" strokeWidth="2.5" strokeDasharray="10 5" fill="none"
                    markerEnd="url(#ah-red)" filter="url(#ad-glow)"
                    initial={{ pathLength: 0, opacity: 0 }}
                    whileInView={{ pathLength: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.0, delay: 0.9 }}
                  />
                  <ArrowLabel
                    x={520} y={605}
                    text="ATTACK" color="#ef4444" isDark={isDark} delay={1.4}
                  />
                </>
              );
            })()}

            {/* 2. attack-log.json → Suricata (orange dashed = LOG SHIP)
                  Routed BELOW the Wazuh card so it never overlaps Wazuh text.
                  Label placed in the bottom gap (y≈920, between Azure box and the legend). */}
            {(() => {
              const x1 = rtLog.x + rtLog.w;            // 476
              const y1 = rtLog.y + rtLog.h / 2;        // 730
              const x2 = sr.x - 6;                     // 982
              const y2 = sr.y + sr.h - 80;             // 800 — lower part of Suricata
              // Curve dipping under Wazuh: midpoint y = 940
              const d = `M ${x1},${y1}
                         C ${x1 + 80},${y1 + 100} ${(x1 + x2) / 2 - 60},${940}
                           ${(x1 + x2) / 2 + 60},${940}
                         S ${x2 - 80},${y2 + 60} ${x2},${y2}`;
              return (
                <>
                  <motion.path
                    d={d}
                    stroke="#EF7D1F" strokeWidth="2.5" strokeDasharray="10 5" fill="none"
                    markerEnd="url(#ah-orange)" filter="url(#ad-glow)"
                    initial={{ pathLength: 0, opacity: 0 }}
                    whileInView={{ pathLength: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.2, delay: 1.1 }}
                  />
                  <ArrowLabel
                    x={(x1 + x2) / 2} y={950}
                    text="LOG SHIP" color="#EF7D1F" isDark={isDark} delay={1.6}
                  />
                </>
              );
            })()}

            {/* 3. Wazuh API → BFF (blue solid = API :55000)
                  Originates from the Debian VM right edge (NOT crossing Suricata).
                  Label sits in the gap between Azure (right=1360) and Netlify (left=1440). */}
            {(() => {
              const x1 = az.x + az.w;                 // 1360 — Azure right edge
              const y1 = wz.y + 210;                  // 810 — at Wazuh API line height
              const x2 = bff.x - 6;                   // 1458
              const y2 = bff.y + bff.h / 2;           // 645
              const d = `M ${x1},${y1} C ${x1 + 50},${y1} ${x2 - 50},${y2} ${x2},${y2}`;
              return (
                <>
                  <motion.path
                    d={d}
                    stroke="#3b82f6" strokeWidth="2.5" fill="none"
                    markerEnd="url(#ah-blue)" filter="url(#ad-glow)"
                    initial={{ pathLength: 0, opacity: 0 }}
                    whileInView={{ pathLength: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.0, delay: 1.3 }}
                  />
                  <ArrowLabel
                    x={(x1 + x2) / 2} y={(y1 + y2) / 2}
                    text="API :55000" color="#3b82f6" isDark={isDark} delay={1.8}
                  />
                </>
              );
            })()}

            {/* 4. BFF → Static CDN (teal short, intra-Netlify, no label) */}
            {(() => {
              const x1 = bff.x + bff.w;               // 1754
              const y1 = bff.y + bff.h / 2;           // 645
              const x2 = cdn.x - 6;                   // 1764
              const y2 = cdn.y + cdn.h / 2;           // 645
              const d = `M ${x1},${y1} L ${x2},${y2}`;
              return (
                <motion.path
                  d={d}
                  stroke="#14b8a6" strokeWidth="2.5" fill="none"
                  markerEnd="url(#ah-teal)"
                  initial={{ pathLength: 0, opacity: 0 }}
                  whileInView={{ pathLength: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 1.5 }}
                />
              );
            })()}

            {/* 5. Static CDN → Zustand (teal solid = FETCH)
                  Label in gap between Netlify (right=2080) and React (left=2160). */}
            {(() => {
              const x1 = cdn.x + cdn.w;               // 2060
              const y1 = cdn.y + 90;                  // 560
              const x2 = zs.x - 6;                    // 2178
              const y2 = zs.y + zs.h / 2;             // 500
              const d = `M ${x1},${y1} C ${x1 + 40},${y1} ${x2 - 40},${y2} ${x2},${y2}`;
              return (
                <>
                  <motion.path
                    d={d}
                    stroke="#14b8a6" strokeWidth="2.5" fill="none"
                    markerEnd="url(#ah-teal)" filter="url(#ad-glow)"
                    initial={{ pathLength: 0, opacity: 0 }}
                    whileInView={{ pathLength: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.9, delay: 1.6 }}
                  />
                  <ArrowLabel
                    x={1980} y={420}
                    text="FETCH" color="#14b8a6" isDark={isDark} delay={2.0}
                  />
                </>
              );
            })()}

            {/* 6. GitHub Actions → Static CDN (gray dashed = CI/CD DEPLOY)
                  CDN top is now exposed (BFF & CDN side-by-side), so this is a clean
                  vertical drop. Label sits in the gap between GitHub (bottom=300)
                  and Netlify (top=380). */}
            {(() => {
              const x1 = ghAct.x + ghAct.w / 2;       // 1730
              const y1 = ghAct.y + ghAct.h;           // 280
              const x2 = cdn.x + cdn.w / 2;           // 1915
              const y2 = cdn.y - 6;                   // 464
              const my = (y1 + y2) / 2;
              const d = `M ${x1},${y1} C ${x1},${my} ${x2},${my} ${x2},${y2}`;
              return (
                <>
                  <motion.path
                    d={d}
                    stroke={isDark ? "#9ca3af" : "#475569"}
                    strokeWidth="2.5" fill="none" strokeDasharray="10 5"
                    markerEnd="url(#ah-gray)"
                    initial={{ pathLength: 0, opacity: 0 }}
                    whileInView={{ pathLength: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.0, delay: 1.7 }}
                  />
                  <ArrowLabel
                    x={(x1 + x2) / 2} y={340}
                    text="CI/CD DEPLOY"
                    color={isDark ? "#9ca3af" : "#475569"}
                    isDark={isDark} delay={2.2}
                  />
                </>
              );
            })()}

            {/* 7. Zustand → MITRE / R/B (cyan internal connectors, no label) */}
            {(() => {
              const x1 = zs.x + zs.w / 2;
              const y1 = zs.y + zs.h;
              const targets = [
                { x: rb.x + rb.w / 2, y: rb.y - 6 },
                { x: mt.x + mt.w / 2, y: mt.y - 6 },
              ];
              return (
                <>
                  {targets.map((t, i) => {
                    const d = `M ${x1},${y1} C ${x1},${y1 + 10} ${t.x},${t.y - 10} ${t.x},${t.y}`;
                    return (
                      <motion.path
                        key={i}
                        d={d}
                        stroke="#06b6d4" strokeWidth="2.5" fill="none"
                        markerEnd="url(#ah-cyan)"
                        initial={{ pathLength: 0, opacity: 0 }}
                        whileInView={{ pathLength: 1, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 2.0 + i * 0.05 }}
                      />
                    );
                  })}
                </>
              );
            })()}

            {/* ═══════════ Data streams — flowing glowing pulses ═══════════
                Each arrow gets N pulses staggered evenly along its path,
                with a pulsing halo + bright white core (comet effect). */}
            {(() => {
              // LOG SHIP path uses an S-curve dipping under Wazuh
              const logShipMid = (rtLog.x + rtLog.w + sr.x - 6) / 2;
              const streams: Array<{
                path: string;
                color: string;
                dur: number;
                pulses: number;
                haloR: number;
                coreR: number;
              }> = [
                {
                  // ATTACK
                  path: `M ${rtAtk.x + rtAtk.w},${rtAtk.y + rtAtk.h / 2} C ${rtAtk.x + rtAtk.w + 80},${rtAtk.y + rtAtk.h / 2} ${wz.x - 86},${wz.y + 90} ${wz.x - 6},${wz.y + 90}`,
                  color: "#ef4444", dur: 2.6, pulses: 3, haloR: 10, coreR: 2.4,
                },
                {
                  // LOG SHIP (dipping curve)
                  path: `M ${rtLog.x + rtLog.w},${rtLog.y + rtLog.h / 2}
                         C ${rtLog.x + rtLog.w + 80},${rtLog.y + rtLog.h / 2 + 100} ${logShipMid - 60},940 ${logShipMid + 60},940
                         S ${sr.x - 86},${sr.y + sr.h - 80 + 60} ${sr.x - 6},${sr.y + sr.h - 80}`,
                  color: "#EF7D1F", dur: 4.5, pulses: 3, haloR: 9, coreR: 2.2,
                },
                {
                  // API :55000
                  path: `M ${az.x + az.w},${wz.y + 210} C ${az.x + az.w + 50},${wz.y + 210} ${bff.x - 56},${bff.y + bff.h / 2} ${bff.x - 6},${bff.y + bff.h / 2}`,
                  color: "#3b82f6", dur: 3, pulses: 3, haloR: 10, coreR: 2.4,
                },
                {
                  // BFF → CDN intra-Netlify (very short)
                  path: `M ${bff.x + bff.w},${bff.y + bff.h / 2} L ${cdn.x - 6},${cdn.y + cdn.h / 2}`,
                  color: "#14b8a6", dur: 1.4, pulses: 2, haloR: 7, coreR: 1.8,
                },
                {
                  // FETCH (CDN → Zustand)
                  path: `M ${cdn.x + cdn.w},${cdn.y + 90} C ${cdn.x + cdn.w + 40},${cdn.y + 90} ${zs.x - 46},${zs.y + zs.h / 2} ${zs.x - 6},${zs.y + zs.h / 2}`,
                  color: "#14b8a6", dur: 2.6, pulses: 3, haloR: 10, coreR: 2.4,
                },
                {
                  // CI/CD DEPLOY
                  path: `M ${ghAct.x + ghAct.w / 2},${ghAct.y + ghAct.h} C ${ghAct.x + ghAct.w / 2},${(ghAct.y + ghAct.h + cdn.y) / 2} ${cdn.x + cdn.w / 2},${(ghAct.y + ghAct.h + cdn.y) / 2} ${cdn.x + cdn.w / 2},${cdn.y - 6}`,
                  color: isDark ? "#9ca3af" : "#475569",
                  dur: 4, pulses: 2, haloR: 8, coreR: 2,
                },
              ];

              return streams.map((s, idx) => (
                <g key={idx}>
                  {Array.from({ length: s.pulses }).map((_, i) => {
                    const begin = `${(i * s.dur) / s.pulses}s`;
                    return (
                      <g key={i}>
                        {/* outer halo — pulsing radius */}
                        <circle r={s.haloR} fill={s.color} opacity="0.18">
                          <animateMotion dur={`${s.dur}s`} repeatCount="indefinite" begin={begin} path={s.path} />
                          <animate attributeName="r"
                            values={`${s.haloR - 2};${s.haloR + 2};${s.haloR - 2}`}
                            dur="1.1s" repeatCount="indefinite" begin={begin} />
                          <animate attributeName="opacity"
                            values="0.10;0.30;0.10"
                            dur="1.1s" repeatCount="indefinite" begin={begin} />
                        </circle>
                        {/* mid glow ring */}
                        <circle r={s.haloR * 0.55} fill={s.color} opacity="0.55">
                          <animateMotion dur={`${s.dur}s`} repeatCount="indefinite" begin={begin} path={s.path} />
                        </circle>
                        {/* bright core */}
                        <circle r={s.coreR} fill="#ffffff" opacity="0.98">
                          <animateMotion dur={`${s.dur}s`} repeatCount="indefinite" begin={begin} path={s.path} />
                        </circle>
                      </g>
                    );
                  })}
                </g>
              ));
            })()}

            {/* ═══════════ LEGEND ═══════════ */}
            <motion.g
              initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
              transition={{ delay: 2.4 }}
            >
              <rect x={60} y={1110} width={520} height={190} rx="12"
                fill={c.subPanelFill} stroke={c.panelStroke} strokeWidth="1" />
              <text x={84} y={1142} fill={c.title}
                fontSize="15" letterSpacing="3" fontWeight="700">LÉGENDE</text>

              {[
                { color: "#ef4444", dash: "10 5", label: "Trafic d'attaque" },
                { color: "#EF7D1F", dash: "10 5", label: "Logs / log shipping" },
                { color: "#3b82f6", dash: "0",    label: "Appel API REST (JWT)" },
                { color: "#14b8a6", dash: "0",    label: "Données vers le client" },
                { color: isDark ? "#9ca3af" : "#475569", dash: "10 5", label: "CI/CD deploy" },
                { color: "#06b6d4", dash: "0",    label: "Flux interne dashboard" },
              ].map((row, i) => {
                const y = 1170 + i * 22;
                return (
                  <g key={i}>
                    <line x1={84} y1={y} x2={180} y2={y}
                      stroke={row.color} strokeWidth="2.5"
                      strokeDasharray={row.dash} />
                    <text x={196} y={y + 5} fill={c.body} fontSize="14">
                      {row.label}
                    </text>
                  </g>
                );
              })}
            </motion.g>

            {/* Footer caption */}
            <text x={VB_W - 80} y={VB_H - 24} textAnchor="end"
              fill={c.muted} fontSize="13" letterSpacing="2">
              Tracks4Hacks · Architecture End-to-End · Red Team → Detection → BFF → Dashboard
            </text>
          </svg>
        </motion.div>
      </div>
    </section>
  );
};
