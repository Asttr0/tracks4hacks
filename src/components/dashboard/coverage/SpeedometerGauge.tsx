import { useEffect, useRef } from "react";
import { useSpring, useMotionValueEvent } from "framer-motion";
import { useTheme } from "../../../contexts/ThemeContext";

// Pivot via the SVG-native `transform="rotate(a cx cy)"` attribute (set imperatively
// from a framer-motion spring) so the needle base is mathematically locked to (cx, cy).
const Needle = ({ cx, cy, length, targetRot }: {
  cx: number; cy: number; length: number; targetRot: number;
}) => {
  const ref = useRef<SVGGElement>(null);
  const rot = useSpring(targetRot, { stiffness: 90, damping: 18 });
  useEffect(() => { rot.set(targetRot); }, [targetRot, rot]);
  useMotionValueEvent(rot, "change", (v) => {
    ref.current?.setAttribute("transform", `rotate(${v.toFixed(3)} ${cx} ${cy})`);
  });

  return (
    <g ref={ref} transform={`rotate(${targetRot} ${cx} ${cy})`}>
      <path d={`M ${cx - 4} ${cy + 1} L ${cx} ${cy - length + 1} L ${cx + 4} ${cy + 1} Z`} fill="rgba(0,0,0,0.35)" />
      <path d={`M ${cx - 3.5} ${cy} L ${cx} ${cy - length} L ${cx + 3.5} ${cy} Z`}
        fill="#1e293b" stroke="rgba(255,255,255,0.18)" strokeWidth={0.6} strokeLinejoin="round" />
      <line x1={cx} y1={cy - length + 18} x2={cx} y2={cy - length}
        stroke="rgba(255,255,255,0.65)" strokeWidth={1.2} strokeLinecap="round" />
    </g>
  );
};

export const SpeedometerGauge = ({ value }: { value: number }) => {
  const { theme } = useTheme();
  const dark = theme === "dark";
  const cx = 150, cy = 152, OR = 108, IR = 80, NL = 76;

  const toRad = (d: number) => (d * Math.PI) / 180;
  const pt = (deg: number, r: number) => ({
    x: +(cx + r * Math.cos(toRad(deg))).toFixed(2),
    y: +(cy - r * Math.sin(toRad(deg))).toFixed(2),
  });

  const sector = (d1: number, d2: number, fill: string) => {
    const o1 = pt(d1, OR), o2 = pt(d2, OR), i1 = pt(d1, IR), i2 = pt(d2, IR);
    const laf = d1 - d2 > 180 ? 1 : 0;
    const path = [`M ${o1.x} ${o1.y}`, `A ${OR} ${OR} 0 ${laf} 1 ${o2.x} ${o2.y}`,
      `L ${i2.x} ${i2.y}`, `A ${IR} ${IR} 0 ${laf} 0 ${i1.x} ${i1.y}`, "Z"].join(" ");
    return <path key={d1} d={path} fill={fill} />;
  };

  const targetRot = -90 + (value / 100) * 180;
  const majorTicks = Array.from({ length: 11 }, (_, i) => ({
    deg: 180 - i * 18, val: i * 10,
    inner: pt(180 - i * 18, OR + 1), outer: pt(180 - i * 18, OR + 10), label: pt(180 - i * 18, OR + 22),
  }));
  const subTicks = Array.from({ length: 50 }, (_, i) => {
    if ((i + 1) % 5 === 0) return null;
    const deg = 180 - (i + 1) * 3.6;
    return { deg, a: pt(deg, OR + 2), b: pt(deg, OR + 7) };
  }).filter((t): t is { deg: number; a: { x: number; y: number }; b: { x: number; y: number } } => t !== null);

  const c = dark
    ? { backdrop: "rgba(255,255,255,0.04)", gap: "#0a0a0a", tick: "rgba(0,0,0,0.5)",  sub: "rgba(0,0,0,0.45)",  label: "rgba(255,255,255,0.75)", hub: "#0f172a", hubStroke: "rgba(255,255,255,0.13)", hubMid: "#334155", hubDot: "rgba(255,255,255,0.8)", value: "white",   subValue: "rgba(255,255,255,0.35)", caption: "rgba(255,255,255,0.22)" }
    : { backdrop: "rgba(0,0,0,0.04)",        gap: "white",   tick: "rgba(0,0,0,0.4)",  sub: "rgba(0,0,0,0.28)",  label: "rgba(30,41,59,0.72)",    hub: "#1e293b", hubStroke: "white",                    hubMid: "#475569", hubDot: "white",                  value: "#1e293b", subValue: "rgba(30,41,59,0.45)",   caption: "rgba(30,41,59,0.3)" };

  return (
    <svg viewBox="0 0 300 188" className="w-full" style={{ maxHeight: 225 }}>
      {sector(180, 0, c.backdrop)}
      {sector(180, 126, "#22c55e")}
      {sector(126,  54, "#eab308")}
      {sector( 54,   0, "#ef4444")}
      {[126, 54].map((deg) => (
        <line key={deg} x1={pt(deg, IR - 1).x} y1={pt(deg, IR - 1).y}
          x2={pt(deg, OR + 2).x} y2={pt(deg, OR + 2).y} stroke={c.gap} strokeWidth={2.5} />
      ))}
      {subTicks.map((t) => (
        <line key={t.deg} x1={t.a.x} y1={t.a.y} x2={t.b.x} y2={t.b.y} stroke={c.sub} strokeWidth={1} />
      ))}
      {majorTicks.map(({ deg, inner, outer, label, val }) => (
        <g key={deg}>
          <line x1={inner.x} y1={inner.y} x2={outer.x} y2={outer.y} stroke={c.tick} strokeWidth={2} />
          <text x={label.x} y={label.y} textAnchor="middle" dominantBaseline="middle"
            fill={c.label} fontSize={7.5} fontFamily="JetBrains Mono" fontWeight="600">{val}</text>
        </g>
      ))}
      <Needle cx={cx} cy={cy} length={NL} targetRot={targetRot} />
      <circle cx={cx} cy={cy} r={13} fill={c.hub} stroke={c.hubStroke} strokeWidth={1.5} />
      <circle cx={cx} cy={cy} r={5.5} fill={c.hubMid} stroke="rgba(255,255,255,0.3)" strokeWidth={1} />
      <circle cx={cx} cy={cy} r={2.2} fill={c.hubDot} />
      <text x={cx} y={cy + 30} textAnchor="middle" fill={c.value}
        fontSize={21} fontFamily="JetBrains Mono" fontWeight="bold">{value} %</text>
      <text x={cx} y={cy + 46} textAnchor="middle" fill={c.subValue}
        fontSize={8} fontFamily="JetBrains Mono" letterSpacing="0.12em">TAUX DE DÉTECTION</text>
      <text x={cx} y={cy + 58} textAnchor="middle" fill={c.caption}
        fontSize={7} fontFamily="JetBrains Mono" letterSpacing="0.08em">attaques détectées / total</text>
    </svg>
  );
};
