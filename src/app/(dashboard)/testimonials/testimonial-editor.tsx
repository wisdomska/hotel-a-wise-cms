"use client";

import { useActionState } from "react";
import type { Testimonial } from "@/types/content";
import { saveTestimonial, type ActionState } from "@/app/actions/content";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { FormFeedback, SubmitButton } from "@/components/form-status";

export function TestimonialEditor({ initial }: { initial?: Testimonial }) {
  const [state, formAction] = useActionState<ActionState, FormData>(saveTestimonial, null);
  return (
    <form action={formAction} className="card space-y-6 p-6">
      {initial?.id && <input type="hidden" name="id" value={initial.id} />}

      <Field label="Quote" required hint="Keep it warm and specific">
        <Textarea name="quote" rows={5} defaultValue={initial?.quote ?? ""} required />
      </Field>

      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Author" required>
          <Input name="author" defaultValue={initial?.author ?? ""} required />
        </Field>
        <Field label="Location" hint="City or neighbourhood">
          <Input name="location" defaultValue={initial?.location ?? ""} />
        </Field>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Field label="Rating (1–5)">
          <Input name="rating" type="number" min={1} max={5} defaultValue={initial?.rating ?? 5} />
        </Field>
        <Field label="Display order">
          <Input name="display_order" type="number" defaultValue={initial?.display_order ?? 0} />
        </Field>
        <Field label="Status">
          <Select name="status" defaultValue={initial?.status ?? "published"}>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </Select>
        </Field>
      </div>

      <div className="rounded-md border border-[var(--color-border)] bg-[var(--color-surface-2)]/40 p-4">
        <Checkbox
          name="featured"
          defaultChecked={initial?.featured ?? false}
          label="Feature this testimonial on the homepage"
          description="Only one featured testimonial appears in the Reception section — the lowest display order wins."
        />
      </div>

      <FormFeedback state={state} />

      <div className="flex items-center justify-end gap-3 border-t border-[var(--color-border)] pt-5">
        <Button href="/testimonials" variant="ghost">Cancel</Button>
        <SubmitButton>{initial?.id ? "Save changes" : "Create testimonial"}</SubmitButton>
      </div>
    </form>
  );
}
