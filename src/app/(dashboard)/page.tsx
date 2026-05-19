import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/page-header";
import { createClient } from "@/lib/supabase/server";

async function getCounts() {
  const supabase = await createClient();
  try {
    const [hero, amenities, rooms, testimonials, media] = await Promise.all([
      supabase.from("hero").select("*", { count: "exact", head: true }),
      supabase.from("amenities").select("*", { count: "exact", head: true }),
      supabase.from("rooms").select("*", { count: "exact", head: true }),
      supabase.from("testimonials").select("*", { count: "exact", head: true }),
      supabase.from("media").select("*", { count: "exact", head: true }),
    ]);
    return {
      hero: hero.count ?? 0,
      amenities: amenities.count ?? 0,
      rooms: rooms.count ?? 0,
      testimonials: testimonials.count ?? 0,
      media: media.count ?? 0,
      ok: true,
    };
  } catch {
    return { hero: 0, amenities: 0, rooms: 0, testimonials: 0, media: 0, ok: false };
  }
}

export default async function Overview() {
  const counts = await getCounts();
  const tiles = [
    { label: "Hero sections",   value: counts.hero,         href: "/hero",         icon: "★" },
    { label: "Amenity cards",   value: counts.amenities,    href: "/amenities",    icon: "▣" },
    { label: "Rooms",           value: counts.rooms,        href: "/rooms",        icon: "◉" },
    { label: "Testimonials",    value: counts.testimonials, href: "/testimonials", icon: "☆" },
    { label: "Media assets",    value: counts.media,        href: "/media",        icon: "🖼" },
  ];

  return (
    <div className="space-y-10">
      <PageHeader
        title="Overview"
        description="Welcome back — a quick summary of your site content."
        actions={
          <Button href="https://hotel-a-wise.vercel.app" variant="secondary">
            View Live Site ↗
          </Button>
        }
      />

      {!counts.ok && (
        <div className="rounded-md border border-[var(--color-border)] bg-[var(--color-accent-soft)] p-5 text-sm">
          <strong className="font-medium">Setup required:</strong> your Supabase tables aren’t reachable yet.
          Run the SQL schema in <code className="rounded bg-white/60 px-1 py-0.5">supabase/schema.sql</code>{" "}
          in your Supabase SQL editor, then refresh.
        </div>
      )}

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tiles.map((t) => (
          <Link
            key={t.href}
            href={t.href}
            className="card flex items-center justify-between p-5 transition-shadow hover:shadow-[var(--shadow-elev)]"
          >
            <div>
              <div className="text-xs uppercase tracking-[0.18em] text-[var(--color-text-muted)]">{t.label}</div>
              <div className="mt-2 font-display text-3xl">{t.value || "—"}</div>
            </div>
            <span className="text-2xl text-[var(--color-text-soft)]">{t.icon}</span>
          </Link>
        ))}
      </section>

      <section className="card p-6">
        <h2 className="font-display text-xl">Next steps</h2>
        <ol className="mt-4 space-y-3 text-sm text-[var(--color-text-muted)]">
          <li>1. Run the SQL schema in <em>Supabase → SQL Editor</em> to create the tables.</li>
          <li>2. Create your admin user via <em>Supabase → Authentication → Users</em>, then sign in here.</li>
          <li>
            3. Edit content in each section. The public site picks up changes
            after you click <em>Revalidate</em> on the Settings page.
          </li>
        </ol>
      </section>
    </div>
  );
}
