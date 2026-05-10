import { AlertCircle, Clock } from "lucide-react";
import { useTheme } from "../../../contexts/ThemeContext";
import type { MissReason, Severity } from "../../../types/coverage";
import { TOOL_COLORS, sevColors, SEVERITY_FR, type LucideIcon } from "./utils";

export const ToolBadge = ({ tool }: { tool: string }) => (
  <span className="inline-flex items-center rounded px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider"
    style={{
      backgroundColor: `${TOOL_COLORS[tool] ?? "#6b7280"}18`,
      color:           TOOL_COLORS[tool] ?? "#6b7280",
      border:          `1px solid ${TOOL_COLORS[tool] ?? "#6b7280"}50`,
    }}>
    {tool}
  </span>
);

const MISS_REASON: Record<MissReason, { Icon: LucideIcon; cls: string; label: string }> = {
  NO_RULE: { Icon: AlertCircle, cls: "border-red-200 bg-red-50 text-red-600 dark:border-red-500/40 dark:bg-red-500/10 dark:text-red-400", label: "SANS RÈGLE" },
  TIMEOUT: { Icon: Clock,       cls: "border-orange-200 bg-orange-50 text-orange-600 dark:border-orange-500/40 dark:bg-orange-500/10 dark:text-orange-400", label: "DÉLAI DÉPASSÉ" },
};
export const MissReasonBadge = ({ reason, delay }: { reason: MissReason; delay?: string }) => {
  const { Icon, cls, label } = MISS_REASON[reason];
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-widest ${cls}`}>
      <Icon size={9} />{label}{delay ? ` ${delay}` : ""}
    </span>
  );
};

export const SeverityBadge = ({ severity }: { severity: Severity }) => {
  const { theme } = useTheme();
  const c = sevColors(severity, theme === "dark");
  return (
    <span className="rounded px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider"
      style={{ backgroundColor: c.bg, color: c.text, border: `1px solid ${c.border}` }}>
      {SEVERITY_FR[severity]}
    </span>
  );
};
