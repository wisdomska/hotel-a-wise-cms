"use client";
import { useFormStatus } from "react-dom";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/button";

export function SubmitButton({
  children,
  className,
  pendingLabel = "Saving…",
}: {
  children: React.ReactNode;
  className?: string;
  pendingLabel?: string;
}) {
  const { pending } = useFormStatus();
  return (
    <Button className={cn(className)} disabled={pending}>
      {pending ? pendingLabel : children}
    </Button>
  );
}

export function FormFeedback({
  state,
}: {
  state: { ok: boolean; message: string } | null;
}) {
  if (!state) return null;
  return (
    <div
      role="status"
      className={cn(
        "rounded-md border px-3 py-2 text-sm",
        state.ok
          ? "border-[var(--color-success)] bg-[var(--color-success-soft)] text-[var(--color-success)]"
          : "border-[var(--color-danger)] bg-[var(--color-danger-soft)] text-[var(--color-danger)]"
      )}
    >
      {state.message}
    </div>
  );
}
