import { useEffect } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
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
import { useMembers } from "../../workspaces/hooks/use-members";
import { TaskAssigneeAvatar } from "./TaskAssigneeAvatar";
import { TaskDatePicker } from "./TaskDatePicker";
import { SearchableSelect } from "./SearchableSelect";

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
  const membersQuery = useMembers(workspaceSlug);
  const members = membersQuery.data ?? [];

  const form = useForm<DrawerFormData>({
    resolver: zodResolver(drawerFormSchema),
    defaultValues: {
      title: "",
      description: "",
      status: "todo",
      priority: "medium",
      assigneeId: null,
      dueDate: null,
    },
  });
  const currentStatus = useWatch({
    control: form.control,
    name: "status",
  });
  const { reset } = form;

  useEffect(() => {
    if (task) {
      reset({
        title: task.title,
        description: task.description ?? "",
        status: task.status,
        priority: task.priority,
        assigneeId: task.assigneeId,
        dueDate: task.dueDate,
      });
    }
  }, [reset, task]);

  if (!task) return null;

  const onSubmit = form.handleSubmit((data) => {
    const payload: UpdateTaskInputDto = {
      title: data.title,
      description: data.description?.trim() || null,
      status: data.status,
      priority: data.priority,
      assigneeId: data.assigneeId ?? null,
      dueDate: data.dueDate ?? null,
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
            <div className="grid grid-cols-1 gap-px border border-border bg-border sm:grid-cols-2">
              <div className="bg-card p-3">
                <label className="mb-1 block font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                  Estado
                </label>
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
              </div>

              <div className="bg-card p-3">
                <label className="mb-1 block font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                  Prioridad
                </label>
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
              </div>

              <div className="bg-card p-3">
                <label className="mb-1 block font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                  Fecha límite
                </label>
                <Controller
                  control={form.control}
                  name="dueDate"
                  render={({ field }) => (
                    <TaskDatePicker
                      label="Fecha límite"
                      value={field.value ?? null}
                      onChange={field.onChange}
                      status={currentStatus}
                    />
                  )}
                />
              </div>

              <div className="bg-card p-3">
                <label className="mb-1 block font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                  Asignado
                </label>
                <Controller
                  control={form.control}
                  name="assigneeId"
                  render={({ field }) => {
                    const assigneeOptions = [
                      {
                        value: "",
                        label: "Sin asignar",
                        leading: <TaskAssigneeAvatar size="sm" />,
                      },
                      ...members.map((member) => ({
                        value: member.userId,
                        label: member.user.name,
                        searchText: member.user.email,
                        leading: (
                          <TaskAssigneeAvatar member={member} size="sm" />
                        ),
                      })),
                    ];
                    if (
                      task.assigneeId &&
                      !members.some(
                        (member) => member.userId === task.assigneeId,
                      )
                    ) {
                      assigneeOptions.push({
                        value: task.assigneeId,
                        label: "Usuario asignado",
                        searchText: "",
                        leading: (
                          <TaskAssigneeAvatar
                            assigned
                            size="sm"
                          />
                        ),
                      });
                    }

                    return (
                      <SearchableSelect
                        label="Asignado"
                        value={field.value ?? ""}
                        options={assigneeOptions}
                        onChange={(value) => field.onChange(value || null)}
                        searchPlaceholder="Buscar persona…"
                        disabled={membersQuery.isLoading}
                        className="w-full [&>button]:w-full"
                      />
                    );
                  }}
                />
              </div>
            </div>

            {membersQuery.isError && (
              <p role="alert" className="text-xs text-destructive">
                No se pudieron cargar las personas del espacio de trabajo.
              </p>
            )}
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
