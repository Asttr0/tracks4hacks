import {
  BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine,
} from "recharts";
import { useTheme } from "../../../contexts/ThemeContext";
import { TOOL_COLORS, delayColor, getDelayLabel } from "./utils";

type MttdBar = { id: string; delay: number; tool: string; name: string };

const DELAY_LEGEND = [
  { l: "#16a34a", d: "#22c55e", label: "0–30s · Excellent" },
  { l: "#65a30d", d: "#84cc16", label: "30–60s · Bon" },
  { l: "#d97706", d: "#eab308", label: "60–90s · Passable" },
  { l: "#ea580c", d: "#f97316", label: "90–120s · Attention" },
];

const MttdTooltip = ({ active, payload, dark }: any) => {
  if (!active || !payload?.length) return null;
  const d = payload[0]?.payload;
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-lg dark:border-white/10 dark:bg-black/90 dark:backdrop-blur-sm">
      <p className="font-mono text-[10px] uppercase tracking-widest" style={{ color: TOOL_COLORS[d?.tool] }}>{d?.tool}</p>
      <p className="mt-1 font-mono text-sm font-bold" style={{ color: delayColor(d?.delay, dark) }}>{d?.delay}s</p>
      <p className="font-mono text-[9px] uppercase tracking-widest text-slate-400 dark:text-coffee-bean-200/40">{getDelayLabel(d?.delay)}</p>
    </div>
  );
};

export const MttdBarChart = ({ bars }: { bars: MttdBar[] }) => {
  const { theme } = useTheme();
  const dark = theme === "dark";
  const grid = dark ? "#ffffff08" : "#e2e8f0";
  const axis = dark ? "#ffffff15" : "#e2e8f0";
  const tick = dark ? "#666"      : "#94a3b8";

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-white/[0.06] dark:bg-black/20 dark:shadow-none dark:backdrop-blur-sm">
      <p className="mb-4 font-cinematic text-base uppercase tracking-[0.2em] text-slate-900 dark:text-coffee-bean-50">Délai de Détection par Événement</p>
      <div className="h-96">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={bars} barCategoryGap="18%" margin={{ top: 5, right: 10, left: 0, bottom: 90 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={grid} vertical={false} />
            <XAxis dataKey="name" stroke={axis} interval={0} height={90}
              tick={(props: { x: number; y: number; payload: { value: string } }) => (
                <g transform={`translate(${props.x},${props.y})`}>
                  <text x={0} y={0} dy={4} textAnchor="end" transform="rotate(-40)" fill={tick} fontSize={9} fontFamily="JetBrains Mono">
                    {props.payload.value}
                  </text>
                </g>
              )} />
            <YAxis stroke={axis} tick={{ fill: tick, fontSize: 10, fontFamily: "JetBrains Mono" }} domain={[0, 130]} />
            <Tooltip content={(props) => <MttdTooltip {...props} dark={dark} />} />
            <ReferenceLine y={120} stroke="#ef4444" strokeDasharray="4 4"
              label={{ value: "120s limite", position: "insideTopRight", fill: "#ef4444", fontSize: 10, fontFamily: "JetBrains Mono" }} />
            <Bar dataKey="delay" name="Délai (s)" radius={[4, 4, 0, 0]}>
              {bars.map((entry, i) => <Cell key={i} fill={delayColor(entry.delay, dark)} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5">
        <p className="mb-1 w-full font-mono text-[9px] uppercase tracking-widest text-slate-400 dark:text-coffee-bean-200/30">Légende — Qualité de détection</p>
        {DELAY_LEGEND.map((c) => (
          <span key={c.label} className="flex items-center gap-1.5 font-mono text-[10px] text-slate-500 dark:text-coffee-bean-200/50">
            <span className="size-2.5 rounded-sm" style={{ backgroundColor: dark ? c.d : c.l }} />{c.label}
          </span>
        ))}
      </div>
    </div>
  );
};
