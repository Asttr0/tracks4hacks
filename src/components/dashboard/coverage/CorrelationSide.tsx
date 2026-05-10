import { type ReactNode } from "react";
import { InfoRow } from "./InfoRow";
import type { LucideIcon } from "./utils";

const TONE = {
  red:  { head: "border-red-100 dark:border-red-500/10",   chip: "bg-red-100 dark:bg-red-500/10",   icon: "text-red-600 dark:text-red-400",   title: "text-red-500 dark:text-red-400/80",   box: "border-red-100 bg-red-50 dark:border-red-500/10 dark:bg-red-500/[0.04]",   label: "text-red-500 dark:text-red-400/60" },
  blue: { head: "border-blue-100 dark:border-blue-500/10", chip: "bg-blue-100 dark:bg-blue-500/10", icon: "text-blue-600 dark:text-blue-400", title: "text-blue-500 dark:text-blue-400/80", box: "border-blue-100 bg-blue-50 dark:border-blue-500/10 dark:bg-blue-500/[0.04]", label: "text-blue-500 dark:text-blue-400/60" },
} as const;

export const CorrelationSide = ({ tone, Icon, title, subId, rows, footerLabel, footer }: {
  tone: keyof typeof TONE; Icon: LucideIcon; title: string; subId: string;
  rows: { label: string; value: ReactNode; mono?: boolean }[];
  footerLabel: string; footer: ReactNode;
}) => {
  const t = TONE[tone];
  return (
    <div className="space-y-4">
      <div className={`flex items-center gap-2 border-b pb-3 ${t.head}`}>
        <div className={`flex size-8 items-center justify-center rounded-lg ${t.chip}`}>
          <Icon size={14} className={t.icon} />
        </div>
        <div>
          <p className={`font-mono text-[9px] uppercase tracking-[0.25em] ${t.title}`}>{title}</p>
          <p className="font-mono text-[11px] text-slate-500 dark:text-coffee-bean-200/50">{subId}</p>
        </div>
      </div>
      <div className="space-y-2.5">
        {rows.map((r) => <InfoRow key={r.label} {...r} />)}
      </div>
      <div className={`rounded-xl border p-3.5 ${t.box}`}>
        <p className={`mb-2 font-mono text-[9px] uppercase tracking-widest ${t.label}`}>{footerLabel}</p>
        {footer}
      </div>
    </div>
  );
};
