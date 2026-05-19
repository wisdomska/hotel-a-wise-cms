"use client";

import { useActionState } from "react";
import { saveAmenity, type ActionState } from "@/app/actions/content";
import type { Amenity } from "@/types/content";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { FormFeedback, SubmitButton } from "@/components/form-status";

export function AmenityEditor({ initial }: { initial?: Amenity }) {
  const [state, formAction] = useActionState<ActionState, FormData>(saveAmenity, null);
  return (
    <form action={formAction} className="card space-y-6 p-6">
      {initial?.id && <input type="hidden" name="id" value={initial.id} />}

      <div className="grid gap-4 md:grid-cols-[2fr_1fr]">
        <Field label="Name" required>
          <Input name="name" defaultValue={initial?.name ?? ""} required />
        </Field>
        <Field label="Type" required>
          <Select name="type" defaultValue={initial?.type ?? "feature"}>
            <option value="feature">Feature (marquee)</option>
            <option value="coming_soon">Coming soon (card)</option>
          </Select>
        </Field>
      </div>

      <Field label="Description" hint="Only shown for Coming Soon cards">
        <Textarea name="description" rows={3} defaultValue={initial?.description ?? ""} />
      </Field>

      <Field label="Image URL" hint="For Coming Soon cards; Unsplash works well">
        <Input name="image_url" type="url" defaultValue={initial?.image_url ?? ""} />
      </Field>

      <div className="grid gap-4 md:grid-cols-3">
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

      <FormFeedback state={state} />

      <div className="flex items-center justify-end gap-3 border-t border-[var(--color-border)] pt-5">
        <Button href="/amenities" variant="ghost">Cancel</Button>
        <SubmitButton>{initial?.id ? "Save changes" : "Create amenity"}</SubmitButton>
      </div>
    </form>
  );
}
