import { type ReactNode } from "react";
import { motion } from "framer-motion";
import type { LucideIcon } from "./utils";

const TONE = {
  red:    { wrap: "border-red-100 bg-red-50 dark:border-red-500/15 dark:bg-red-950/25",            title: "text-red-600 dark:text-red-300",       icon: "text-red-400 dark:text-red-500/60",       value: "text-red-600 dark:text-red-400",       sub: "text-red-400 dark:text-coffee-bean-200/40" },
  blue:   { wrap: "border-blue-100 bg-blue-50 dark:border-blue-500/15 dark:bg-blue-950/20",         title: "text-blue-600 dark:text-blue-300",     icon: "text-blue-400 dark:text-blue-500/60",     value: "text-blue-600 dark:text-blue-400",     sub: "text-blue-400 dark:text-coffee-bean-200/40" },
  orange: { wrap: "border-orange-100 bg-orange-50 dark:border-orange-500/15 dark:bg-orange-950/20", title: "text-orange-600 dark:text-orange-300", icon: "text-orange-400 dark:text-orange-500/60", value: "text-orange-600 dark:text-orange-400", sub: "text-orange-400 dark:text-coffee-bean-200/40" },
  purple: { wrap: "border-purple-100 bg-purple-50 dark:border-purple-500/15 dark:bg-purple-950/20", title: "text-purple-600 dark:text-purple-300", icon: "text-purple-400 dark:text-purple-500/60", value: "text-purple-600 dark:text-purple-400", sub: "text-purple-400 dark:text-coffee-bean-200/40" },
} as const;

export type KpiTone = keyof typeof TONE;

export const KpiCard = ({ tone, title, Icon, value, sub, delay }: {
  tone: KpiTone; title: string; Icon: LucideIcon;
  value: ReactNode; sub: ReactNode; delay: number;
}) => {
  const t = TONE[tone];
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }}
      className={`overflow-hidden rounded-2xl border p-5 shadow-sm dark:shadow-none ${t.wrap}`}>
      <div className="flex h-full flex-col justify-between">
        <div className="flex items-start justify-between">
          <p className={`font-cinematic text-sm uppercase tracking-[0.22em] ${t.title}`}>{title}</p>
          <Icon size={16} className={t.icon} />
        </div>
        <div>
          <p className={`font-mono text-4xl font-bold tabular-nums ${t.value}`}>{value}</p>
          <p className={`mt-1.5 font-mono text-[10px] ${t.sub}`}>{sub}</p>
        </div>
      </div>
    </motion.div>
  );
};
