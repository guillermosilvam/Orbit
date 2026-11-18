import { useState } from "react";
import { Button } from "./shared/ui/Button";
import { Field } from "./shared/ui/Field";
import { Input } from "./shared/ui/Input";
import { useLogin } from "./features/auth/hooks/use-login";
import { useMe } from "./features/auth/hooks/use-me";
import { ApiError } from "./shared/lib/api-client";

export default function App() {
  const [email, setEmail] = useState("test@x.com");
  const [password, setPassword] = useState("password123");

  const me = useMe();
  const login = useLogin();

  const errorMessage =
    login.error instanceof ApiError ? login.error.message : login.error?.message;

  return (
    <main className="min-h-screen bg-dots p-8">
      <div className="max-w-md mx-auto border border-border bg-card p-6 flex flex-col gap-6">
        {/* Estado de sesión actual */}
        <div className="border-b border-border pb-4">
          <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground mb-2">
            Session
          </p>
          {me.isLoading && <p className="text-sm text-muted-foreground">Loading…</p>}
          {!me.isLoading && me.data === null && (
            <p className="text-sm text-muted-foreground">Not signed in</p>
          )}
          {me.data && (
            <p className="text-sm text-foreground">
              Signed in as <strong>{me.data.email}</strong>
            </p>
          )}
        </div>

        {/* Form de login */}
        <form
          className="flex flex-col gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            login.mutate(
              { email, password },
              {
                onSuccess: (data) => {
                  console.log("Login OK:", data.user.email);
                },
                onError: (err) => {
                  console.warn("Login failed:", err.message);
                },
              },
            );
          }}
        >
          <Field label="Email" required>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Field>

          <Field label="Password" error={errorMessage} required>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Field>

          <Button type="submit" loading={login.isPending}>
            {login.isPending ? "Signing in…" : "Sign in"}
          </Button>
        </form>
      </div>

      <button
        type="button"
        className="fixed bottom-4 right-4 bg-primary text-primary-foreground px-4 py-2 font-mono text-xs uppercase tracking-wider"
        onClick={() => document.documentElement.classList.toggle("dark")}
      >
        toggle theme
      </button>
    </main>
  );
}