import { useState, useEffect, useMemo } from "react";
import { SmokeBackground } from "./components/common/SmokeBackground";

// Styles cinématographiques sécurisés et optimisés
const MasterpieceStyles = () => (
  <style
    dangerouslySetInnerHTML={{
      __html: `
    @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700;900&display=swap');

    /* === PHASE 1 : CRT TERMINAL RETRO (Le terminal rouge) === */
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

    /* L'effet de la TV cathodique qui s'éteint */
    .tv-turn-off {
      animation: tv-off 0.6s cubic-bezier(0.23, 1, 0.32, 1) forwards;
    }
    @keyframes tv-off {
      0% { transform: scale(1, 1.3) translate3d(0, 0, 0); filter: brightness(1); }
      40% { transform: scale(1, 0.005) translate3d(0, 0, 0); filter: brightness(10); }
      100% { transform: scale(0, 0.005) translate3d(0, 0, 0); filter: brightness(0); opacity: 0; }
    }

    /* === EFFET STRANGER THINGS (La Révélation Lente) === */
    @keyframes stranger-reveal {
      0% { 
        opacity: 0; 
        filter: blur(20px); 
        transform: scale(0.8); 
        letter-spacing: 1.5em; 
        text-shadow: 0 0 50px red, 0 0 30px darkred; 
      }
      40% { 
        opacity: 1; 
        filter: blur(4px); 
        letter-spacing: 0.6em; 
        text-shadow: 0 0 30px red; 
      }
      100% { 
        opacity: 1; 
        filter: blur(0); 
        transform: scale(1.05); 
        letter-spacing: 0.1em; 
        text-shadow: 0 0 15px rgba(220, 38, 38, 0.8); 
      }
    }

    /* Spores flottantes */
    @keyframes float-spores {
      0% { transform: translateY(100vh) rotate(0deg); opacity: 0; }
      10% { opacity: 0.8; }
      90% { opacity: 0.5; }
      100% { transform: translateY(-100vh) rotate(360deg); opacity: 0; }
    }

    /* Lueur pulsante de fond */
    @keyframes abyss-glow {
      0%, 100% { opacity: 0.3; transform: scale(1); filter: brightness(1); }
      50% { opacity: 0.7; transform: scale(1.1); filter: brightness(1.5); }
    }

    /* Classes d'animation */
    .animate-stranger { animation: stranger-reveal 3s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }
    .abyss-bg { animation: abyss-glow 8s ease-in-out infinite; }
    
    /* Bouton d'agence secrète */
    .btn-classified {
      position: relative;
      background: transparent;
      border: 1px solid rgba(220, 38, 38, 0.4);
      color: rgba(255, 255, 255, 0.7);
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
      background: linear-gradient(90deg, transparent, rgba(220, 38, 38, 0.2), transparent);
      transition: left 0.5s ease;
    }
    .btn-classified:hover {
      border-color: rgba(220, 38, 38, 1);
      color: white;
      box-shadow: 0 0 20px rgba(220, 38, 38, 0.4) inset, 0 0 20px rgba(220, 38, 38, 0.4);
    }
    .btn-classified:hover::before { left: 100%; }

    /* Scanlines et Vignette ajustée pour petits écrans */
    .crt-overlay {
      background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06));
      background-size: 100% 3px, 3px 100%;
      position: absolute;
      top: 0; left: 0; right: 0; bottom: 0;
      pointer-events: none;
      z-index: 50;
      box-shadow: inset 0 0 60px rgba(0,0,0,0.8);
    }

    /* Typographie - Style "The Godfather" */
    .font-cinematic {
      font-family: 'Cinzel', 'Trajan Pro', 'Times New Roman', serif;
      font-weight: 900;
      letter-spacing: 0.05em;
    }
  `,
    }}
  />
);

// Génération de spores flottantes sécurisée
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
    <div className="absolute inset-0 z-10 overflow-hidden pointer-events-none">
      {spores.map((spore, i) => (
        <Spore key={i} spore={spore} />
      ))}
    </div>
  );
};

