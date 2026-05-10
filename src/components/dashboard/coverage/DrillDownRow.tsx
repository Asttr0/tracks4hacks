import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ChevronDown, CheckCircle2, Target, Shield } from "lucide-react";
import { useTheme } from "../../../contexts/ThemeContext";
import type { DetectedAttack } from "../../../types/coverage";
import { ToolBadge, SeverityBadge } from "./Badges";
import { DelayBar } from "./DelayBar";
import { CorrelationSide } from "./CorrelationSide";
import { delayColor, getDelayLabel } from "./utils";

export const DrillDownRow = ({ atk, index }: { atk: DetectedAttack; index: number }) => {
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
                  <CorrelationSide
                    tone="red" Icon={Target} title="Red Team — Attaque" subId={atk.id}
                    rows={[
                      { label: "Horodatage", value: atk.time, mono: true },
                      { label: "Outil",      value: <ToolBadge tool={atk.tool} /> },
                      { label: "Technique",  value: `${atk.technique} — ${atk.techniqueName}` },
                      { label: "IP Source",  value: atk.sourceIp, mono: true },
                      { label: "IP Cible",   value: atk.targetIp, mono: true },
                    ]}
                    footerLabel="Commande"
                    footer={<code className="break-all font-mono text-[10px] leading-relaxed text-slate-700 dark:text-coffee-bean-100">{atk.command}</code>}
                  />
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
                  <CorrelationSide
                    tone="blue" Icon={Shield} title="Wazuh — Alerte" subId={atk.alert.id}
                    rows={[
                      { label: "Horodatage", value: atk.alert.time, mono: true },
                      { label: "ID Règle",   value: `#${atk.alert.ruleId}`, mono: true },
                      { label: "Règle",      value: atk.alert.ruleName },
                      { label: "Agent",      value: atk.alert.agent, mono: true },
                      { label: "Sévérité",   value: <SeverityBadge severity={atk.alert.severity} /> },
                    ]}
                    footerLabel="Description"
                    footer={<p className="font-mono text-[10px] leading-relaxed text-slate-700 dark:text-coffee-bean-100">{atk.alert.description}</p>}
                  />
                </div>
              </div>
            </td>
          </motion.tr>
        )}
      </AnimatePresence>
    </>
  );
};
