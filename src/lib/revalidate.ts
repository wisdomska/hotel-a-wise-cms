import "server-only";

/**
 * Pings the public site's revalidation endpoint to bust its ISR cache after
 * a CMS edit. Configure via PUBLIC_SITE_URL + REVALIDATION_SECRET env vars.
 */
export async function revalidatePublicSite(body: { paths?: string[]; tags?: string[] }) {
  const url = process.env.PUBLIC_SITE_URL;
  const secret = process.env.REVALIDATION_SECRET;
  if (!url || !secret) return { ok: false, skipped: true as const };

  const res = await fetch(`${url.replace(/\/$/, "")}/api/revalidate`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-revalidate-secret": secret,
    },
    body: JSON.stringify(body),
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Revalidate failed: ${res.status} ${text}`);
  }
  return { ok: true, skipped: false as const };
}
