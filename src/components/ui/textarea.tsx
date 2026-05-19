import * as React from "react";
import { cn } from "@/lib/cn";

export const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  function Textarea({ className, ...props }, ref) {
    return (
      <textarea
        ref={ref}
        className={cn(
          "min-h-[7rem] w-full rounded-[var(--radius-input)] border border-[var(--color-border)]",
          "bg-[var(--color-surface)] px-3.5 py-3 text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-soft)]",
          "transition-colors focus:border-[var(--color-accent)] focus:outline-none",
          className
        )}
        {...props}
      />
    );
  }
);
