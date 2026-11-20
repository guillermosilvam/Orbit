import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createTaskSchema,
  TASK_STATUSES,
  TASK_PRIORITIES,
  type CreateTaskInputDto,
  type TaskStatus,
  type TaskPriority,
} from "@orbit/shared/schemas/task.schema";
import { Button } from "../../../shared/ui/Button";
import { Field } from "../../../shared/ui/Field";
import { Input } from "../../../shared/ui/Input";
import { useCreateTask } from "../hooks/use-create-task";
import { ApiError } from "../../../shared/lib/api-client";
import { useMembers } from "../../workspaces/hooks/use-members";
import { TaskAssigneeAvatar } from "./TaskAssigneeAvatar";
import { TaskDatePicker } from "./TaskDatePicker";
import { SearchableSelect } from "./SearchableSelect";

type Props = {
  open: boolean;
  onClose: () => void;
  workspaceSlug: string;
  projectKey: string;
};

/**
 * Diálogo de crear tarea con estado, prioridad, asignación y fecha límite.
 *
 * El `number` (WEB-12) lo asigna el backend atómicamente; no va en el form.
 */
export function CreateTaskDialog({
  open,
  onClose,
  workspaceSlug,
  projectKey,
}: Props) {
  const form = useForm<CreateTaskInputDto>({
    resolver: zodResolver(createTaskSchema),
    defaultValues: {
      title: "",
      description: "",
      status: "todo",
      priority: "medium",
      assigneeId: null,
      dueDate: null,
    },
  });
  const create = useCreateTask(workspaceSlug, projectKey);
  const membersQuery = useMembers(workspaceSlug);
  const members = membersQuery.data ?? [];

  if (!open) return null;

  const onSubmit = form.handleSubmit((data) => {
    const payload = {
      ...data,
      description: data.description?.trim() || undefined,
    };
    create.mutate(payload, {
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
      aria-labelledby="create-task-title"
    >
      <div
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto border border-border bg-card p-4 sm:p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h2
          id="create-task-title"
          className="text-lg font-semibold text-foreground mb-1"
        >
          Nueva tarea
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          Se le asignará un identificador como {projectKey}-N.
        </p>

        <form onSubmit={onSubmit} className="flex flex-col gap-4" noValidate>
          <Field
            label="Título"
            error={form.formState.errors.title?.message}
            required
          >
            <Input
              autoFocus
              placeholder="Implementar login"
              {...form.register("title")}
            />
          </Field>

          <Field
            label="Descripción"
            error={form.formState.errors.description?.message}
          >
            <Input placeholder="Opcional" {...form.register("description")} />
          </Field>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Field label="Estado" error={form.formState.errors.status?.message}>
              <Controller
                control={form.control}
                name="status"
                render={({ field }) => (
                  <SearchableSelect
                    label="Estado"
                    value={field.value ?? "todo"}
                    options={TASK_STATUSES.map((status) => ({
                      value: status,
                      label: statusLabel(status),
                    }))}
                    onChange={field.onChange}
                    className="w-full [&>button]:w-full"
                  />
                )}
              />
            </Field>

            <Field
              label="Prioridad"
              error={form.formState.errors.priority?.message}
            >
              <Controller
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <SearchableSelect
                    label="Prioridad"
                    value={field.value ?? "medium"}
                    options={TASK_PRIORITIES.map((priority) => ({
                      value: priority,
                      label: priorityLabel(priority),
                    }))}
                    onChange={field.onChange}
                    className="w-full [&>button]:w-full"
                  />
                )}
              />
            </Field>
          </div>

          <Field
            label="Fecha límite"
            error={form.formState.errors.dueDate?.message}
          >
            <Controller
              control={form.control}
              name="dueDate"
              render={({ field }) => (
                <TaskDatePicker
                  label="Fecha límite"
                  value={field.value ?? null}
                  onChange={field.onChange}
                />
              )}
            />
          </Field>

          <Field
            label="Asignado a"
            error={form.formState.errors.assigneeId?.message}
          >
            <Controller
              control={form.control}
              name="assigneeId"
              render={({ field }) => (
                <SearchableSelect
                  label="Asignado a"
                  value={field.value ?? ""}
                  options={[
                    {
                      value: "",
                      label: "Sin asignar",
                      leading: <TaskAssigneeAvatar />,
                    },
                    ...members.map((member) => ({
                      value: member.userId,
                      label: member.user.name,
                      searchText: member.user.email,
                      leading: (
                        <TaskAssigneeAvatar member={member} size="sm" />
                      ),
                    })),
                  ]}
                  onChange={(value) => field.onChange(value || null)}
                  searchPlaceholder="Buscar persona…"
                  disabled={membersQuery.isLoading}
                  className="w-full [&>button]:w-full"
                />
              )}
            />
            {membersQuery.isError && (
              <p role="alert" className="mt-1 text-xs text-destructive">
                No se pudieron cargar las personas del espacio de trabajo.
              </p>
            )}
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
              {create.isPending ? "Creando…" : "Crear tarea"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

function statusLabel(s: TaskStatus) {
  return { todo: "Pendiente", in_progress: "En progreso", done: "Hecho" }[s];
}
function priorityLabel(p: TaskPriority) {
  return { low: "Baja", medium: "Media", high: "Alta", urgent: "Urgente" }[p];
}
