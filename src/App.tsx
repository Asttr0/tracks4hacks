import { useState, useEffect, useMemo, useRef } from "react";
import type { LucideIcon } from "lucide-react";
import {
  ChevronDown,
  Github,
  Terminal,
  AlertCircle,
  Layers,
  Globe,
  GitBranch,
  Shield,
  FileText,
} from "lucide-react";
import { SmokeBackground } from "./components/common/SmokeBackground";

// ---- Styles ----
const MasterpieceStyles = () => (
  <style
    dangerouslySetInnerHTML={{
      __html: `
    @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700;900&display=swap');

    .crt-screen {
      background-color: #140505;
      background-image:
        radial-gradient(circle, rgba(40,10,10,0.8) 0%, rgba(0,0,0,1) 100%),
        repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,0,0,0.05) 2px, rgba(255,0,0,0.05) 4px);
      box-shadow: inset 0 0 100px rgba(0,0,0,0.9);
      text-shadow: 0 0 5px #ff2a2a, 0 0 10px #ff2a2a;
      color: #ff2a2a;
      font-family: 'Courier New', Courier, monospace;
    }

    .cursor-blink { animation: blink 1s step-end infinite; }
    @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }

    .tv-turn-off { animation: tv-off 0.6s cubic-bezier(0.23, 1, 0.32, 1) forwards; }
    @keyframes tv-off {
      0%   { transform: scale(1, 1.3) translate3d(0,0,0); filter: brightness(1); }
      40%  { transform: scale(1, 0.005) translate3d(0,0,0); filter: brightness(10); }
      100% { transform: scale(0, 0.005) translate3d(0,0,0); filter: brightness(0); opacity: 0; }
    }

    @keyframes stranger-reveal {
      0%   { opacity: 0; filter: blur(20px); transform: scale(0.8); letter-spacing: 1.5em; text-shadow: 0 0 50px red, 0 0 30px darkred; }
      40%  { opacity: 1; filter: blur(4px); letter-spacing: 0.6em; text-shadow: 0 0 30px red; }
      100% { opacity: 1; filter: blur(0); transform: scale(1.05); letter-spacing: 0.1em; text-shadow: 0 0 15px rgba(220,38,38,0.8); }
    }
    .animate-stranger { animation: stranger-reveal 3s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }

    @keyframes float-spores {
      0%   { transform: translateY(100vh) rotate(0deg); opacity: 0; }
      10%  { opacity: 0.8; }
      90%  { opacity: 0.5; }
      100% { transform: translateY(-100vh) rotate(360deg); opacity: 0; }
    }

    .crt-overlay {
      background: linear-gradient(rgba(18,16,16,0) 50%, rgba(0,0,0,0.25) 50%),
                  linear-gradient(90deg, rgba(255,0,0,0.06), rgba(0,255,0,0.02), rgba(0,0,255,0.06));
      background-size: 100% 3px, 3px 100%;
      position: absolute;
      top: 0; left: 0; right: 0; bottom: 0;
      pointer-events: none;
      z-index: 60;
      box-shadow: inset 0 0 60px rgba(0,0,0,0.8);
    }

    .font-cinematic {
      font-family: 'Cinzel', 'Trajan Pro', 'Times New Roman', serif;
      font-weight: 900;
      letter-spacing: 0.05em;
    }

    .btn-classified {
      position: relative;
      background: transparent;
      border: 1px solid rgba(220,38,38,0.4);
      color: rgba(255,255,255,0.7);
      text-transform: uppercase;
      letter-spacing: 0.2em;
      transition: all 0.4s ease;
      overflow: hidden;
      cursor: pointer;
    }
    .btn-classified::before {
      content: '';
      position: absolute;
      top: 0; left: -100%; width: 100%; height: 100%;
      background: linear-gradient(90deg, transparent, rgba(220,38,38,0.2), transparent);
      transition: left 0.5s ease;
    }
    .btn-classified:hover {
      border-color: rgba(220,38,38,1);
      color: white;
      box-shadow: 0 0 20px rgba(220,38,38,0.4) inset, 0 0 20px rgba(220,38,38,0.4);
    }
    .btn-classified:hover::before { left: 100%; }

    @keyframes chevron-bounce {
      0%, 100% { transform: translateY(0); opacity: 0.4; }
      50%       { transform: translateY(6px); opacity: 0.9; }
    }
    .animate-chevron { animation: chevron-bounce 2s ease-in-out infinite; }

    .feature-card {
      border: 1px solid #1f2937;
      background: #111827;
      transition: border-color 200ms ease, box-shadow 200ms ease;
    }
    .feature-card:hover {
      border-color: rgba(127,29,29,0.55);
      box-shadow: 0 0 24px rgba(220,38,38,0.06);
    }

    ::-webkit-scrollbar { width: 4px; }
    ::-webkit-scrollbar-track { background: #000; }
    ::-webkit-scrollbar-thumb { background: #7f1d1d; border-radius: 0; }
    * { scrollbar-color: #7f1d1d #000; scrollbar-width: thin; }
  `,
    }}
  />
);

