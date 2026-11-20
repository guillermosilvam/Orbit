import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  updateProjectSchema,
  type UpdateProjectInputDto,
} from "@orbit/shared/schemas/project.schema";
import type { ProjectResponseDto } from "@orbit/shared/types/responses";
import { ApiError } from "../../../shared/lib/api-client";
import { Button } from "../../../shared/ui/Button";
import { Field } from "../../../shared/ui/Field";
import { Input } from "../../../shared/ui/Input";
import { useUpdateProject } from "../hooks/use-update-project";

type Props = {
  open: boolean;
  onClose: () => void;
  workspaceSlug: string;
  project: ProjectResponseDto;
};

export function ProjectSettingsDialog({
  open,
  onClose,
  workspaceSlug,
  project,
}: Props) {
  const form = useForm<UpdateProjectInputDto>({
    resolver: zodResolver(updateProjectSchema),
    defaultValues: {
      name: project.name,
      description: project.description ?? "",
    },
  });
  const update = useUpdateProject(workspaceSlug, project.key);
  const { reset } = form;

  useEffect(() => {
    if (open) {
      reset({
        name: project.name,
        description: project.description ?? "",
      });
    }
  }, [open, project, reset]);

  if (!open) return null;

  const onSubmit = form.handleSubmit((data) => {
    update.mutate(
      {
        name: data.name,
        description: data.description?.trim() || null,
      },
      { onSuccess: onClose },
    );
  });

  const serverError =
    update.error instanceof ApiError
      ? update.error.message
      : update.error?.message;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-3 sm:p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="project-settings-title"
    >
      <div
        className="max-h-[90dvh] w-full max-w-md overflow-y-auto border border-border bg-card p-5 sm:p-6"
        onClick={(event) => event.stopPropagation()}
      >
        <h2
          id="project-settings-title"
          className="mb-1 text-lg font-semibold text-foreground"
        >
          Editar proyecto
        </h2>
        <p className="mb-4 text-sm text-muted-foreground">
          La clave <span className="font-mono">{project.key}</span> no se puede
          cambiar.
        </p>

        <form onSubmit={onSubmit} className="flex flex-col gap-4" noValidate>
          <Field label="Nombre" error={form.formState.errors.name?.message} required>
            <Input {...form.register("name")} />
          </Field>
          <Field
            label="Descripción"
            error={form.formState.errors.description?.message}
          >
            <Input
              placeholder="Opcional"
              {...form.register("description")}
            />
          </Field>

          {serverError && (
            <p role="alert" className="text-sm text-destructive">
              {serverError}
            </p>
          )}

          <div className="mt-2 flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" loading={update.isPending}>
              Guardar cambios
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
