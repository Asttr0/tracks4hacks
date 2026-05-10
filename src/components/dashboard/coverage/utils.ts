// Color scales, severity tables and aggregation helpers shared across
// the Coverage Scoreboard components.

import type { AlertCircle } from "lucide-react";
import type { DetectedAttack, Severity } from "../../../types/coverage";

export type LucideIcon = typeof AlertCircle;

export const TOOL_COLORS: Record<string, string> = {
  nmap: "#3b82f6", hydra: "#f97316", gobuster: "#a855f7",
  metasploit: "#ef4444", netexec: "#06b6d4",
  sudo: "#db2777", python3: "#0d9488", wget: "#4f46e5", useradd: "#d97706",
};

// Hex base + light/dark text variant per severity → bg/border are derived (hex+alpha).
export const SEV: Record<Severity, { hex: string; textDark: string }> = {
  LOW:      { hex: "#3b82f6", textDark: "#60a5fa" },
  MEDIUM:   { hex: "#eab308", textDark: "#fbbf24" },
  HIGH:     { hex: "#f97316", textDark: "#fb923c" },
  CRITICAL: { hex: "#ef4444", textDark: "#f87171" },
};
export const SEV_TEXT_LIGHT: Record<Severity, string> = {
  LOW: "#2563eb", MEDIUM: "#d97706", HIGH: "#ea580c", CRITICAL: "#dc2626",
};
export const sevColors = (s: Severity, dark: boolean) => ({
  bg:     `${SEV[s].hex}${dark ? "11" : "10"}`,
  border: `${SEV[s].hex}${dark ? "44" : "40"}`,
  text:   dark ? SEV[s].textDark : SEV_TEXT_LIGHT[s],
});

export const SEVERITY_FR: Record<Severity, string> = {
  LOW: "FAIBLE", MEDIUM: "MOYEN", HIGH: "ÉLEVÉ", CRITICAL: "CRITIQUE",
};

// (threshold, light, dark, label) tuples — color picked by first delay < threshold.
const DELAY_SCALE: [number, string, string, string][] = [
  [30,       "#16a34a", "#22c55e", "EXCELLENT"],
  [60,       "#65a30d", "#84cc16", "BON"],
  [90,       "#d97706", "#eab308", "PASSABLE"],
  [120,      "#ea580c", "#f97316", "ATTENTION"],
  [Infinity, "#dc2626", "#ef4444", "ATTENTION"],
];
export const delayColor = (d: number, dark: boolean) =>
  DELAY_SCALE.find(([t]) => d < t)![dark ? 2 : 1] as string;
export const getDelayLabel = (d: number) =>
  DELAY_SCALE.find(([t]) => d < t)![3] as string;

export const groupByTool = (detected: readonly DetectedAttack[]) => {
  const m = new Map<string, { tool: string; count: number; total: number }>();
  for (const d of detected) {
    const cur = m.get(d.tool) ?? { tool: d.tool, count: 0, total: 0 };
    cur.count += 1; cur.total += d.delaySeconds;
    m.set(d.tool, cur);
  }
  return [...m.values()]
    .map((x) => ({ ...x, name: x.tool, attacks: x.count, avgDelay: Math.round(x.total / x.count) }))
    .sort((a, b) => b.count - a.count);
};
