import { ButtonHTMLAttributes, forwardRef } from "react";
import { clsx } from "../../lib/clsx";

type Variant = "primary" | "secondary" | "ghost" | "destructive";
type Size = "sm" | "md";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

const base =
  "inline-flex items-center justify-center gap-2 rounded-md font-mono uppercase tracking-[0.25em] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-red-500/60 disabled:opacity-40 disabled:pointer-events-none";

const variants: Record<Variant, string> = {
  primary:
    "bg-red-600 text-white hover:bg-red-500 shadow-[0_0_20px_rgba(220,38,38,0.35)]",
  secondary:
    "border border-slate-300 bg-white text-slate-900 hover:bg-slate-50 dark:border-white/15 dark:bg-white/[0.03] dark:text-white dark:hover:bg-white/[0.06]",
  ghost:
    "text-slate-700 hover:bg-slate-100 hover:text-slate-900 dark:text-gray-300 dark:hover:bg-white/5 dark:hover:text-white",
  destructive:
    "bg-red-700 text-white hover:bg-red-600 shadow-[0_0_20px_rgba(185,28,28,0.4)]",
};

const sizes: Record<Size, string> = {
  sm: "px-3 py-1.5 text-[10px]",
  md: "px-5 py-2.5 text-xs",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", className, ...rest }, ref) => (
    <button
      ref={ref}
      className={clsx(base, variants[variant], sizes[size], className)}
      {...rest}
    />
  ),
);
Button.displayName = "Button";