export default function App() {
  // Phases: 'boot' (Terminal vert) -> 'tear' (TV s'éteint) -> 'void' -> 'stranger'
  const [phase, setPhase] = useState("boot");
  const [terminalText, setTerminalText] = useState("");
  const [bootLogs, setBootLogs] = useState<string[]>([]);
  const [showCursor, setShowCursor] = useState(true);

  // Moteur de l'Intro (Terminal Vert)
  useEffect(() => {
    if (phase !== "boot") return;

    const cmd = "./Track4Hacks init";
    let i = 0;

    // Étape 1 : Taper la commande
    const typeWriter = setInterval(() => {
      if (i < cmd.length) {
        setTerminalText((prev) => prev + cmd.charAt(i));
        i++;
      } else {
        clearInterval(typeWriter);

        // Étape 2 : Lancer le script simulé (affichage des logs)
        setTimeout(() => {
          setBootLogs((prev) => [...prev, "[+] Booting Purple Team Engine..."]);
        }, 500);

        setTimeout(() => {
          setBootLogs((prev) => [...prev, "[+] Connecting to SOC SIEM..."]);
        }, 1200);

        setTimeout(() => {
          setBootLogs((prev) => [
            ...prev,
            "[+] Syncing MITRE ATT&CK Matrix...",
          ]);
        }, 1800);

        setTimeout(() => {
          setBootLogs((prev) => [...prev, "[+] Correlation Engine is ONLINE."]);
          setShowCursor(false);
        }, 2400);

        // Étape 3 : Déclencher l'extinction de la TV
        setTimeout(() => {
          setPhase("tear");
        }, 3200);
      }
    }, 80); // Vitesse de frappe

    return () => clearInterval(typeWriter);
  }, [phase]);

  // Gestionnaire des scènes cinématiques post-terminal
  useEffect(() => {
    if (phase === "tear") {
      setTimeout(() => setPhase("void"), 600); // Wait for tv-turn-off animation
    }
    if (phase === "void") {
      setTimeout(() => setPhase("stranger"), 1500);
    }
  }, [phase]);

  return (
    <div className="min-h-screen bg-black text-gray-200 font-sans overflow-hidden relative selection:bg-red-900/50">
      <MasterpieceStyles />
      <div className="crt-overlay"></div>

      {/* === ACTE 1 & 2 : RED TERMINAL & TV SHUTDOWN === */}
      {(phase === "boot" || phase === "tear") && (
        <div className="absolute inset-0 bg-black flex items-center justify-center overflow-hidden z-50">
          <div
            className={`w-full h-full crt-screen p-6 md:p-12 text-sm md:text-xl flex flex-col justify-start ${phase === "tear" ? "tv-turn-off" : ""}`}>
            <div className="whitespace-pre-wrap leading-relaxed">
              <span className="text-red-500 font-bold">Asttr0xSbijo@Kali</span>
              <span className="text-white"> : </span>
              <span className="text-red-400">~</span>
              <span className="text-white"># </span>
              {terminalText}
              {showCursor && bootLogs.length === 0 && (
                <span className="cursor-blink bg-red-600 text-red-600 inline-block w-[10px] h-[20px] align-middle ml-1">
                  _
                </span>
              )}
            </div>

            {/* Affichage des logs qui s'enchaînent */}
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

      {/* === ACTE 3 : STRANGER THINGS (Exactement la version demandée) === */}
      {(phase === "stranger" || phase === "void") && (
        <>
          {phase === "stranger" && (
            <div
              className="absolute inset-0 z-0 pointer-events-none opacity-100"
              style={{ transition: "opacity 3s ease-in-out" }}>
              <SmokeBackground smokeColor="#dc2626" />
            </div>
          )}
          {phase === "stranger" && <SporesOverlay />}

          <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
            <div className="max-w-5xl w-full px-4 text-center relative flex flex-col items-center">
              <div className="min-h-[180px] md:min-h-[240px] flex items-center justify-center w-full px-2">
                {phase === "stranger" && (
                  <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-8xl text-red-600 font-cinematic animate-stranger uppercase select-none whitespace-nowrap">
                    Tracks<span className="text-white">4</span>Hacks
                  </h1>
                )}
              </div>

              {/* Révélation du bouton avec styles en ligne pour sécuriser le délai */}
              <div
                className={
                  "mt-4 md:mt-8 ease-out " +
                  (phase === "stranger"
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-12")
                }
                style={{
                  transition: "all 3s ease-out",
                  transitionDelay: phase === "stranger" ? "2s" : "0s",
                }}>
                <p className="text-sm md:text-lg text-gray-400 font-light mb-8 max-w-2xl mx-auto leading-relaxed tracking-widest uppercase border-y border-red-900/30 py-4">
                  Tracer chaque pas du hacker <br />
                  <span className="text-red-700 font-mono text-[10px] md:text-xs">
                    Terminal Attaquant // Dashboard Défenseur
                  </span>
                </p>

                <button className="btn-classified px-6 md:px-10 py-3 md:py-4 font-mono text-[10px] md:text-xs tracking-[0.3em] font-bold">
                  Initialiser Corrélation
                </button>
              </div>
            </div>
          </div>

          <div
            className={
              "absolute top-4 left-4 text-red-900/50 font-mono text-[9px] md:text-[10px] uppercase tracking-widest " +
              (phase === "stranger" ? "opacity-100" : "opacity-0")
            }
            style={{
              transition: "opacity 1s ease-in-out",
              transitionDelay: phase === "stranger" ? "3s" : "0s",
            }}>
            SYS.OP. 74.241.250.61 // REC
          </div>
          <div
            className={
              "absolute bottom-4 right-4 text-red-900/50 font-mono text-[9px] md:text-[10px] uppercase tracking-widest text-right " +
              (phase === "stranger" ? "opacity-100" : "opacity-0")
            }
            style={{
              transition: "opacity 1s ease-in-out",
              transitionDelay: phase === "stranger" ? "3s" : "0s",
            }}>
            AUTH: M.T. SLIMANI & ISMAIL
            <br />
            ENSA BERRECHID
          </div>
        </>
      )}
    </div>
  );
}
