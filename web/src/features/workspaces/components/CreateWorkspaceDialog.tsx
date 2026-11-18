import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createWorkspaceSchema,
  type CreateWorkspaceInputDto,
} from "@orbit/shared/schemas/workspace.schema";
import { Button } from "../../../shared/ui/Button";
import { Field } from "../../../shared/ui/Field";
import { Input } from "../../../shared/ui/Input";
import { useCreateWorkspace } from "../hooks/use-create-workspace";
import { ApiError } from "../../../shared/lib/api-client";

type Props = {
  open: boolean;
  onClose: () => void;
};


export function CreateWorkspaceDialog({ open, onClose }: Props) {
  const form = useForm<CreateWorkspaceInputDto>({
    resolver: zodResolver(createWorkspaceSchema),
    defaultValues: { name: "" },
  });
  const create = useCreateWorkspace();

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
      aria-labelledby="create-workspace-title"
    >
      <div
        className="bg-card border border-border w-full max-w-md p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h2
          id="create-workspace-title"
          className="text-lg font-semibold text-foreground mb-1"
        >
          Nuevo workspace
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          Crea un espacio para tu equipo.
        </p>

        <form onSubmit={onSubmit} className="flex flex-col gap-4" noValidate>
          <Field
            label="Nombre"
            error={form.formState.errors.name?.message}
            required
          >
            <Input
              autoFocus
              placeholder="Acme Corp"
              {...form.register("name")}
            />
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
