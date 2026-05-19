import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";

export const metadata = { title: "Testimonials" };

export default function Page() {
  return (
    <div className="space-y-8">
      <PageHeader title="Testimonials" description="Manage guest reviews displayed on the site." />
      <div className="card grid place-items-center px-8 py-16 text-center">
        <div className="font-display text-2xl">In progress</div>
        <p className="mt-2 max-w-sm text-sm text-[var(--color-text-muted)]">
          The CMS for this section is being built on the same patterns as the Hero editor.
          Use the Hero page to see the live preview + server-action pattern.
        </p>
        <div className="mt-6 flex gap-3">
          <Button href="/hero" variant="secondary">Open Hero editor</Button>
          <Button href="https://hotel-a-wise.vercel.app" variant="ghost">View Live Site ↗</Button>
        </div>
      </div>
    </div>
  );
}
