import type { TaskStatus } from "@orbit/shared/schemas/task.schema";

const STATUS_LABEL: Record<TaskStatus, string> = {
  todo: "Pendiente",
  in_progress: "En progreso",
  done: "Hecho",
};

const STATUS_COLOR: Record<TaskStatus, string> = {
  todo: "bg-status-todo",
  in_progress: "bg-status-in-progress",
  done: "bg-status-done",
};


export function TaskStatusBadge({ status }: { status: TaskStatus }) {
  return (
    <span className="inline-flex items-center gap-1.5 font-mono text-[11px] text-muted-foreground">
      <span className={`size-2 ${STATUS_COLOR[status]}`} aria-hidden />
      {STATUS_LABEL[status]}
    </span>
  );
}