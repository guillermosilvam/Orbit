import { useForm } from "react-hook-form";
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

type Props = {
  open: boolean;
  onClose: () => void;
  workspaceSlug: string;
  projectKey: string;
};

/**
 * Diálogo de crear tarea. Cinco campos:
 * - title: obligatorio.
 * - description: opcional.
 * - status: select (todo/in_progress/done), default todo.
 * - priority: select (low/medium/high/urgent), default medium.
 * - dueDate: opcional, input date.
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
      dueDate: null,
    },
  });
  const create = useCreateTask(workspaceSlug, projectKey);

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
        className="bg-card border border-border w-full max-w-lg p-6"
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

          <div className="grid grid-cols-2 gap-3">
            <Field label="Estado" error={form.formState.errors.status?.message}>
              <select
                className="h-10 w-full border border-border bg-card px-3 font-sans text-sm text-foreground focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-ring"
                {...form.register("status")}
              >
                {TASK_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {statusLabel(s)}
                  </option>
                ))}
              </select>
            </Field>

            <Field
              label="Prioridad"
              error={form.formState.errors.priority?.message}
            >
              <select
                className="h-10 w-full border border-border bg-card px-3 font-sans text-sm text-foreground focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-ring"
                {...form.register("priority")}
              >
                {TASK_PRIORITIES.map((p) => (
                  <option key={p} value={p}>
                    {priorityLabel(p)}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <Field
            label="Fecha límite"
            error={form.formState.errors.dueDate?.message}
          >
            <Input
              type="date"
              {...form.register("dueDate", {
                setValueAs: (v: string) =>
                  v === "" ? null : new Date(v).toISOString(),
              })}
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
