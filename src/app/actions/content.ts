"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { revalidatePublicSite } from "@/lib/revalidate";

export type ActionState = { ok: boolean; message: string } | null;

/* ----------------------------------------------------------------------------
 * Helpers
 * -------------------------------------------------------------------------- */

function pingPublicSite() {
  return revalidatePublicSite({ paths: ["/"] }).catch(() => null);
}

function s(formData: FormData, key: string): string {
  return String(formData.get(key) ?? "").trim();
}
function i(formData: FormData, key: string, fallback = 0): number {
  const v = Number(formData.get(key));
  return Number.isFinite(v) ? v : fallback;
}
function b(formData: FormData, key: string): boolean {
  const v = formData.get(key);
  return v === "on" || v === "true" || v === "1";
}
function maybe(value: string): string | null {
  return value === "" ? null : value;
}

/* ----------------------------------------------------------------------------
 * Hero  (singleton, id = 'main')
 * -------------------------------------------------------------------------- */

export async function saveHero(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const headline = s(formData, "headline");
  const subtext = s(formData, "subtext");
  const cta_text = s(formData, "cta_text");
  const cta_link = s(formData, "cta_link");
  const background_image_url = s(formData, "background_image_url");

  if (!headline || !subtext || !cta_text || !cta_link) {
    return { ok: false, message: "Headline, subtext, CTA text and CTA link are required." };
  }
  if (headline.length > 120) return { ok: false, message: "Headline must be 120 characters or fewer." };
  if (subtext.length > 300) return { ok: false, message: "Subtext must be 300 characters or fewer." };

  const supabase = await createClient();
  const { error } = await supabase.from("hero").upsert(
    { id: "main", headline, subtext, cta_text, cta_link, background_image_url, updated_at: new Date().toISOString() },
    { onConflict: "id" }
  );
  if (error) return { ok: false, message: error.message };

  revalidatePath("/hero");
  await pingPublicSite();
  return { ok: true, message: "Hero saved — public site refreshing." };
}

/* ----------------------------------------------------------------------------
 * Amenities
 * -------------------------------------------------------------------------- */

export async function saveAmenity(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const id = s(formData, "id");
  const name = s(formData, "name");
  const type = s(formData, "type") as "feature" | "coming_soon";
  const description = maybe(s(formData, "description"));
  const image_url = maybe(s(formData, "image_url"));
  const display_order = i(formData, "display_order", 0);
  const status = (s(formData, "status") || "published") as "published" | "draft";

  if (!name) return { ok: false, message: "Name is required." };
  if (type !== "feature" && type !== "coming_soon") return { ok: false, message: "Invalid type." };

  const supabase = await createClient();
  const payload = { name, type, description, image_url, display_order, status, updated_at: new Date().toISOString() };
  const { error } = id
    ? await supabase.from("amenities").update(payload).eq("id", id)
    : await supabase.from("amenities").insert(payload);
  if (error) return { ok: false, message: error.message };

  revalidatePath("/amenities");
  await pingPublicSite();
  redirect("/amenities");
}

export async function deleteAmenity(formData: FormData) {
  const id = s(formData, "id");
  if (!id) return;
  const supabase = await createClient();
  await supabase.from("amenities").delete().eq("id", id);
  revalidatePath("/amenities");
  await pingPublicSite();
}

/* ----------------------------------------------------------------------------
 * Rooms
 * -------------------------------------------------------------------------- */

export async function saveRoom(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const id = s(formData, "id");
  const name = s(formData, "name");
  const slug = (s(formData, "slug") || name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""));
  const description = maybe(s(formData, "description"));
  const bed_summary = s(formData, "bed_summary");
  const capacity = i(formData, "capacity", 2);
  const priceRaw = s(formData, "price_per_night");
  const price_per_night = priceRaw === "" ? null : Number(priceRaw);
  const hero_image_url = s(formData, "hero_image_url");
  const galleryRaw = s(formData, "gallery");
  const gallery = galleryRaw
    ? galleryRaw.split(/\r?\n/).map((u) => u.trim()).filter(Boolean)
    : [];
  const display_order = i(formData, "display_order", 0);
  const status = (s(formData, "status") || "published") as "published" | "draft";

  if (!name) return { ok: false, message: "Name is required." };
  if (!bed_summary) return { ok: false, message: "Bed summary is required (e.g. \"2 King Beds\")." };
  if (!hero_image_url) return { ok: false, message: "Hero image URL is required." };

  const supabase = await createClient();
  const payload = {
    name, slug, description, bed_summary, capacity, price_per_night,
    hero_image_url, gallery, display_order, status,
    updated_at: new Date().toISOString(),
  };
  const { error } = id
    ? await supabase.from("rooms").update(payload).eq("id", id)
    : await supabase.from("rooms").insert(payload);
  if (error) return { ok: false, message: error.message };

  revalidatePath("/rooms");
  await pingPublicSite();
  redirect("/rooms");
}

export async function deleteRoom(formData: FormData) {
  const id = s(formData, "id");
  if (!id) return;
  const supabase = await createClient();
  await supabase.from("rooms").delete().eq("id", id);
  revalidatePath("/rooms");
  await pingPublicSite();
}

/* ----------------------------------------------------------------------------
 * Testimonials
 * -------------------------------------------------------------------------- */

export async function saveTestimonial(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const id = s(formData, "id");
  const quote = s(formData, "quote");
  const author = s(formData, "author");
  const location = maybe(s(formData, "location"));
  const rating = i(formData, "rating", 5);
  const featured = b(formData, "featured");
  const display_order = i(formData, "display_order", 0);
  const status = (s(formData, "status") || "published") as "published" | "draft";

  if (!quote) return { ok: false, message: "Quote is required." };
  if (!author) return { ok: false, message: "Author is required." };
  if (rating < 1 || rating > 5) return { ok: false, message: "Rating must be 1–5." };

  const supabase = await createClient();
  const payload = { quote, author, location, rating, featured, display_order, status, updated_at: new Date().toISOString() };
  const { error } = id
    ? await supabase.from("testimonials").update(payload).eq("id", id)
    : await supabase.from("testimonials").insert(payload);
  if (error) return { ok: false, message: error.message };

  revalidatePath("/testimonials");
  await pingPublicSite();
  redirect("/testimonials");
}

export async function deleteTestimonial(formData: FormData) {
  const id = s(formData, "id");
  if (!id) return;
  const supabase = await createClient();
  await supabase.from("testimonials").delete().eq("id", id);
  revalidatePath("/testimonials");
  await pingPublicSite();
}

/* ----------------------------------------------------------------------------
 * Contact  (singleton, id = 'main')
 * -------------------------------------------------------------------------- */

export async function saveContact(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const phone = s(formData, "phone");
  const email = s(formData, "email");
  const address = s(formData, "address");
  const maps_link = maybe(s(formData, "maps_link"));
  const copyright_text = s(formData, "copyright_text");
  const footer_tagline = maybe(s(formData, "footer_tagline"));

  if (!phone || !email || !address || !copyright_text) {
    return { ok: false, message: "Phone, email, address and copyright are required." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("contact").upsert(
    { id: "main", phone, email, address, maps_link, copyright_text, footer_tagline, updated_at: new Date().toISOString() },
    { onConflict: "id" }
  );
  if (error) return { ok: false, message: error.message };

  revalidatePath("/contact");
  await pingPublicSite();
  return { ok: true, message: "Contact saved — public site refreshing." };
}
