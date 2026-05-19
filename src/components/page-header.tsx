import * as React from "react";

type Props = {
  title: string;
  description?: string;
  actions?: React.ReactNode;
};

export function PageHeader({ title, description, actions }: Props) {
  return (
    <header className="flex flex-wrap items-end justify-between gap-4 border-b border-[var(--color-border)] pb-6">
      <div>
        <h1 className="font-display text-3xl leading-tight md:text-4xl">{title}</h1>
        {description && (
          <p className="mt-2 text-sm text-[var(--color-text-muted)]">{description}</p>
        )}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </header>
  );
}
