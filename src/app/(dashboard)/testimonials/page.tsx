import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { Testimonial } from "@/types/content";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/data-table";
import { DeleteForm } from "@/components/delete-form";
import { deleteTestimonial } from "@/app/actions/content";

export const metadata = { title: "Testimonials" };
export const dynamic = "force-dynamic";

async function getTestimonials(): Promise<{ rows: Testimonial[]; error: string | null }> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("testimonials")
    .select("*")
    .order("display_order", { ascending: true });
  if (error) return { rows: [], error: error.message };
  return { rows: (data as Testimonial[]) ?? [], error: null };
}

export default async function TestimonialsPage() {
  const { rows, error } = await getTestimonials();
  return (
    <div className="space-y-8">
      <PageHeader
        title="Testimonials"
        description="Guest reviews displayed on the homepage Reception section."
        actions={<Button href="/testimonials/new">+ Add testimonial</Button>}
      />
      {error && (
        <div className="rounded-md border border-[var(--color-danger)] bg-[var(--color-danger-soft)] p-4 text-sm text-[var(--color-danger)]">
          Couldn’t load testimonials: {error}.
        </div>
      )}
      <DataTable
        rows={rows}
        rowKey={(r) => r.id}
        columns={[
          { key: "order", header: "Order", className: "w-16", cell: (r) => <span className="text-[var(--color-text-soft)]">{r.display_order}</span> },
          { key: "quote", header: "Quote", cell: (r) => <span className="line-clamp-2 max-w-md text-[var(--color-text)]">“{r.quote}”</span> },
          { key: "author", header: "Author", cell: (r) => (
            <div>
              <div className="font-medium">{r.author}</div>
              {r.location && <div className="text-xs text-[var(--color-text-soft)]">{r.location}</div>}
            </div>
          )},
          { key: "featured", header: "Featured", className: "w-24", cell: (r) => r.featured ? <Badge tone="warning">Featured</Badge> : <span className="text-[var(--color-text-soft)]">—</span> },
          { key: "status", header: "Status", cell: (r) => <Badge tone={r.status === "published" ? "success" : "muted"}>{r.status}</Badge> },
          { key: "actions", header: "", className: "text-right w-40", cell: (r) => (
            <div className="flex items-center justify-end gap-2">
              <Link href={`/testimonials/${r.id}`} className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text)]">Edit</Link>
              <DeleteForm action={async (fd) => { "use server"; fd.set("id", r.id); await deleteTestimonial(fd); }} />
            </div>
          )},
        ]}
      />
    </div>
  );
}
