import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearch, useNavigate } from "@tanstack/react-router";
import {
  loginSchema,
  type LoginInputDto,
} from "@orbit/shared/schemas/auth.schema";
import { Button } from "../../../shared/ui/Button";
import { Field } from "../../../shared/ui/Field";
import { Input } from "../../../shared/ui/Input";
import { useLogin } from "../hooks/use-login";
import { ApiError } from "../../../shared/lib/api-client";

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const form = useForm<LoginInputDto>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });
  const login = useLogin();
  const navigate = useNavigate();
  const { redirect: redirectTo } = useSearch({ from: "/login" });

  const onSubmit = form.handleSubmit(async (data) => {
    await login.mutateAsync(data);
    if (redirectTo) {
      window.location.href = redirectTo;
    } else {
      navigate({ to: "/" });
    }
  });

  const serverError =
    login.error instanceof ApiError
      ? login.error.message
      : login.error?.message;

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4" noValidate>
      <Field
        label="Email"
        error={form.formState.errors.email?.message}
        required
      >
        <Input
          type="email"
          autoComplete="email"
          placeholder="tu@ejemplo.com"
          {...form.register("email")}
        />
      </Field>

      <Field
        label="Contraseña"
        error={form.formState.errors.password?.message}
        required
      >
        <div className="relative">
          <Input
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            placeholder="••••••••"
            className="pr-10"
            {...form.register("password")}
          />
          <button
            type="button"
            onClick={() => setShowPassword((visible) => !visible)}
            className="absolute right-2 top-1/2 inline-flex size-7 -translate-y-1/2 items-center justify-center text-muted-foreground hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
            aria-pressed={showPassword}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </Field>

      {serverError && (
        <p role="alert" className="text-sm text-destructive">
          {serverError}
        </p>
      )}

      <Button type="submit" loading={login.isPending} className="w-full">
        {login.isPending ? "Iniciando sesión…" : "Iniciar sesión"}
      </Button>
    </form>
  );
}
