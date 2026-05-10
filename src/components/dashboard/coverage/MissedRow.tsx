import { motion } from "framer-motion";
import type { MissedAttack } from "../../../types/coverage";
import { ToolBadge, MissReasonBadge } from "./Badges";

export const MissedRow = ({ atk, index }: { atk: MissedAttack; index: number }) => (
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
