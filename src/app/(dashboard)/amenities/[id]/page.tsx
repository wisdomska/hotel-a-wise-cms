import { notFound } from "next/navigation";
import { PageHeader } from "@/components/page-header";
import { AmenityEditor } from "@/app/(dashboard)/amenities/amenity-editor";
import { createClient } from "@/lib/supabase/server";
import type { Amenity } from "@/types/content";

export const metadata = { title: "Edit amenity" };
export const dynamic = "force-dynamic";

export default async function EditAmenityPage({
  params,
}: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase.from("amenities").select("*").eq("id", id).maybeSingle<Amenity>();
  if (!data) notFound();

  return (
    <div className="space-y-8">
      <PageHeader title="Edit amenity" description={`Last updated ${new Date().toISOString().slice(0,10)}`} />
      <AmenityEditor initial={data} />
    </div>
  );
}
