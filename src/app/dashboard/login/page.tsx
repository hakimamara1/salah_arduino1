"use client";

import { useActionState } from "react";
import { Lock, Loader2 } from "lucide-react";
import { login, type LoginState } from "@/app/dashboard/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const initialState: LoginState = {};

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(login, initialState);

  return (
    <main
      dir="ltr"
      className="flex min-h-screen items-center justify-center bg-secondary px-4 [font-family:system-ui,sans-serif]"
    >
      <div className="w-full max-w-sm rounded-2xl border border-border bg-white p-8 shadow-card">
        <div className="mb-6 flex flex-col items-center text-center">
          <span className="flex size-12 items-center justify-center rounded-xl bg-brand-light text-brand">
            <Lock className="size-6" />
          </span>
          <h1 className="mt-4 text-xl font-bold text-ink">Orders Dashboard</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Enter the admin password to continue.
          </p>
        </div>

        <form action={formAction} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              autoFocus
              required
              aria-invalid={Boolean(state.error)}
            />
          </div>

          {state.error && (
            <p className="text-sm text-destructive">{state.error}</p>
          )}

          <Button type="submit" className="w-full" disabled={pending}>
            {pending ? (
              <>
                <Loader2 className="animate-spin" /> Signing in…
              </>
            ) : (
              "Sign in"
            )}
          </Button>
        </form>
      </div>
    </main>
  );
}
