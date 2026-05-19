import * as React from "react";
import { cn } from "@/lib/cn";

type Props = {
  label: string;
  description?: string;
  name: string;
  defaultChecked?: boolean;
  className?: string;
};

export function Checkbox({ label, description, name, defaultChecked, className }: Props) {
  return (
    <label className={cn("flex cursor-pointer items-start gap-3", className)}>
      <input
        type="checkbox"
        name={name}
        defaultChecked={defaultChecked}
        className="mt-0.5 h-4 w-4 cursor-pointer accent-[var(--color-accent)]"
      />
      <div>
        <div className="text-sm font-medium text-[var(--color-text)]">{label}</div>
        {description && <div className="text-xs text-[var(--color-text-muted)]">{description}</div>}
      </div>
    </label>
  );
}
