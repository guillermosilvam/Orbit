import type { TaskResponseDto } from "@orbit/shared/types/responses";
import type { TaskStatus } from "@orbit/shared/schemas/task.schema";
import { matchesDueDateFilter } from "../lib/task-dates";

const STATUS_SEGMENTS: Array<{
  status: TaskStatus;
  label: string;
  color: string;
}> = [
  { status: "todo", label: "Pendientes", color: "bg-status-todo" },
  {
    status: "in_progress",
    label: "En progreso",
    color: "bg-status-in-progress",
  },
  { status: "done", label: "Hechas", color: "bg-status-done" },
];

export function TaskProgress({ tasks }: { tasks: TaskResponseDto[] }) {
  const total = tasks.length;
  const counts: Record<TaskStatus, number> = {
    todo: 0,
    in_progress: 0,
    done: 0,
  };
  for (const task of tasks) counts[task.status] += 1;
  const overdue = tasks.filter((task) =>
    matchesDueDateFilter(task.dueDate, task.status, "overdue"),
  ).length;

  return (
    <section
      className="mb-6 border-y border-border py-3"
      aria-label="Progreso del proyecto"
    >
      <div
        className="flex h-1.5 overflow-hidden bg-muted"
        role="img"
        aria-label={`${counts.todo} pendientes, ${counts.in_progress} en progreso, ${counts.done} hechas`}
      >
        {STATUS_SEGMENTS.map(({ status, color }) => (
          <span
            key={status}
            className={color}
            style={{ width: total ? `${(counts[status] / total) * 100}%` : 0 }}
          />
        ))}
      </div>
      <div className="mt-2 flex flex-wrap items-center justify-between gap-x-3 gap-y-1 text-[11px] text-muted-foreground">
        <span>
          {total} {total === 1 ? "tarea" : "tareas"}
          {" · "}
          {counts.todo} pendientes · {counts.in_progress} en progreso ·{" "}
          {counts.done} hechas
        </span>
        {overdue > 0 && (
          <span className="font-medium text-destructive">
            {overdue} {overdue === 1 ? "vencida" : "vencidas"}
          </span>
        )}
      </div>
    </section>
  );
}
