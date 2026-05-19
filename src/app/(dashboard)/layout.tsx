import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Profile } from "@/types/content";
import { Sidebar } from "@/components/sidebar";

async function getProfile(userId: string, fallbackEmail: string, fallbackName: string | null): Promise<Profile> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("profiles")
      .select("id, email, full_name, role")
      .eq("id", userId)
      .maybeSingle<Profile>();
    if (data) return data;
  } catch {
    // table not yet provisioned — fall through to derived profile
  }
  return {
    id: userId,
    email: fallbackEmail,
    full_name: fallbackName,
    role: "admin",
  };
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const profile = await getProfile(
    user.id,
    user.email ?? "",
    (user.user_metadata?.full_name as string) ?? null
  );

  return (
    <div className="flex min-h-svh bg-[var(--color-bg)]">
      <Sidebar profile={profile} />
      <div className="flex-1 min-w-0">
        <main className="mx-auto w-full max-w-5xl px-6 py-8 md:px-10 md:py-12">
          {children}
        </main>
      </div>
    </div>
  );
}
