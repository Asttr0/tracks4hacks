import { useState, useEffect, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { SmokeBackground } from "../components/common/SmokeBackground";
import { ThemeToggle } from "../components/landing/ThemeToggle";
import { AnimatedBackground } from "../components/landing/AnimatedBackground";
import { About } from "../components/landing/About";
import { SecurityTools } from "../components/landing/SecurityTools";
import { TechStack } from "../components/landing/TechStack";
import { ArchitectureDiagram } from "../components/landing/ArchitectureDiagram";
import { Features } from "../components/landing/Features";
import { WebMeetsCyber } from "../components/landing/WebMeetsCyber";
import { Authors } from "../components/landing/Authors";
import { CTASection } from "../components/landing/CTASection";
import { LandingFooter } from "../components/landing/LandingFooter";

// ---- Styles ----
const MasterpieceStyles = () => (
  <style
    dangerouslySetInnerHTML={{
      __html: `
    @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700;900&family=JetBrains+Mono:wght@300;400;500&family=Inter:wght@300;400;500;600;700&display=swap');

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
      10%  { opacity: 1; }
      90%  { opacity: 0.85; }
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

    body, html {
      font-family: 'Inter', system-ui, -apple-system, sans-serif;
    }

    .font-mono, [class*="font-mono"] {
      font-family: 'JetBrains Mono', 'Courier New', monospace !important;
    }

    @keyframes chevron-bounce {
      0%, 100% { transform: translateY(0); opacity: 0.4; }
      50%       { transform: translateY(6px); opacity: 0.9; }
    }
    .animate-chevron { animation: chevron-bounce 2s ease-in-out infinite; }

    @keyframes pulse-dot {
      0%, 100% { opacity: 1; transform: scale(1); }
      50%       { opacity: 0.55; transform: scale(0.85); }
    }

    /* Scrollbar — dark mode */
    .dark ::-webkit-scrollbar { width: 8px; height: 8px; }
    .dark ::-webkit-scrollbar-track { background: #050507; }
    .dark ::-webkit-scrollbar-thumb { background: linear-gradient(180deg, #7f1d1d, #450a0a); border-radius: 8px; }
    .dark ::-webkit-scrollbar-thumb:hover { background: linear-gradient(180deg, #b91c1c, #7f1d1d); }
    .dark * { scrollbar-color: #7f1d1d #050507; scrollbar-width: thin; }

    /* Scrollbar — light mode */
    .light ::-webkit-scrollbar { width: 8px; height: 8px; }
    .light ::-webkit-scrollbar-track { background: #f1f5f9; }
    .light ::-webkit-scrollbar-thumb { background: linear-gradient(180deg, #dc2626, #991b1b); border-radius: 8px; }
    .light ::-webkit-scrollbar-thumb:hover { background: linear-gradient(180deg, #ef4444, #b91c1c); }
    .light * { scrollbar-color: #dc2626 #f1f5f9; scrollbar-width: thin; }

    html { scroll-behavior: smooth; }

    /* Theme-aware body bg as fallback before AnimatedBackground mounts */
    .light body { background: #f8fafc; }
    .dark body { background: #050507; }
  `,
    }}
  />
);

// ---- Spores (hero only, fades on scroll) ----
type SporeData = { size: number; left: number; duration: number; delay: number };

const Spore = ({ spore }: { spore: SporeData }) => (
  <div
    className="absolute bg-red-500 rounded-full opacity-0 pointer-events-none"
    style={{
      width: spore.size + "px",
      height: spore.size + "px",
      left: spore.left + "%",
      boxShadow: `0 0 ${spore.size * 2}px rgba(239,68,68,0.9)`,
      willChange: "transform, opacity",
      animation: `float-spores ${spore.duration}s linear ${spore.delay}s infinite`,
    }}
  />
);

const SporesOverlay = () => {
  const spores = useMemo(
    () =>
      Array.from({ length: 70 }).map(() => ({
        size: Math.random() * 3.5 + 1.5,
        left: Math.random() * 100,
        duration: Math.random() * 14 + 12,
        delay: Math.random() * -30,
      })),
    [],
  );
  return (
    <div
      className="fixed inset-0 z-10 overflow-hidden pointer-events-none"
      style={{
        opacity: 0.95,
        transform: "translateZ(0)",
        contain: "strict",
      }}
    >
      {spores.map((spore, i) => (
        <Spore key={i} spore={spore} />
      ))}
    </div>
  );
};

// Smoke wrapper that fades out on scroll
const FadingSmoke = () => {
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 400, 700], [1, 0.5, 0]);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    const unsub = scrollY.on("change", (v) => setPaused(v >= 700));
    return () => unsub();
  }, [scrollY]);
  return (
    <motion.div
      style={{ opacity, willChange: "opacity", transform: "translateZ(0)" }}
      className="fixed inset-0 z-0 pointer-events-none"
    >
      <SmokeBackground smokeColor="#dc2626" paused={paused} />
    </motion.div>
  );
};

