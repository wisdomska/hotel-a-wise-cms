import * as React from "react";
import { Label } from "./label";

type FieldProps = {
  label: string;
  hint?: string;
  error?: string | null;
  required?: boolean;
  children: React.ReactNode;
};

export function Field({ label, hint, error, required, children }: FieldProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label>
          {label}
          {required && <span className="ml-1 text-[var(--color-accent)]">*</span>}
        </Label>
        {hint && <span className="text-xs text-[var(--color-text-soft)]">{hint}</span>}
      </div>
      {children}
      {error && <p className="text-xs text-[var(--color-danger)]">{error}</p>}
    </div>
  );
}
