"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { revalidatePublicSite } from "@/lib/revalidate";

export type ActionState = { ok: boolean; message: string } | null;

/* ------------------------------ Hero ------------------------------ */

export async function saveHero(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const headline = String(formData.get("headline") ?? "").trim();
  const subtext = String(formData.get("subtext") ?? "").trim();
  const cta_text = String(formData.get("cta_text") ?? "").trim();
  const cta_link = String(formData.get("cta_link") ?? "").trim();
  const background_image_url = String(formData.get("background_image_url") ?? "").trim();

  if (!headline || !subtext || !cta_text || !cta_link) {
    return { ok: false, message: "Headline, subtext, CTA text and CTA link are required." };
  }
  if (headline.length > 120) {
    return { ok: false, message: "Headline must be 120 characters or fewer." };
  }
  if (subtext.length > 300) {
    return { ok: false, message: "Subtext must be 300 characters or fewer." };
  }

  const supabase = await createClient();
  const payload = {
    id: "main",
    headline,
    subtext,
    cta_text,
    cta_link,
    background_image_url,
    updated_at: new Date().toISOString(),
  };

  const { error } = await supabase.from("hero").upsert(payload, { onConflict: "id" });
  if (error) return { ok: false, message: error.message };

  revalidatePath("/hero");
  await revalidatePublicSite({ paths: ["/"]}).catch(() => null);
  return { ok: true, message: "Hero saved. Public site will refresh shortly." };
}
