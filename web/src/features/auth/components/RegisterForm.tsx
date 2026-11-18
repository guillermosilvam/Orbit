import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
  const form = useForm<RegisterInputDto>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", password: "" },
  });

  const register = useRegister();

  const onSubmit = form.handleSubmit((data) => {
    register.mutate(data);
  });

  const serverError =
    register.error instanceof ApiError
      ? register.error.message
      : register.error?.message;

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4" noValidate>
      <Field label="Nombre" error={form.formState.errors.name?.message} required>
        <Input
          type="text"
          autoComplete="name"
          placeholder="Juan Perez"
          {...form.register("name")}
        />
      </Field>

      <Field label="Email" error={form.formState.errors.email?.message} required>
        <Input
          type="email"
          autoComplete="email"
          placeholder="usuario@ejemplo.com"
          {...form.register("email")}
        />
      </Field>

      <Field
        label="Contraseña"
        error={form.formState.errors.password?.message}
        required
      >
        <Input
          type="password"
          autoComplete="new-password"
          placeholder="••••••••"
          {...form.register("password")}
        />
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