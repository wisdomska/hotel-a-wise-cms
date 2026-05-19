"use client";

import { Button } from "@/components/ui/button";

export function DeleteForm({
  action,
  label = "Delete",
  confirmMessage = "Delete this item? This cannot be undone.",
}: {
  action: (formData: FormData) => Promise<void> | void;
  label?: string;
  confirmMessage?: string;
}) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!confirm(confirmMessage)) e.preventDefault();
      }}
    >
      <Button variant="ghost" size="sm" className="text-[var(--color-danger)] hover:bg-[var(--color-danger-soft)]">
        {label}
      </Button>
    </form>
  );
}
