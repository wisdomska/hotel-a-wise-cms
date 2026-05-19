import { createClient } from "@/lib/supabase/server";
import type { Amenity } from "@/types/content";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/data-table";
import { DeleteForm } from "@/components/delete-form";
import { deleteAmenity } from "@/app/actions/content";
import Link from "next/link";

export const metadata = { title: "Amenities" };
export const dynamic = "force-dynamic";

async function getAmenities(): Promise<{ rows: Amenity[]; error: string | null }> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("amenities")
    .select("*")
    .order("display_order", { ascending: true });
  if (error) return { rows: [], error: error.message };
  return { rows: (data as Amenity[]) ?? [], error: null };
}

export default async function AmenitiesPage() {
  const { rows, error } = await getAmenities();

  return (
    <div className="space-y-8">
      <PageHeader
        title="Amenities"
        description="Manage the scrolling marquee items and coming-soon cards."
        actions={<Button href="/amenities/new">+ Add amenity</Button>}
      />

      {error && (
        <div className="rounded-md border border-[var(--color-danger)] bg-[var(--color-danger-soft)] p-4 text-sm text-[var(--color-danger)]">
          Couldn’t load amenities: {error}. Have you run the SQL schema yet?
        </div>
      )}

      <DataTable
        rows={rows}
        rowKey={(r) => r.id}
        columns={[
          { key: "order", header: "Order", className: "w-16", cell: (r) => <span className="text-[var(--color-text-soft)]">{r.display_order}</span> },
          { key: "name",  header: "Name",  cell: (r) => <span className="font-medium">{r.name}</span> },
          { key: "type",  header: "Type",  cell: (r) => (
            <Badge tone={r.type === "feature" ? "neutral" : "warning"}>
              {r.type === "feature" ? "Feature" : "Coming soon"}
            </Badge>
          )},
          { key: "status", header: "Status", cell: (r) => (
            <Badge tone={r.status === "published" ? "success" : "muted"}>
              {r.status}
            </Badge>
          )},
          { key: "actions", header: "", className: "text-right w-40", cell: (r) => (
            <div className="flex items-center justify-end gap-2">
              <Link href={`/amenities/${r.id}`} className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text)]">
                Edit
              </Link>
              <DeleteForm action={async (fd) => { "use server"; fd.set("id", r.id); await deleteAmenity(fd); }} />
            </div>
          )},
        ]}
        empty={
          <div>
            <p className="font-display text-2xl">No amenities yet</p>
            <p className="mt-1 text-sm text-[var(--color-text-muted)]">Add your first amenity to populate the marquee.</p>
            <div className="mt-5"><Button href="/amenities/new">+ Add amenity</Button></div>
          </div>
        }
      />
    </div>
  );
}
