import { LucideIcon, Construction } from "lucide-react";
import { ReactNode } from "react";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
}

export const EmptyState = ({
  icon: Icon = Construction,
  title,
  description,
  action,
}: EmptyStateProps) => (
  <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-slate-300 bg-white/50 px-6 py-16 text-center dark:border-white/10 dark:bg-soc-panel/40">
    <Icon size={28} className="text-slate-400 dark:text-gray-500" />
    <p className="mt-4 font-cinematic text-sm uppercase tracking-wide text-slate-900 dark:text-white">
      {title}
    </p>
    {description && (
      <p className="mt-2 max-w-sm font-mono text-xs text-slate-500 dark:text-gray-500">
        {description}
      </p>
    )}
    {action && <div className="mt-6">{action}</div>}
  </div>
);
