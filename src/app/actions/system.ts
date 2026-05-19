"use server";

import { revalidatePublicSite } from "@/lib/revalidate";

export async function revalidateNow() {
  await revalidatePublicSite({ paths: ["/"]});
}
