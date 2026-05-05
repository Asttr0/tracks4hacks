import { clsx } from "../../lib/clsx";

type Tone = "online" | "warn" | "offline" | "live";

const palette: Record<Tone, { dot: string; glow: string; label: string }> = {
  online: { dot: "bg-green-500", glow: "shadow-[0_0_8px_rgba(34,197,94,0.7)]", label: "text-green-600 dark:text-green-300" },
  warn: { dot: "bg-amber-500", glow: "shadow-[0_0_8px_rgba(245,158,11,0.7)]", label: "text-amber-600 dark:text-amber-300" },
  offline: { dot: "bg-gray-500", glow: "", label: "text-gray-500 dark:text-gray-400" },
  live: { dot: "bg-red-500", glow: "shadow-[0_0_10px_rgba(239,68,68,0.8)]", label: "text-red-600 dark:text-red-400" },
};

interface StatusDotProps {
  tone?: Tone;
  label?: string;
  className?: string;
}

export const StatusDot = ({ tone = "online", label, className }: StatusDotProps) => {
  const c = palette[tone];
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1.5 font-mono text-[10px] tracking-[0.3em] uppercase",
        c.label,
        className,
      )}
    >
      <span className={clsx("size-1.5 rounded-full", c.dot, c.glow)} />
      {label}
    </span>
  );
};
