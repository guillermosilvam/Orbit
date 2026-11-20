import type { TaskResponseDto } from "@orbit/shared/types/responses";
import type { TaskStatus } from "@orbit/shared/schemas/task.schema";
import { TaskStatusBadge } from "./TaskStatusBadge";
import { TaskPriorityBadge } from "./TaskPriorityBadge";

const STATUS_ORDER: TaskStatus[] = ["todo", "in_progress", "done"];

type Props = {
  tasks: TaskResponseDto[];
  workspaceSlug: string;
  projectKey: string;
  onSelectTask: (task: TaskResponseDto) => void;
};

export function TaskList({ tasks, onSelectTask }: Props) {
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
                  onClick={() => onSelectTask(task)}
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
  onClick,
}: {
  task: TaskResponseDto;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-2 border-b border-border px-3 py-3 text-left transition-colors last:border-b-0 hover:bg-accent sm:gap-3 sm:px-4"
    >
      <span className="w-14 shrink-0 font-mono text-[10px] text-muted-foreground tabular sm:w-16 sm:text-[11px]">
        {task.identifier}
      </span>
      <span className="flex-1 text-sm text-foreground truncate">
        {task.title}
      </span>
      <TaskPriorityBadge priority={task.priority} />
    </button>
  );
}
