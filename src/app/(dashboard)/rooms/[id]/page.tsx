import { notFound } from "next/navigation";
import { PageHeader } from "@/components/page-header";
import { RoomEditor } from "@/app/(dashboard)/rooms/room-editor";
import { createClient } from "@/lib/supabase/server";
import type { Room } from "@/types/content";

export const metadata = { title: "Edit room" };
export const dynamic = "force-dynamic";

export default async function EditRoomPage({
  params,
}: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase.from("rooms").select("*").eq("id", id).maybeSingle<Room>();
  if (!data) notFound();

  return (
    <div className="space-y-8">
      <PageHeader title={data.name} description={`Editing /rooms/${data.slug}`} />
      <RoomEditor initial={data} />
    </div>
  );
}
