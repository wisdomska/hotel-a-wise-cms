import Link from "next/link";
import * as React from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

type Props = {
  variant?: Variant;
  size?: Size;
  href?: string;
  className?: string;
  children: React.ReactNode;
} & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children">;

const base =
  "inline-flex items-center justify-center gap-2 font-medium transition-colors " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)] " +
  "disabled:pointer-events-none disabled:opacity-50";

const variants: Record<Variant, string> = {
  primary:   "bg-[var(--color-brand)] text-[var(--color-brand-foreground)] hover:opacity-92",
  secondary: "border border-[var(--color-border-strong)] bg-[var(--color-surface)] text-[var(--color-text)] hover:bg-[var(--color-surface-2)]",
  ghost:     "text-[var(--color-text-muted)] hover:text-[var(--color-text)]",
  danger:    "bg-[var(--color-danger)] text-white hover:opacity-92",
};
const sizes: Record<Size, string> = {
  sm: "h-8  px-3 text-xs rounded-[var(--radius-input)]",
  md: "h-10 px-4 text-sm rounded-[var(--radius-input)]",
  lg: "h-12 px-6 text-sm rounded-[var(--radius-input)]",
};

export function Button({
  variant = "primary",
  size = "md",
  href,
  className,
  children,
  ...rest
}: Props) {
  const c = cn(base, variants[variant], sizes[size], className);
  if (href) {
    return <Link href={href} className={c}>{children}</Link>;
  }
  return <button className={c} {...rest}>{children}</button>;
}