// ---- Data ----
const TECH_STACK = [
  { name: "React", meta: "v18", comment: "Frontend Framework" },
  { name: "TypeScript", meta: "Strict Mode", comment: "Type Safety" },
  { name: "Tailwind CSS", meta: "v3", comment: "Utility Styling" },
  { name: "WebGL", meta: "Shader Pipeline", comment: "Visual Engine" },
  { name: "Wazuh SIEM", meta: "Integrated", comment: "Alert Backend" },
  { name: "MITRE ATT&CK", meta: "Framework v14", comment: "Threat Mapping" },
];

type Feature = {
  icon: LucideIcon;
  title: string;
  desc: string;
  tag: string;
};

const FEATURES: Feature[] = [
  {
    icon: Terminal,
    title: "Attack Simulation",
    desc: "Execute red team scenarios through an interactive terminal. Every technique is logged in real time against the ATT&CK framework.",
    tag: "T1059 ● Execution",
  },
  {
    icon: AlertCircle,
    title: "SOC Alerts Dashboard",
    desc: "Stream and triage live Wazuh SIEM alerts with automated severity classification and correlation context.",
    tag: "T1530 ● Collection",
  },
  {
    icon: Layers,
    title: "MITRE ATT&CK Heatmap",
    desc: "Visualize technique coverage across all ATT&CK tactics. Surface blind spots in your defensive posture at a glance.",
    tag: "TA0001 ● Initial Access",
  },
  {
    icon: Globe,
    title: "Geo IP Mapping",
    desc: "Plot attacker origin IPs on a live world map. Track the geographic spread of a campaign in real time.",
    tag: "T1590 ● Reconnaissance",
  },
  {
    icon: GitBranch,
    title: "Correlation Timeline",
    desc: "Chain related alerts into attack narratives with automated temporal and behavioral correlation.",
    tag: "T1071 ● Command & Control",
  },
  {
    icon: Shield,
    title: "Coverage Scorecard",
    desc: "Score your defensive coverage against ATT&CK sub-techniques. Track progress and prioritize gaps.",
    tag: "T1595 ● Active Scanning",
  },
  {
    icon: FileText,
    title: "Incident Reports",
    desc: "Auto-generate structured incident reports from correlated attack chains, ready for analyst review.",
    tag: "T1119 ● Automated Collection",
  },
];

const AUTHORS = [
  {
    name: "Mohamed Taha Slimani",
    handle: "Asttr0",
    role: "Red Team & Full Stack",
    github: "https://github.com/Asttr0",
    avatar: "https://github.com/Asttr0.png?size=300",
  },
  {
    name: "Ismail Garnaoui",
    handle: "ismailgr10",
    role: "Blue Team & Integration",
    github: "https://github.com/ismailgr10",
    avatar: "https://github.com/ismailgr10.png?size=300",
  },
];

// ---- Spores ----
type SporeData = { size: number; left: number; duration: number; delay: number };

