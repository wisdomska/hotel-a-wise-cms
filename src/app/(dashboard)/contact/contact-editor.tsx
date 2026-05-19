"use client";

import { useActionState } from "react";
import type { ContactInfo } from "@/types/content";
import { saveContact, type ActionState } from "@/app/actions/content";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { FormFeedback, SubmitButton } from "@/components/form-status";

export function ContactEditor({ initial }: { initial: ContactInfo }) {
  const [state, formAction] = useActionState<ActionState, FormData>(saveContact, null);
  return (
    <form action={formAction} className="card space-y-6 p-6">
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Phone" required>
          <Input name="phone" defaultValue={initial.phone} required />
        </Field>
        <Field label="Email" required>
          <Input name="email" type="email" defaultValue={initial.email} required />
        </Field>
      </div>

      <Field label="Street address" required>
        <Textarea name="address" rows={2} defaultValue={initial.address} required />
      </Field>

      <Field label="Google Maps link" hint="Optional — shown in the footer">
        <Input name="maps_link" type="url" defaultValue={initial.maps_link ?? ""} />
      </Field>

      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Copyright text" required>
          <Input name="copyright_text" defaultValue={initial.copyright_text} required />
        </Field>
        <Field label="Footer tagline">
          <Input name="footer_tagline" defaultValue={initial.footer_tagline ?? ""} />
        </Field>
      </div>

      <FormFeedback state={state} />

      <div className="flex items-center justify-end gap-3 border-t border-[var(--color-border)] pt-5">
        <Button variant="ghost" type="reset">Reset</Button>
        <SubmitButton>Save contact</SubmitButton>
      </div>
    </form>
  );
}
