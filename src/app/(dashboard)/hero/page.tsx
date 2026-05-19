import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/page-header";
import { HeroEditor } from "@/app/(dashboard)/hero/hero-editor";
import type { Hero } from "@/types/content";

async function getHero(): Promise<Hero> {
  const supabase = await createClient();
  const { data } = await supabase.from("hero").select("*").eq("id", "main").maybeSingle();
  return (
    (data as Hero | null) ?? {
      id: "main",
      headline: "Your Gateway to Unforgettable Memories",
      subtext:
        "Experience exquisite accommodations, premium amenities and warm service tailored to exceed your expectations.",
      cta_text: "View Rooms",
      cta_link: "#rooms",
      background_image_url:
        "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=1920&q=80",
    }
  );
}

export const metadata = { title: "Hero" };

export default async function HeroPage() {
  const hero = await getHero();
  return (
    <div className="space-y-8">
      <PageHeader
        title="Hero section"
        description="The first thing every visitor sees. Keep the headline aspirational, the subtext warm and concrete."
      />
      <HeroEditor initial={hero} />
    </div>
  );
}
