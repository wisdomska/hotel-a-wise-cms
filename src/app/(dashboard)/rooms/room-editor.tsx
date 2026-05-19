"use client";

import { useActionState, useState } from "react";
import type { Room } from "@/types/content";
import { saveRoom, type ActionState } from "@/app/actions/content";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { FormFeedback, SubmitButton } from "@/components/form-status";

export function RoomEditor({ initial }: { initial?: Room }) {
  const [state, formAction] = useActionState<ActionState, FormData>(saveRoom, null);
  const [name, setName] = useState(initial?.name ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [slugDirty, setSlugDirty] = useState(!!initial?.slug);

  // Auto-generate slug from name when user hasn't manually edited it
  function onName(v: string) {
    setName(v);
    if (!slugDirty) {
      setSlug(v.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""));
    }
  }

  return (
    <form action={formAction} className="card space-y-6 p-6">
      {initial?.id && <input type="hidden" name="id" value={initial.id} />}

      <div className="grid gap-4 md:grid-cols-[2fr_1fr]">
        <Field label="Name" required>
          <Input name="name" value={name} onChange={(e) => onName(e.target.value)} required />
        </Field>
        <Field label="Slug" required hint="URL fragment — e.g. /rooms/royal-penthouse">
          <Input name="slug" value={slug} onChange={(e) => { setSlug(e.target.value); setSlugDirty(true); }} required />
        </Field>
      </div>

      <Field label="Description">
        <Textarea name="description" rows={4} defaultValue={initial?.description ?? ""} />
      </Field>

      <div className="grid gap-4 md:grid-cols-3">
        <Field label="Bed summary" required hint="e.g. 2 King Beds">
          <Input name="bed_summary" defaultValue={initial?.bed_summary ?? ""} required />
        </Field>
        <Field label="Capacity (guests)" required>
          <Input name="capacity" type="number" min={1} defaultValue={initial?.capacity ?? 2} required />
        </Field>
        <Field label="Price per night (₵)">
          <Input name="price_per_night" type="number" step="0.01" defaultValue={initial?.price_per_night ?? ""} />
        </Field>
      </div>

      <Field label="Hero image URL" required>
        <Input name="hero_image_url" type="url" defaultValue={initial?.hero_image_url ?? ""} required />
      </Field>

      <Field label="Gallery image URLs" hint="One URL per line">
        <Textarea name="gallery" rows={4} defaultValue={(initial?.gallery ?? []).join("\n")} />
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
        <Button href="/rooms" variant="ghost">Cancel</Button>
        <SubmitButton>{initial?.id ? "Save changes" : "Create room"}</SubmitButton>
      </div>
    </form>
  );
}
