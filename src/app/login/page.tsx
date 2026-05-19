import type { Metadata } from "next";
import { LoginForm } from "@/app/login/login-form";

export const metadata: Metadata = {
  title: "Sign in",
};

export default function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string }>;
}) {
  return (
    <main className="min-h-svh grid place-items-center bg-[var(--color-bg)] px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="text-center">
          <div className="mx-auto grid h-12 w-12 place-items-center rounded-md bg-[var(--color-brand)] font-display text-xl text-[var(--color-brand-foreground)]">
            H
          </div>
          <h1 className="mt-6 font-display text-3xl">Hotel A-Wise</h1>
          <p className="mt-1 text-sm text-[var(--color-text-muted)]">Content Management System</p>
        </div>

        <div className="card mt-8 p-6">
          <LoginForm searchParams={searchParams} />
        </div>

        <p className="mt-6 text-center text-xs uppercase tracking-[0.25em] text-[var(--color-text-soft)]">
          Authorized Access Only
        </p>
      </div>
    </main>
  );
}
