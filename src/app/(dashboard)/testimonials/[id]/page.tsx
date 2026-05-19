import { notFound } from "next/navigation";
import { PageHeader } from "@/components/page-header";
import { TestimonialEditor } from "@/app/(dashboard)/testimonials/testimonial-editor";
import { createClient } from "@/lib/supabase/server";
import type { Testimonial } from "@/types/content";

export const metadata = { title: "Edit testimonial" };
export const dynamic = "force-dynamic";

export default async function EditTestimonialPage({
  params,
}: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase.from("testimonials").select("*").eq("id", id).maybeSingle<Testimonial>();
  if (!data) notFound();

  return (
    <div className="space-y-8">
      <PageHeader title={data.author} description={data.location ?? "Editing testimonial"} />
      <TestimonialEditor initial={data} />
    </div>
  );
}
