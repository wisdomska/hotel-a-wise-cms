import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { revalidateNow } from "@/app/actions/system";

export const metadata = { title: "Settings" };

export default function SettingsPage() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const hasUrl = Boolean(url);
  const publicSite = process.env.PUBLIC_SITE_URL ?? "https://hotel-a-wise.vercel.app";

  return (
    <div className="space-y-10">
      <PageHeader
        title="Settings"
        description="Connection details and operational controls."
      />

      <section className="card p-6 space-y-5">
        <div>
          <h2 className="font-display text-xl">Supabase</h2>
          <p className="mt-1 text-sm text-[var(--color-text-muted)]">
            These are read-only — set them in your Vercel project's environment variables.
          </p>
        </div>
        <Field label="Project URL">
          <Input value={hasUrl ? url : "(not configured)"} readOnly />
        </Field>
        <Field label="Anon key">
          <Input value={process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "•••• configured" : "(not configured)"} readOnly />
        </Field>
      </section>

      <section className="card p-6 space-y-5">
        <div>
          <h2 className="font-display text-xl">Site revalidation</h2>
          <p className="mt-1 text-sm text-[var(--color-text-muted)]">
            Push your latest content to the public site immediately.
          </p>
        </div>
        <Field label="Public site URL">
          <Input value={publicSite} readOnly />
        </Field>
        <form action={revalidateNow}>
          <Button>↻ Trigger revalidation now</Button>
        </form>
      </section>
    </div>
  );
}
