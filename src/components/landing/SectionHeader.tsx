import { motion } from "framer-motion";
import { fadeUp, viewport } from "./anim";

interface SectionHeaderProps {
  eyebrow: string;
  title: string;
  description?: string;
  align?: "left" | "center";
}

export const SectionHeader = ({ eyebrow, title, description, align = "left" }: SectionHeaderProps) => (
  <motion.div
    variants={fadeUp}
    initial="hidden"
    whileInView="show"
    viewport={viewport}
    className={`max-w-3xl ${align === "center" ? "mx-auto text-center" : ""}`}
  >
    <p className="font-mono text-[11px] text-red-600 dark:text-red-400 tracking-[0.35em] uppercase mb-4">
      ● {eyebrow}
    </p>
    <h2 className="font-cinematic text-slate-900 dark:text-white text-3xl md:text-5xl tracking-wide uppercase mb-4">
      {title}
    </h2>
    <div
      className={`w-24 h-px bg-gradient-to-r from-red-600 via-red-500/40 to-transparent mb-6 ${
        align === "center" ? "mx-auto" : ""
      }`}
    />
    {description && (
      <p className="text-slate-600 dark:text-gray-400 text-base md:text-lg leading-relaxed">{description}</p>
    )}
  </motion.div>
);
