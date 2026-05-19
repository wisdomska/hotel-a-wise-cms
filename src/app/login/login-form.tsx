"use client";

import { use, useActionState, useState } from "react";
import { signIn, type AuthState } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { FormFeedback } from "@/components/form-status";

export function LoginForm({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string }>;
}) {
  const params = use(searchParams);
  const [state, formAction, pending] = useActionState<AuthState, FormData>(signIn, null);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form action={formAction} className="space-y-5">
      <input type="hidden" name="redirect" value={params.redirect ?? "/"} />

      <Field label="Email address" required>
        <Input
          name="email"
          type="email"
          autoComplete="email"
          required
          placeholder="you@hotelawise.com"
        />
      </Field>

      <Field label="Password" required>
        <div className="relative">
          <Input
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            required
            placeholder="••••••••"
            className="pr-12"
          />
          <button
            type="button"
            onClick={() => setShowPassword((s) => !s)}
            className="absolute inset-y-0 right-0 grid w-12 place-items-center text-[var(--color-text-soft)] hover:text-[var(--color-text)]"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? "🙈" : "👁"}
          </button>
        </div>
      </Field>

      <FormFeedback state={state} />

      <Button type="submit" size="lg" className="w-full" disabled={pending}>
        {pending ? "Signing in…" : "Sign in"}
      </Button>
    </form>
  );
}
