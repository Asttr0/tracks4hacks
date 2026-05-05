import { ReactNode } from "react";

interface PageHeaderProps {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
}

export const PageHeader = ({ eyebrow, title, description, actions }: PageHeaderProps) => (
  <header className="mb-6 flex flex-col gap-4 border-b border-slate-200 pb-6 dark:border-white/5 md:flex-row md:items-end md:justify-between">
    <div>
      {eyebrow && (
        <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-red-500 dark:text-red-400">
          {eyebrow}
        </p>
      )}
      <h1 className="mt-1 font-cinematic text-2xl uppercase tracking-wide text-slate-900 dark:text-white md:text-3xl">
        {title}
      </h1>
      {description && (
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600 dark:text-gray-400">
          {description}
        </p>
      )}
    </div>
    {actions && <div className="flex items-center gap-3">{actions}</div>}
  </header>
);
