import { cn } from "@/lib/cn";
import * as React from "react";

type Tone = "neutral" | "success" | "warning" | "danger" | "muted";

const tones: Record<Tone, string> = {
  neutral: "border-[var(--color-border-strong)] text-[var(--color-text)]",
  success: "border-[var(--color-success)] bg-[var(--color-success-soft)] text-[var(--color-success)]",
  warning: "border-[#a87f37] bg-[var(--color-accent-soft)] text-[#6b4f23]",
  danger:  "border-[var(--color-danger)] bg-[var(--color-danger-soft)] text-[var(--color-danger)]",
  muted:   "border-[var(--color-border)] text-[var(--color-text-soft)]",
};

export function Badge({ children, tone = "neutral", className }: { children: React.ReactNode; tone?: Tone; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-medium",
        tones[tone],
        className
      )}
    >
      {children}
    </span>
  );
}
