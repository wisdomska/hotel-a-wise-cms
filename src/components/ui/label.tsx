import * as React from "react";
import { cn } from "@/lib/cn";

export function Label({ className, children, ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      className={cn(
        "text-xs font-medium uppercase tracking-[0.18em] text-[var(--color-text-muted)]",
        className
      )}
      {...props}
    >
      {children}
    </label>
  );
}
