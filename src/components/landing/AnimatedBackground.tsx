import { motion, useScroll, useTransform } from "framer-motion";
import { useTheme } from "../../contexts/ThemeContext";

/**
 * Two-layer background:
 *  - Layer A (smoke / red glows) — visible during the hero (0..100vh)
 *  - Layer B (theme-aware clean background) — fades in once we pass the hero
 *
 * The transition happens between scrollY = 60vh and 110vh.
 */
export const AnimatedBackground = () => {
  const { theme } = useTheme();
  const { scrollY } = useScroll();

  // Layer A fades out as user scrolls past hero
  const heroOpacity = useTransform(scrollY, [0, 400, 700], [1, 0.8, 0]);
  // Layer B fades in
  const contentOpacity = useTransform(scrollY, [400, 700, 900], [0, 0.7, 1]);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* === Layer A : hero atmosphere (red blobs) === */}
      <motion.div className="absolute inset-0 bg-[#050507]" style={{ opacity: heroOpacity }}>
        <motion.div
          className="absolute top-[-10%] left-[-10%] w-[55%] h-[55%] rounded-full bg-red-600/15 blur-[120px]"
          animate={{ x: [0, 60, 0], y: [0, 40, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-[-15%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-600/10 blur-[120px]"
          animate={{ x: [0, -50, 0], y: [0, -30, 0] }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-[40%] right-[20%] w-[35%] h-[35%] rounded-full bg-blue-600/10 blur-[120px]"
          animate={{ x: [0, 40, 0], y: [0, -50, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>

      {/* === Layer B : theme-aware clean background === */}
      <motion.div
        className={`absolute inset-0 ${
          theme === "dark"
            ? "bg-[#0a0a0f]"
            : "bg-gradient-to-b from-slate-50 via-white to-slate-100"
        }`}
        style={{ opacity: contentOpacity }}
      >
        {/* Grid */}
        <div
          className="absolute inset-0"
          style={{
            opacity: theme === "dark" ? 0.06 : 0.5,
            backgroundImage:
              theme === "dark"
                ? "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)"
                : "linear-gradient(rgba(0,0,0,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.06) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
            maskImage: "radial-gradient(ellipse at center, black 30%, transparent 75%)",
          }}
        />
        {/* Subtle accent glows — softer in light mode */}
        <div
          className={`absolute top-[20%] left-[10%] w-[40%] h-[40%] rounded-full blur-[140px] ${
            theme === "dark" ? "bg-red-600/8" : "bg-red-500/15"
          }`}
        />
        <div
          className={`absolute bottom-[10%] right-[5%] w-[35%] h-[35%] rounded-full blur-[140px] ${
            theme === "dark" ? "bg-purple-600/8" : "bg-purple-500/12"
          }`}
        />
      </motion.div>
    </div>
  );
};
