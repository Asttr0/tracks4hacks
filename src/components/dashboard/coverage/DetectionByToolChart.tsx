import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { useTheme } from "../../../contexts/ThemeContext";
import { TOOL_COLORS, groupByTool } from "./utils";
import type { DetectedAttack } from "../../../types/coverage";

const ToolTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  const d = payload[0]?.payload;
  const color = TOOL_COLORS[d?.name] ?? "#888";
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-lg dark:border-white/10 dark:bg-black/90 dark:backdrop-blur-sm">
      <p className="font-mono text-[10px] font-bold uppercase tracking-wider" style={{ color }}>{d?.name}</p>
      <p className="mt-1 font-mono text-xs text-slate-600 dark:text-coffee-bean-100">{d?.attacks} attaque{d?.attacks > 1 ? "s" : ""} détectée{d?.attacks > 1 ? "s" : ""}</p>
    </div>
  );
};

export const DetectionByToolChart = ({ detected }: { detected: DetectedAttack[] }) => {
  const { theme } = useTheme();
  const dark = theme === "dark";
  const byTool = groupByTool(detected);
  const total = byTool.reduce((s, d) => s + d.attacks, 0);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-white/[0.06] dark:bg-black/20 dark:shadow-none dark:backdrop-blur-sm">
      <p className="mb-4 font-cinematic text-base uppercase tracking-[0.2em] text-slate-900 dark:text-coffee-bean-50">Détection par Outil Red Team</p>
      <div className="grid grid-cols-[1.4fr_1fr] items-center gap-2">
        <div className="relative h-60">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip content={<ToolTooltip />} />
              <Pie data={byTool} dataKey="attacks" nameKey="name"
                cx="50%" cy="50%" innerRadius={62} outerRadius={100} paddingAngle={1}
                stroke={dark ? "#0a0a0a" : "white"} strokeWidth={2}
                isAnimationActive animationBegin={0} animationDuration={1000}>
                {byTool.map((d, i) => (
                  <Cell key={i} fill={TOOL_COLORS[d.name] ?? "#888"} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <p className="font-mono text-2xl font-bold tabular-nums text-slate-900 dark:text-coffee-bean-50">{total}</p>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-400 dark:text-coffee-bean-200/45">Détectées</p>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          {byTool.map((d) => {
            const color = TOOL_COLORS[d.name] ?? "#888";
            return (
              <div key={d.name} className="flex items-center gap-2.5">
                <span className="size-3 shrink-0 rounded-full" style={{ backgroundColor: color }} />
                <span className="flex-1 truncate font-mono text-xs capitalize text-slate-700 dark:text-coffee-bean-100">{d.name}</span>
                <span className="font-mono text-[10px] tabular-nums text-slate-400 dark:text-coffee-bean-200/45">{d.attacks}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
