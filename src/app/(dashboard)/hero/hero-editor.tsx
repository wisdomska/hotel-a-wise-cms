"use client";

import { useActionState, useState } from "react";
import type { Hero } from "@/types/content";
import { saveHero, type ActionState } from "@/app/actions/content";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { FormFeedback, SubmitButton } from "@/components/form-status";

export function HeroEditor({ initial }: { initial: Hero }) {
  const [state, formAction] = useActionState<ActionState, FormData>(saveHero, null);
  const [draft, setDraft] = useState(initial);

  return (
    <div className="grid gap-8 lg:grid-cols-[7fr_5fr]">
      <form action={formAction} className="space-y-6 card p-6">
        <Field label="Headline" required hint={`${draft.headline.length}/120`}>
          <Input
            name="headline"
            value={draft.headline}
            maxLength={120}
            onChange={(e) => setDraft({ ...draft, headline: e.target.value })}
          />
        </Field>

        <Field label="Subtext / Description" required hint={`${draft.subtext.length}/300`}>
          <Textarea
            name="subtext"
            value={draft.subtext}
            maxLength={300}
            onChange={(e) => setDraft({ ...draft, subtext: e.target.value })}
          />
        </Field>

        <div className="grid gap-4 md:grid-cols-2">
          <Field label="CTA button text" required>
            <Input
              name="cta_text"
              value={draft.cta_text}
              onChange={(e) => setDraft({ ...draft, cta_text: e.target.value })}
            />
          </Field>
          <Field label="CTA button link" required hint="Use a path like /rooms or an anchor like #rooms">
            <Input
              name="cta_link"
              value={draft.cta_link}
              onChange={(e) => setDraft({ ...draft, cta_link: e.target.value })}
            />
          </Field>
        </div>

        <Field
          label="Background image URL"
          hint="Paste a URL — Media Library coming soon"
        >
          <Input
            name="background_image_url"
            type="url"
            value={draft.background_image_url}
            onChange={(e) => setDraft({ ...draft, background_image_url: e.target.value })}
          />
        </Field>

        <FormFeedback state={state} />

        <div className="flex items-center justify-end gap-3 border-t border-[var(--color-border)] pt-5">
          <Button variant="ghost" type="reset" onClick={() => setDraft(initial)}>
            Reset
          </Button>
          <SubmitButton>Save hero</SubmitButton>
        </div>
      </form>

      {/* Live preview */}
      <div className="space-y-3">
        <div className="text-xs uppercase tracking-[0.18em] text-[var(--color-text-muted)]">Live preview</div>
        <div
          className="relative aspect-[4/5] overflow-hidden rounded-[var(--radius-card)] shadow-[var(--shadow-elev)] grid grid-rows-[1fr_auto] bg-cover bg-center"
          style={{ backgroundImage: `linear-gradient(to bottom, rgba(14,12,10,0.35), rgba(14,12,10,0.85)), url(${draft.background_image_url || ""})` }}
        >
          <div />
          <div className="p-6 text-white">
            <p className="text-[10px] uppercase tracking-[0.3em] opacity-80">Hotel A-Wise</p>
            <h2 className="mt-3 font-display text-2xl leading-tight">{draft.headline}</h2>
            <p className="mt-2 text-xs opacity-85 line-clamp-3">{draft.subtext}</p>
            <span className="mt-4 inline-block rounded bg-white/95 px-3 py-1.5 text-xs font-medium text-[var(--color-text)]">
              {draft.cta_text}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
