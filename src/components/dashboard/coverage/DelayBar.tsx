import { motion } from "framer-motion";
import { useTheme } from "../../../contexts/ThemeContext";
import { delayColor, getDelayLabel } from "./utils";

export const DelayBar = ({ delay }: { delay: number }) => {
  const { theme } = useTheme();
  const dark  = theme === "dark";
  const color = delayColor(delay, dark);
  const pct   = Math.min((delay / 120) * 100, 100);
  return (
    <div className="flex min-w-[190px] items-center gap-3">
      <div className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-slate-200 dark:bg-white/5">
        <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          className="absolute inset-y-0 left-0 rounded-full" style={{ backgroundColor: color }} />
      </div>
      <span className="shrink-0 font-mono text-xs tabular-nums text-slate-700 dark:text-coffee-bean-100">{delay}s</span>
      <span className="shrink-0 font-mono text-[9px] uppercase tracking-wider" style={{ color }}>{getDelayLabel(delay)}</span>
    </div>
  );
};
