import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { Room } from "@/types/content";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/data-table";
import { DeleteForm } from "@/components/delete-form";
import { deleteRoom } from "@/app/actions/content";

export const metadata = { title: "Rooms" };
export const dynamic = "force-dynamic";

async function getRooms(): Promise<{ rows: Room[]; error: string | null }> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("rooms")
    .select("*")
    .order("display_order", { ascending: true });
  if (error) return { rows: [], error: error.message };
  return { rows: (data as Room[]) ?? [], error: null };
}

export default async function RoomsPage() {
  const { rows, error } = await getRooms();
  return (
    <div className="space-y-8">
      <PageHeader
        title="Rooms"
        description="Manage hotel room listings shown on the homepage and detail pages."
        actions={<Button href="/rooms/new">+ Add room</Button>}
      />
      {error && (
        <div className="rounded-md border border-[var(--color-danger)] bg-[var(--color-danger-soft)] p-4 text-sm text-[var(--color-danger)]">
          Couldn’t load rooms: {error}.
        </div>
      )}
      <DataTable
        rows={rows}
        rowKey={(r) => r.id}
        columns={[
          { key: "order", header: "Order", className: "w-16", cell: (r) => <span className="text-[var(--color-text-soft)]">{r.display_order}</span> },
          { key: "name",  header: "Name",  cell: (r) => (
            <div>
              <div className="font-medium">{r.name}</div>
              <div className="text-xs text-[var(--color-text-soft)]">/{r.slug}</div>
            </div>
          )},
          { key: "beds",   header: "Beds & capacity", cell: (r) => <span>{r.bed_summary} · {r.capacity} guests</span> },
          { key: "price",  header: "Price",          cell: (r) => r.price_per_night ? <>₵{r.price_per_night}/night</> : <span className="text-[var(--color-text-soft)]">—</span> },
          { key: "status", header: "Status",         cell: (r) => <Badge tone={r.status === "published" ? "success" : "muted"}>{r.status}</Badge> },
          { key: "actions", header: "", className: "text-right w-40", cell: (r) => (
            <div className="flex items-center justify-end gap-2">
              <Link href={`/rooms/${r.id}`} className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text)]">Edit</Link>
              <DeleteForm action={async (fd) => { "use server"; fd.set("id", r.id); await deleteRoom(fd); }} />
            </div>
          )},
        ]}
        empty={
          <div>
            <p className="font-display text-2xl">No rooms yet</p>
            <p className="mt-1 text-sm text-[var(--color-text-muted)]">Add your first room — it’ll appear on the homepage and at /rooms/[slug].</p>
            <div className="mt-5"><Button href="/rooms/new">+ Add room</Button></div>
          </div>
        }
      />
    </div>
  );
}
