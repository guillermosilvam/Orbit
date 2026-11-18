import { useState } from "react";
import { Button } from "./shared/ui/Button";
import { Field } from "./shared/ui/Field";
import { Input } from "./shared/ui/Input";

export default function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const emailError =
    submitted && !email.includes("@") ? "Enter a valid email" : undefined;
  const passwordError =
    submitted && password.length < 8 ? "At least 8 characters" : undefined;

  return (
    <main className="min-h-screen bg-dots p-8">
      <div className="max-w-md mx-auto border border-border bg-card p-6">
        <h1 className="font-mono text-xs uppercase tracking-wider text-muted-foreground mb-4">
          Sign in
        </h1>

        <form
          className="flex flex-col gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            setSubmitted(true);
          }}
        >
          <Field label="Email" error={emailError} required>
            <Input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Field>

          <Field label="Password" error={passwordError} required>
            <Input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Field>

          <Button type="submit">Sign in</Button>
        </form>

        <div className="mt-6 flex flex-col gap-2">
          <Field label="Disabled input">
            <Input disabled placeholder="Can't touch this" />
          </Field>
        </div>
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