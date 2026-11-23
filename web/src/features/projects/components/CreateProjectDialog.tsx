import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createProjectSchema,
  type CreateProjectInputDto,
} from "@orbit/shared/schemas/project.schema";
import { Button } from "../../../shared/ui/Button";
import { Field } from "../../../shared/ui/Field";
import { Input } from "../../../shared/ui/Input";
import { useCreateProject } from "../hooks/use-create-project";
import { ApiError } from "../../../shared/lib/api-client";

type Props = {
  open: boolean;
  onClose: () => void;
  workspaceSlug: string;
};


export function CreateProjectDialog({ open, onClose, workspaceSlug }: Props) {
  const form = useForm<CreateProjectInputDto>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: { name: "", key: "", description: "" },
  });
  const create = useCreateProject(workspaceSlug);

  if (!open) return null;

  const onSubmit = form.handleSubmit((data) => {
    create.mutate(data, {
      onSuccess: () => {
        form.reset();
        onClose();
      },
    });
  });

  const serverError =
    create.error instanceof ApiError
      ? create.error.message
      : create.error?.message;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="create-project-title"
    >
      <div
        className="bg-card border border-border w-full max-w-md p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h2
          id="create-project-title"
          className="text-lg font-semibold text-foreground mb-1"
        >
          Nuevo proyecto
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          Un proyecto agrupa las tareas de un área de trabajo.
        </p>

        <form onSubmit={onSubmit} className="flex flex-col gap-4" noValidate>
          <Field
            label="Nombre"
            error={form.formState.errors.name?.message}
            required
          >
            <Input autoFocus placeholder="Web App" {...form.register("name")} />
          </Field>

          <Field
            label="Clave"
            error={form.formState.errors.key?.message}
            required
          >
            <Input
              placeholder="WEB"
              maxLength={5}
              className="font-mono uppercase"
              {...form.register("key")}
            />
          </Field>
          <p className="-mt-2 text-[11px] text-muted-foreground">
            Se usará en los IDs de tareas (ej. WEB-12). 2-5 caracteres,
            inmutable.
          </p>

          <Field
            label="Descripción"
            error={form.formState.errors.description?.message}
          >
            <Input placeholder="Opcional" {...form.register("description")} />
          </Field>

          {serverError && (
            <p role="alert" className="text-sm text-destructive">
              {serverError}
            </p>
          )}

          <div className="flex justify-end gap-2 mt-2">
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" loading={create.isPending}>
              {create.isPending ? "Creando…" : "Crear"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
