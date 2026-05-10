import { type ReactNode } from "react";

export const InfoRow = ({ label, value, mono = false }: {
  label: string; value: ReactNode; mono?: boolean;
}) => (
  <div className="flex items-start gap-3">
    <span className="w-20 shrink-0 font-mono text-[10px] uppercase tracking-wider text-slate-400 dark:text-coffee-bean-200/35">{label}</span>
    <span className={`text-xs text-slate-700 dark:text-coffee-bean-100 ${mono ? "font-mono" : ""}`}>{value}</span>
  </div>
);