// ---- Main App ----
export default function Landing() {
  const navigate = useNavigate();
  const [phase, setPhase] = useState("boot");
  const [terminalText, setTerminalText] = useState("");
  const [bootLogs, setBootLogs] = useState<string[]>([]);
  const [showCursor, setShowCursor] = useState(true);
  const heroContentRef = useRef<HTMLDivElement>(null);

  // Hero parallax on scroll
  useEffect(() => {
    if (phase !== "stranger") return;
    const onScroll = () => {
      if (heroContentRef.current) {
        const offset = Math.min(window.scrollY * 0.4, 200);
        heroContentRef.current.style.transform = `translateY(${offset}px)`;
        heroContentRef.current.style.opacity = String(Math.max(1 - window.scrollY / 600, 0));
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
    if (phase === "void") setTimeout(() => setPhase("stranger"), 500);
  }, [phase]);

  const launchDashboard = () => {
    navigate("/dashboard");
  };

  const isLanding = phase === "stranger" || phase === "void";

  return (
    <div
      id="top"
      className={`min-h-screen text-slate-900 dark:text-gray-200 font-sans selection:bg-red-500/30 dark:selection:bg-red-900/50 ${
        phase === "boot" || phase === "tear" ? "overflow-hidden bg-black" : ""
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
                <span className="cursor-blink bg-red-600 text-red-600 inline-block w-[10px] h-[20px] align-middle ml-1">
                  _
                </span>
              )}
            </div>
            <div className="mt-2 flex flex-col gap-1">
              {bootLogs.map((log, index) => (
                <div key={index} className="text-red-500">
                  {log}
                </div>
              ))}
              {showCursor && bootLogs.length > 0 && (
                <span className="cursor-blink bg-red-600 text-red-600 inline-block w-[10px] h-[20px] align-middle mt-1">
                  _
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* === ACT 3: LANDING PAGE === */}
      {isLanding && (
        <>
          <AnimatedBackground />

          <FadingSmoke />
          {phase === "stranger" && <SporesOverlay />}

          <div className="fixed top-4 right-4 z-[60]">
            <ThemeToggle />
          </div>

          <main className="relative z-20">
            {/* === HERO === */}
            <section className="min-h-screen flex flex-col items-center justify-center px-4 relative overflow-hidden">
              <div
                ref={heroContentRef}
                className="text-center max-w-5xl w-full will-change-transform"
              >
                <div className="min-h-[160px] md:min-h-[220px] flex items-center justify-center">
                  {phase === "stranger" && (
                    <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-8xl text-red-600 font-cinematic animate-stranger uppercase select-none whitespace-nowrap">
                      Tracks<span className="text-white">4</span>Hacks
                    </h1>
                  )}
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: phase === "stranger" ? 1 : 0, y: 0 }}
                  transition={{ duration: 1.5, delay: 2.5 }}
                  className="relative"
                >
                  {/* Decorative side brackets */}
                  <div className="flex items-center justify-center gap-4 mt-6">
                    <motion.span
                      initial={{ scaleX: 0, opacity: 0 }}
                      animate={{ scaleX: phase === "stranger" ? 1 : 0, opacity: phase === "stranger" ? 1 : 0 }}
                      transition={{ duration: 1.2, delay: 3 }}
                      className="block h-px w-16 md:w-24 origin-right"
                      style={{
                        background: "linear-gradient(90deg, transparent, rgba(239,68,68,0.7))",
                      }}
                    />
                    <motion.span
                      animate={{ scale: [1, 1.4, 1], opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                      className="block w-1.5 h-1.5 rounded-full bg-red-500"
                      style={{ boxShadow: "0 0 12px #ef4444" }}
                    />
                    <motion.span
                      initial={{ scaleX: 0, opacity: 0 }}
                      animate={{ scaleX: phase === "stranger" ? 1 : 0, opacity: phase === "stranger" ? 1 : 0 }}
                      transition={{ duration: 1.2, delay: 3 }}
                      className="block h-px w-16 md:w-24 origin-left"
                      style={{
                        background: "linear-gradient(90deg, rgba(239,68,68,0.7), transparent)",
                      }}
                    />
                  </div>

                  <p className="mt-5 text-base md:text-lg text-gray-300 leading-relaxed max-w-xl mx-auto">
                    Tracer chaque pas — du shell de l'attaquant à l'alerte du
                    défenseur, sur un seul tableau de bord.
                  </p>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: phase === "stranger" ? 1 : 0, y: 0 }}
                    transition={{ duration: 1, delay: 3.6 }}
                    className="mt-8 inline-flex items-stretch divide-x divide-white/10 rounded-md border border-white/10 bg-black/40 backdrop-blur-sm overflow-hidden font-mono text-[10px] tracking-[0.28em] uppercase"
                  >
                    {[
                      { label: "Wazuh SIEM",    state: "Online",  color: "#22c55e" },
                      { label: "Suricata IDS",  state: "Active",  color: "#22c55e" },
                      { label: "ATT&CK v14",    state: "14 / 14", color: "#22c55e" },
                      { label: "Stream",        state: "Live",    color: "#ef4444" },
                    ].map(({ label, state, color }) => (
                      <span
                        key={label}
                        className="flex items-center gap-2.5 px-4 py-2.5"
                      >
                        <span
                          className="block w-1.5 h-1.5 rounded-full shrink-0"
                          style={{
                            background: color,
                            boxShadow: `0 0 8px ${color}, 0 0 2px ${color}`,
                            animation: "pulse-dot 1.8s ease-in-out infinite",
                          }}
                        />
                        <span className="text-gray-400">{label}</span>
                        <span className="text-white/85" style={{ color }}>
                          {state}
                        </span>
                      </span>
                    ))}
                  </motion.div>
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: phase === "stranger" ? 1 : 0 }}
                transition={{ delay: 4.5, duration: 1 }}
                className="absolute bottom-8 left-1/2 -translate-x-1/2"
              >
                <ChevronDown size={18} className="text-red-400/50 animate-chevron" />
              </motion.div>
            </section>

            <WebMeetsCyber />
            <About />
            <SecurityTools />
            <TechStack />
            <ArchitectureDiagram />
            <Features />
            <Authors />
            <CTASection onLaunch={launchDashboard} />
            <LandingFooter />
          </main>
        </>
      )}
    </div>
  );
}
