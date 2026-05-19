import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";

export const metadata = { title: "Media Library" };

export default function MediaPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Media library"
        description="Upload images for hero/rooms/coming-soon (coming soon)."
      />
      <div className="card grid place-items-center px-8 py-16 text-center">
        <div className="font-display text-2xl">Image hosting via URL for now</div>
        <p className="mt-2 max-w-md text-sm text-[var(--color-text-muted)]">
          The current editors accept image URLs. Upload to Supabase Storage will be added next —
          the bucket and policies are already provisioned by the schema.
        </p>
        <div className="mt-6 flex gap-3">
          <Button href="/hero" variant="secondary">Open Hero</Button>
          <Button href="/rooms" variant="ghost">Manage rooms</Button>
        </div>
      </div>
    </div>
  );
}
