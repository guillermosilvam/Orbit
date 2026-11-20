import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X, Trash2 } from "lucide-react";
import {
  updateTaskSchema,
  TASK_STATUSES,
  TASK_PRIORITIES,
  type UpdateTaskInputDto,
  type TaskStatus,
  type TaskPriority,
} from "@orbit/shared/schemas/task.schema";
import type { TaskResponseDto } from "@orbit/shared/types/responses";
import { Button } from "../../../shared/ui/Button";
import { Field } from "../../../shared/ui/Field";
import { Input } from "../../../shared/ui/Input";
import { Textarea } from "../../../shared/ui/Textarea";
import { TaskStatusBadge } from "./TaskStatusBadge";
import { useUpdateTaskFields } from "../hooks/use-update-task-fields";
import { useDeleteTask } from "../hooks/use-delete-task";
import { ApiError } from "../../../shared/lib/api-client";
import { z } from "zod";
import { IconButton } from "../../../shared/ui/IconButton";

const drawerFormSchema = updateTaskSchema.omit({ position: true });
type DrawerFormData = z.infer<typeof drawerFormSchema>;

type Props = {
  task: TaskResponseDto | null;
  onClose: () => void;
  workspaceSlug: string;
  projectKey: string;
};

export function TaskDetailDrawer({
  task,
  onClose,
  workspaceSlug,
  projectKey,
}: Props) {
  const update = useUpdateTaskFields(workspaceSlug, projectKey);
  const remove = useDeleteTask(workspaceSlug, projectKey);

  const form = useForm<DrawerFormData>({
    resolver: zodResolver(drawerFormSchema),
    defaultValues: {
      title: "",
      description: "",
      status: "todo",
      priority: "medium",
      dueDate: null,
    },
  });

  useEffect(() => {
    if (task) {
      form.reset({
        title: task.title,
        description: task.description ?? "",
        status: task.status,
        priority: task.priority,
        dueDate: task.dueDate ? task.dueDate.slice(0, 10) : null,
      });
    }
  }, [task?.id]);

  if (!task) return null;

  const onSubmit = form.handleSubmit((data) => {
    const payload: UpdateTaskInputDto = {
      title: data.title,
      description: data.description?.trim() || null,
      status: data.status,
      priority: data.priority,
      dueDate: data.dueDate ? new Date(data.dueDate).toISOString() : null,
    };
    update.mutate(
      { number: task.number, input: payload },
      { onSuccess: () => onClose() },
    );
  });

  const handleDelete = () => {
    if (
      !confirm(
        `¿Eliminar ${task.identifier}? Esta acción no se puede deshacer.`,
      )
    )
      return;
    remove.mutate(task.number, { onSuccess: () => onClose() });
  };

  const serverError =
    update.error instanceof ApiError
      ? update.error.message
      : update.error?.message;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/30"
        onClick={onClose}
        aria-hidden
      />

      {/* Drawer */}
      <aside
        className="fixed right-0 top-0 bottom-0 w-full max-w-140 z-50 bg-card border-l border-border flex flex-col animate-[slideInRight_200ms_cubic-bezier(0.16,1,0.3,1)] motion-reduce:animate-none"
        role="dialog"
        aria-modal="true"
        aria-labelledby="task-detail-title"
      >
        <header className="px-5 py-4 border-b border-border flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <span className="font-mono text-[11px] text-muted-foreground tabular">
              {task.identifier}
            </span>
            <TaskStatusBadge status={task.status} />
          </div>
          <IconButton aria-label="Cerrar" onClick={onClose}>
            <X className="size-4" />
          </IconButton>
        </header>

        <form
          onSubmit={onSubmit}
          className="flex-1 flex flex-col overflow-auto"
          noValidate
        >
          <div className="p-5 flex flex-col gap-5 flex-1">
            {/* Título */}
            <div>
              <label htmlFor="task-detail-title" className="sr-only">
                Título
              </label>
              <Input
                id="task-detail-title"
                placeholder="Título de la tarea"
                className="text-lg font-semibold h-12"
                {...form.register("title")}
              />
              {form.formState.errors.title && (
                <p className="text-xs text-destructive mt-1">
                  {form.formState.errors.title.message}
                </p>
              )}
            </div>

            {/* Descripción */}
            <Field
              label="Descripción"
              error={form.formState.errors.description?.message}
            >
              <Textarea
                placeholder="Añade una descripción…"
                {...form.register("description")}
              />
            </Field>

            {/* Grid de propiedades tipo hairline */}
            <div className="border border-border bg-border grid grid-cols-2 gap-px">
              <div className="bg-card p-3">
                <label className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground block mb-1">
                  Estado
                </label>
                <select
                  className="w-full bg-transparent text-sm text-foreground outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                  {...form.register("status")}
                >
                  {TASK_STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {statusLabel(s)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="bg-card p-3">
                <label className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground block mb-1">
                  Prioridad
                </label>
                <select
                  className="w-full bg-transparent text-sm text-foreground outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                  {...form.register("priority")}
                >
                  {TASK_PRIORITIES.map((p) => (
                    <option key={p} value={p}>
                      {priorityLabel(p)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="bg-card p-3">
                <label className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground block mb-1">
                  Fecha límite
                </label>
                <input
                  type="date"
                  className="w-full bg-transparent text-sm text-foreground outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                  {...form.register("dueDate", {
                    setValueAs: (v: string) => (v === "" ? null : v),
                  })}
                />
              </div>

              <div className="bg-card p-3">
                <label className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground block mb-1">
                  Asignado
                </label>
                <p className="text-sm text-muted-foreground">Sin asignar</p>
              </div>
            </div>

            {serverError && (
              <p role="alert" className="text-sm text-destructive">
                {serverError}
              </p>
            )}
          </div>

          {/* Footer */}
          <div className="px-5 py-4 border-t border-border flex items-center justify-between shrink-0">
            <Button
              type="button"
              variant="ghost"
              onClick={handleDelete}
              loading={remove.isPending}
              className="text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="size-4" />
              Eliminar
            </Button>

            <div className="flex gap-2">
              <Button type="button" variant="ghost" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit" loading={update.isPending}>
                {update.isPending ? "Guardando…" : "Guardar"}
              </Button>
            </div>
          </div>
        </form>
      </aside>
    </>
  );
}

function statusLabel(s: TaskStatus) {
  return { todo: "Pendiente", in_progress: "En progreso", done: "Hecho" }[s];
}
function priorityLabel(p: TaskPriority) {
  return { low: "Baja", medium: "Media", high: "Alta", urgent: "Urgente" }[p];
}
