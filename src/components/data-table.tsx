import * as React from "react";
import { cn } from "@/lib/cn";

type Column<T> = {
  key: string;
  header: React.ReactNode;
  className?: string;
  cell: (row: T) => React.ReactNode;
};

type Props<T> = {
  rows: T[];
  columns: Column<T>[];
  empty?: React.ReactNode;
  rowKey?: (row: T) => string;
};

export function DataTable<T>({ rows, columns, empty, rowKey }: Props<T>) {
  if (!rows.length) {
    return (
      <div className="card grid place-items-center p-12 text-center">
        {empty ?? <p className="text-sm text-[var(--color-text-muted)]">No items yet.</p>}
      </div>
    );
  }
  return (
    <div className="card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--color-border)] bg-[var(--color-surface-2)]/50">
              {columns.map((c) => (
                <th
                  key={c.key}
                  className={cn(
                    "px-4 py-3 text-left text-[10px] font-medium uppercase tracking-[0.18em] text-[var(--color-text-muted)]",
                    c.className
                  )}
                >
                  {c.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr
                key={rowKey ? rowKey(row) : i}
                className="border-b border-[var(--color-border)] last:border-b-0 transition-colors hover:bg-[var(--color-surface-2)]/40"
              >
                {columns.map((c) => (
                  <td key={c.key} className={cn("px-4 py-3.5 text-[var(--color-text)]", c.className)}>
                    {c.cell(row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
