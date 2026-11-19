import { Link } from "@tanstack/react-router";
import type { TaskResponseDto } from "@orbit/shared/types/responses";
import type { TaskStatus } from "@orbit/shared/schemas/task.schema";
import { TaskStatusBadge } from "./TaskStatusBadge";
import { TaskPriorityBadge } from "./TaskPriorityBadge";

const STATUS_ORDER: TaskStatus[] = ["todo", "in_progress", "done"];
const STATUS_SECTION: Record<TaskStatus, string> = {
  todo: "Pendientes",
  in_progress: "En progreso",
  done: "Hechas",
};

/**
 * Lista agrupada por estado. Cada grupo tiene su contador y sus tareas
 * ordenadas por `position` (que el backend mantiene al crear).
 *
 * Si una tarea tiene `identifier` (WEB-12), se muestra en mono a la
 * izquierda: es el "nombre corto" referenciable.
 */
export function TaskList({
  tasks,
  workspaceSlug,
  projectKey,
}: {
  tasks: TaskResponseDto[];
  workspaceSlug: string;
  projectKey: string;
}) {
  const grouped = STATUS_ORDER.map((status) => ({
    status,
    tasks: tasks.filter((t) => t.status === status),
  }));

  const isEmpty = tasks.length === 0;

  if (isEmpty) {
    return (
      <div className="border border-border bg-card p-12 text-center">
        <h2 className="text-lg font-semibold text-foreground">
          Aún no hay tareas
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Crea la primera tarea de este proyecto.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {grouped.map(({ status, tasks: list }) => {
        if (list.length === 0) return null;
        return (
          <section key={status}>
            <header className="flex items-center gap-2 mb-2">
              <TaskStatusBadge status={status} />
              <span className="font-mono text-[10px] text-muted-foreground">
                {list.length}
              </span>
            </header>

            <div className="border border-border bg-card">
              {list.map((task) => (
                <TaskRow
                  key={task.id}
                  task={task}
                  workspaceSlug={workspaceSlug}
                  projectKey={projectKey}
                />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}

function TaskRow({
  task,
  // workspaceSlug,
  // projectKey,
}: {
  task: TaskResponseDto;
  workspaceSlug: string;
  projectKey: string;
}) {
  return (
    <div className="flex items-center gap-3 px-4 py-3 border-b border-border last:border-b-0 hover:bg-accent transition-colors cursor-pointer">
      <span className="font-mono text-[11px] text-muted-foreground tabular shrink-0 w-16">
        {task.identifier}
      </span>
      <span className="flex-1 text-sm text-foreground truncate">
        {task.title}
      </span>
      <TaskPriorityBadge priority={task.priority} />
    </div>
  );
}
