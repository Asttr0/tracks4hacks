import { HTMLAttributes } from "react";
import { clsx } from "../../lib/clsx";

export type Severity = "info" | "low" | "medium" | "high" | "critical";

const palette: Record<Severity, string> = {
  info: "bg-blue-500/15 text-blue-600 dark:text-blue-300",
  low: "bg-green-500/15 text-green-600 dark:text-green-300",
  medium: "bg-amber-500/15 text-amber-600 dark:text-amber-300",
  high: "bg-orange-500/15 text-orange-600 dark:text-orange-300",
  critical: "bg-red-500/15 text-red-600 dark:text-red-300",
};

const labels: Record<Severity, string> = {
  info: "Info",
  low: "Low",
  medium: "Medium",
  high: "High",
  critical: "Critical",
};

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  severity: Severity;
}

export const Badge = ({ severity, className, children, ...rest }: BadgeProps) => (
  <span
    className={clsx(
      "rounded-sm px-1.5 py-0.5 font-mono text-[10px] tracking-widest uppercase",
      palette[severity],
      className,
    )}
    {...rest}
  >
    {children ?? labels[severity]}
  </span>
);
