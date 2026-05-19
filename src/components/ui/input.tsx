import * as React from "react";
import { cn } from "@/lib/cn";

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  function Input({ className, ...props }, ref) {
    return (
      <input
        ref={ref}
        className={cn(
          "h-11 w-full rounded-[var(--radius-input)] border border-[var(--color-border)]",
          "bg-[var(--color-surface)] px-3.5 text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-soft)]",
          "transition-colors focus:border-[var(--color-accent)] focus:outline-none",
          className
        )}
        {...props}
      />
    );
  }
);
