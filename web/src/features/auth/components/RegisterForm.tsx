import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearch, useNavigate } from "@tanstack/react-router";
import {
  registerSchema,
  type RegisterInputDto,
} from "@orbit/shared/schemas/auth.schema";
import { Button } from "../../../shared/ui/Button";
import { Field } from "../../../shared/ui/Field";
import { Input } from "../../../shared/ui/Input";
import { useRegister } from "../hooks/use-register";
import { ApiError } from "../../../shared/lib/api-client";

export function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const form = useForm<RegisterInputDto>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", password: "" },
  });
  const register = useRegister();
  const navigate = useNavigate();
  const { redirect: redirectTo } = useSearch({ from: "/register" });

  const onSubmit = form.handleSubmit(async (data) => {
    await register.mutateAsync(data);
    if (redirectTo) {
      window.location.href = redirectTo;
    } else {
      navigate({ to: "/" });
    }
  });

  const serverError =
    register.error instanceof ApiError
      ? register.error.message
      : register.error?.message;

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4" noValidate>
      <Field
        label="Nombre"
        error={form.formState.errors.name?.message}
        required
      >
        <Input
          type="text"
          autoComplete="name"
          placeholder="Ada Lovelace"
          {...form.register("name")}
        />
      </Field>

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
            autoComplete="new-password"
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

      <Button type="submit" loading={register.isPending} className="w-full">
        {register.isPending ? "Creando cuenta…" : "Crear cuenta"}
      </Button>
    </form>
  );
}