const Spore = ({ spore }: { spore: SporeData }) => (
  <div
    className="absolute bg-red-500 rounded-full blur-[1px] opacity-0 pointer-events-none"
    style={{
      width: spore.size + "px",
      height: spore.size + "px",
      left: spore.left + "%",
      animation: `float-spores ${spore.duration}s linear ${spore.delay}s infinite`,
    }}
  />
);

const SporesOverlay = () => {
  const spores = useMemo(
    () =>
      Array.from({ length: 40 }).map(() => ({
        size: Math.random() * 4 + 1,
        left: Math.random() * 100,
        duration: Math.random() * 10 + 10,
        delay: Math.random() * -20,
      })),
    [],
  );
  return (
    <div className="fixed inset-0 z-10 overflow-hidden pointer-events-none">
      {spores.map((spore, i) => (
        <Spore key={i} spore={spore} />
      ))}
    </div>
  );
};

// ---- Scroll Reveal ----
function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry?.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.1 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return { ref, visible };
}

interface RevealProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

const Reveal = ({ children, delay = 0, className = "" }: RevealProps) => {
  const { ref, visible } = useScrollReveal();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(16px)",
        transition: `opacity 500ms ease-out ${delay}ms, transform 500ms ease-out ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
};

// ---- Feature Card ----
const FeatureCard = ({ feature, index }: { feature: Feature; index: number }) => {
  const Icon = feature.icon;
  return (
    <Reveal delay={index * 60} className="h-full">
      <div className="feature-card p-6 h-full flex flex-col gap-4">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 flex items-center justify-center border border-red-900/30 shrink-0">
            <Icon size={16} className="text-red-500" />
          </div>
          <h3 className="font-cinematic text-white text-sm tracking-wide mt-2 uppercase">
            {feature.title}
          </h3>
        </div>
        <p className="text-gray-300 text-sm leading-relaxed flex-1">{feature.desc}</p>
        <span className="font-mono text-[10px] text-red-400 tracking-widest uppercase">
          {feature.tag}
        </span>
      </div>
    </Reveal>
  );
};

// ---- Divider ----
const SectionDivider = () => (
  <div className="w-full h-px bg-gradient-to-r from-transparent via-red-900/25 to-transparent" />
);

// ---- Main App ----
export default function App() {
  const [phase, setPhase] = useState("boot");
  const [terminalText, setTerminalText] = useState("");
  const [bootLogs, setBootLogs] = useState<string[]>([]);
  const [showCursor, setShowCursor] = useState(true);
  const [showDashboard, setShowDashboard] = useState(false);
  const heroContentRef = useRef<HTMLDivElement>(null);

  // Hero parallax on scroll
  useEffect(() => {
    if (phase !== "stranger") return;
    const onScroll = () => {
      if (heroContentRef.current) {
        heroContentRef.current.style.transform = `translateY(${window.scrollY * 0.4}px)`;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [phase]);

  useEffect(() => {
    if (phase !== "boot") return;
    const cmd = ".//Tracks4Hacks init";
    let i = 0;
    const typeWriter = setInterval(() => {
      if (i < cmd.length) {
        setTerminalText((prev) => prev + cmd.charAt(i));
        i++;
      } else {
        clearInterval(typeWriter);
        setTimeout(() => setBootLogs((p) => [...p, "[+] Booting Purple Team Engine..."]), 500);
        setTimeout(() => setBootLogs((p) => [...p, "[+] Connecting to SOC SIEM..."]), 1200);
        setTimeout(() => setBootLogs((p) => [...p, "[+] Syncing MITRE ATT&CK Matrix..."]), 1800);
        setTimeout(() => {
          setBootLogs((p) => [...p, "[+] Correlation Engine is ONLINE."]);
          setShowCursor(false);
        }, 2400);
        setTimeout(() => setPhase("tear"), 3200);
      }
    }, 80);
    return () => clearInterval(typeWriter);
  }, [phase]);

  useEffect(() => {
    if (phase === "tear") setTimeout(() => setPhase("void"), 600);
    if (phase === "void") setTimeout(() => setPhase("stranger"), 1500);
  }, [phase]);

  if (showDashboard) {
    return (
      <div className="min-h-screen bg-[#0a0e1a] text-gray-200 flex items-center justify-center font-mono">
        <span className="text-red-500 text-sm tracking-widest uppercase">
          ● Dashboard — Loading
        </span>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen bg-black text-gray-200 font-sans selection:bg-red-900/50 ${
        phase === "boot" || phase === "tear" ? "overflow-hidden" : ""
      }`}
    >
      <MasterpieceStyles />

      {/* === ACT 1 & 2: TERMINAL & TV SHUTDOWN === */}
      {(phase === "boot" || phase === "tear") && (
        <div className="absolute inset-0 bg-black flex items-center justify-center overflow-hidden z-50">
          <div className="crt-overlay" />
          <div
            className={`w-full h-full crt-screen p-6 md:p-12 text-sm md:text-xl flex flex-col justify-start ${
              phase === "tear" ? "tv-turn-off" : ""
            }`}
          >
            <div className="whitespace-pre-wrap leading-relaxed">
              <span className="text-red-500 font-bold">Asttr0xSbijo@Kali</span>
              <span className="text-white">:</span>
              <span className="text-red-400">~</span>
              <span className="text-white"># </span>
              {terminalText}
              {showCursor && bootLogs.length === 0 && (
                <span className="cursor-blink bg-red-600 text-red-600 inline-block w-[10px] h-[20px] align-middle ml-1">_</span>
              )}
            </div>
            <div className="mt-2 flex flex-col gap-1">
              {bootLogs.map((log, index) => (
                <div key={index} className="text-red-500">{log}</div>
              ))}
              {showCursor && bootLogs.length > 0 && (
                <span className="cursor-blink bg-red-600 text-red-600 inline-block w-[10px] h-[20px] align-middle mt-1">_</span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* === ACT 3: ONE-PAGER LANDING === */}
      {(phase === "stranger" || phase === "void") && (
        <>
          {/* Fixed smoke */}
          {phase === "stranger" && (
            <div className="fixed inset-0 z-0 pointer-events-none">
              <SmokeBackground smokeColor="#dc2626" />
            </div>
          )}
          {phase === "stranger" && <SporesOverlay />}

          {/* Corner HUD decorations */}
          <div
            className="fixed top-4 left-4 text-red-900/40 font-mono text-[9px] uppercase tracking-widest z-30 pointer-events-none"
            style={{
              opacity: phase === "stranger" ? 1 : 0,
              transition: "opacity 1s ease-in-out",
              transitionDelay: phase === "stranger" ? "3s" : "0s",
            }}
          >
            SYS.OP. 74.241.250.61 ● REC
          </div>
          <div
            className="fixed bottom-4 right-4 text-red-900/40 font-mono text-[9px] uppercase tracking-widest text-right z-30 pointer-events-none"
            style={{
              opacity: phase === "stranger" ? 1 : 0,
              transition: "opacity 1s ease-in-out",
              transitionDelay: phase === "stranger" ? "3s" : "0s",
            }}
          >
            AUTH: M.T. SLIMANI & ISMAIL
            <br />
            ENSA BERRECHID
          </div>

          {/* Scrollable content */}
          <div className="relative z-20">

            {/* === HERO === */}
            <section className="min-h-screen flex flex-col items-center justify-center px-4 relative overflow-hidden">
              {/* Parallax wrapper */}
              <div ref={heroContentRef} className="text-center max-w-5xl w-full will-change-transform">
                <div className="min-h-[160px] md:min-h-[220px] flex items-center justify-center">
                  {phase === "stranger" && (
                    <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-8xl text-red-600 font-cinematic animate-stranger uppercase select-none whitespace-nowrap">
                      Tracks<span className="text-white">4</span>Hacks
                    </h1>
                  )}
                </div>
                <div
                  style={{
                    opacity: phase === "stranger" ? 1 : 0,
                    transition: "all 2s ease-out",
                    transitionDelay: phase === "stranger" ? "2.5s" : "0s",
                  }}
                >
                  <p className="mt-2 text-gray-300 text-sm md:text-base leading-relaxed max-w-xl mx-auto border-t border-red-900/20 pt-5">
                    A full-stack purple team simulation platform. Attacker terminal meets live SOC dashboard.
                  </p>
                  <p className="mt-3 font-mono text-[11px] text-red-400/60 tracking-[0.3em] uppercase">
                    ENSA Berrechid ● Red + Blue Team Exercise
                  </p>
                </div>
              </div>

              {/* Scroll indicator */}
              <div
                className="absolute bottom-8 left-1/2 -translate-x-1/2"
                style={{
                  opacity: phase === "stranger" ? 1 : 0,
                  transition: "opacity 1s ease-out",
                  transitionDelay: phase === "stranger" ? "4.5s" : "0s",
                }}
              >
                <ChevronDown size={18} className="text-red-400/50 animate-chevron" />
              </div>
            </section>

            {/* Smoke-to-dark gradient */}
            <div className="h-32 bg-gradient-to-b from-transparent to-[#0a0e1a] pointer-events-none" />

            {/* === CONTENT === */}
            <div className="bg-[#0a0e1a]">

              <SectionDivider />

              {/* --- ABOUT + TECH STACK --- */}
              <section className="py-24 lg:py-32 px-6 lg:px-16 xl:px-24 max-w-7xl mx-auto">

                {/* Description — full width */}
                <Reveal>
                  <div
                    className="border-l-2 border-red-600/50 pl-8 mb-14"
                    style={{ boxShadow: "-3px 0 20px rgba(220,38,38,0.1)" }}
                  >
                    <p className="font-mono text-[11px] text-red-400 tracking-[0.35em] uppercase mb-4">
                      ● PROJECT.OVERVIEW
                    </p>
                    <h2 className="font-cinematic text-white text-3xl md:text-5xl tracking-wide uppercase mb-3">
                      About
                    </h2>
                    <div className="w-20 h-px bg-gradient-to-r from-red-600 to-transparent mb-7" />
                    <p className="text-gray-300 text-base md:text-lg leading-relaxed max-w-3xl">
                      Tracks4Hacks is a full-stack purple team simulation platform that bridges
                      offensive attack emulation and defensive monitoring. Built for cybersecurity
                      training, it connects a live attack simulation terminal with a real-time SOC
                      dashboard powered by Wazuh SIEM and structured around the MITRE ATT&amp;CK
                      framework.
                    </p>
                  </div>
                </Reveal>

                {/* Tech stack — full-width grid panel */}
                <Reveal delay={120}>
                  <div className="border border-[#1f2937]">
                    <div className="border-b border-[#1f2937] px-5 py-3 flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-red-700/60" />
                      <span className="font-mono text-[11px] text-gray-400 tracking-widest uppercase">
                        SYSTEM.MANIFEST ● TECH_STACK.LOG
                      </span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 divide-x divide-y divide-[#1f2937]">
                      {TECH_STACK.map((item, i) => (
                        <div
                          key={i}
                          className="px-6 py-5 group hover:bg-red-950/10 transition-colors duration-150"
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-red-500 font-mono text-sm opacity-40 group-hover:opacity-100 transition-opacity">
                              ›
                            </span>
                            <span className="font-mono text-sm text-gray-100 tracking-wide">
                              {item.name}
                            </span>
                          </div>
                          <div>
                            <span className="font-mono text-xs text-gray-400">{item.meta}</span>
                            <span className="font-mono text-xs text-gray-500 ml-2">● {item.comment}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </Reveal>
              </section>

              {/* --- METRICS BAR --- */}
              <Reveal>
                <div className="border-y border-[#1f2937] bg-[#0d1117]">
                  <div className="max-w-7xl mx-auto px-6 lg:px-16 xl:px-24 py-6 flex items-center justify-center divide-x divide-[#1f2937]">
                    {[
                      { value: "14,823", label: "Alerts Processed" },
                      { value: "47", label: "Techniques Mapped" },
                      { value: "68%", label: "Detection Coverage" },
                    ].map((stat, i) => (
                      <div key={i} className="px-10 md:px-16 text-center">
                        <div className="font-cinematic text-white text-2xl md:text-3xl">{stat.value}</div>
                        <div className="font-mono text-[11px] text-gray-500 tracking-[0.2em] uppercase mt-1.5">{stat.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </Reveal>

              <SectionDivider />

              {/* --- FEATURES --- */}
              <section className="py-24 lg:py-32 px-6 lg:px-16 xl:px-24 max-w-7xl mx-auto">
                <Reveal className="text-center mb-16">
                  <h2 className="font-cinematic text-white text-3xl md:text-4xl tracking-wide uppercase">
                    System Capabilities
                  </h2>
                </Reveal>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {FEATURES.map((feature, i) => (
                    <div
                      key={i}
                      className={i === 6 ? "md:col-span-2 xl:col-span-1 xl:col-start-2" : ""}
                    >
                      <FeatureCard feature={feature} index={i} />
                    </div>
                  ))}
                </div>
              </section>

              <SectionDivider />

              {/* --- AUTHORS + CTA --- */}
              <section className="py-24 lg:py-32 px-6 lg:px-16 xl:px-24 max-w-7xl mx-auto">
                <Reveal className="text-center mb-16">
                  <h2 className="font-cinematic text-white text-3xl md:text-4xl tracking-wide uppercase">
                    Operatives
                  </h2>
                </Reveal>

                {/* Author cards */}
                <div className="flex flex-col md:flex-row justify-center gap-6 mb-12">
                  {AUTHORS.map((author, i) => (
                    <Reveal key={i} delay={i * 100} className="flex-1 max-w-sm mx-auto md:mx-0">
                      <div className="border-t-2 border-red-700/70 border-l border-r border-b border-[#1f2937] bg-[#111827] overflow-hidden">
                        {/* Photo + name row */}
                        <div className="px-6 pt-6 pb-5 flex items-center gap-5">
                          <img
                            src={author.avatar}
                            alt={author.name}
                            className="w-16 h-16 rounded-full border-2 border-red-900/40 object-cover shrink-0"
                          />
                          <div className="min-w-0">
                            <p className="font-mono text-[11px] text-red-400 tracking-[0.3em] uppercase mb-1">
                              Operative
                            </p>
                            <h3 className="font-cinematic text-white text-lg tracking-wide leading-tight">
                              {author.name}
                            </h3>
                            <p className="font-mono text-xs text-gray-400 mt-1">● {author.role}</p>
                          </div>
                        </div>
                        {/* Footer row */}
                        <div className="border-t border-[#1f2937] px-6 py-4 flex items-center justify-between">
                          <a
                            href={author.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 font-mono text-xs text-gray-300 hover:text-red-400 transition-colors duration-150 group"
                          >
                            <Github size={13} className="text-gray-500 group-hover:text-red-400 transition-colors" />
                            @{author.handle}
                          </a>
                          <span className="font-mono text-[11px] text-gray-500 tracking-widest uppercase">
                            ENSA Berrechid
                          </span>
                        </div>
                      </div>
                    </Reveal>
                  ))}
                </div>

                {/* CTA */}
                <Reveal className="text-center">
                  <p className="font-mono text-[10px] text-gray-400 tracking-[0.3em] uppercase mb-6">
                    ● Simulation environment ready. Authorization required.
                  </p>
                  <button
                    className="btn-classified px-10 py-4 font-mono text-xs tracking-[0.3em] font-bold"
                    onClick={() => setShowDashboard(true)}
                  >
                    Initialize Session
                  </button>
                </Reveal>
              </section>

              {/* Footer */}
              <div className="border-t border-[#1f2937] py-6 px-6">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2">
                  <span className="font-mono text-[10px] text-gray-600 tracking-widest">TRACKS4HACKS</span>
                  <span className="font-mono text-[10px] text-gray-600">M.T. SLIMANI & I. GARNAOUI — ENSA BERRECHID</span>
                  <span className="font-mono text-[10px] text-gray-600 tracking-widest uppercase">Educational / Non-Commercial</span>
                </div>
              </div>

            </div>
          </div>
        </>
      )}
    </div>
  );
}
