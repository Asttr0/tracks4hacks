import { HTMLAttributes, ReactNode } from "react";
import { clsx } from "../../lib/clsx";

interface CardProps extends Omit<HTMLAttributes<HTMLElement>, "title"> {
  title?: ReactNode;
  meta?: ReactNode;
  as?: "section" | "article" | "div";
}

export const Card = ({
  title,
  meta,
  as: Tag = "section",
  className,
  children,
  ...rest
}: CardProps) => (
  <Tag
    className={clsx(
      "rounded-lg border border-slate-200 bg-white p-4 lg:p-6 dark:border-soc-border dark:bg-soc-panel",
      className,
    )}
    {...rest}
  >
    {(title || meta) && (
      <header className="mb-4 flex items-center justify-between gap-4">
        {title && (
          <h3 className="font-cinematic text-sm uppercase tracking-wide text-slate-900 dark:text-white">
            {title}
          </h3>
        )}
        {meta && (
          <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-red-500 dark:text-red-400">
            {meta}
          </span>
        )}
      </header>
    )}
    {children}
  </Tag>
);
