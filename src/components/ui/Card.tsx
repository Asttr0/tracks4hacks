import { HTMLAttributes, ReactNode } from "react";
import { clsx } from "../../lib/clsx";
import { NeonEdge } from "./NeonEdge";

interface CardProps extends Omit<HTMLAttributes<HTMLElement>, "title"> {
  title?: ReactNode;
  meta?: ReactNode;
  as?: "section" | "article" | "div";
  /** Hex/rgb color — when set, renders the pulsing neon edge on the top. */
  accent?: string;
}

export const Card = ({
  title,
  meta,
  as: Tag = "section",
  className,
  children,
  accent,
  ...rest
}: CardProps) => (
  <Tag
    className={clsx(
      "relative overflow-hidden rounded-lg border border-slate-200 bg-white p-4 shadow-sm lg:p-6 dark:border-white/[0.06] dark:bg-black/20 dark:shadow-none dark:backdrop-blur-sm",
      className,
    )}
    {...rest}
  >
    {accent && <NeonEdge color={accent} intensity="bright" />}
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
