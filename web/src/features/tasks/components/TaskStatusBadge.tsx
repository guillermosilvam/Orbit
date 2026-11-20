import type { TaskStatus } from "@orbit/shared/schemas/task.schema";

const STATUS_LABEL: Record<TaskStatus, string> = {
  todo: "Pendiente",
  in_progress: "En progreso",
  done: "Hecho",
};

const STATUS_COLOR: Record<TaskStatus, string> = {
  todo: "text-status-todo",
  in_progress: "text-status-in-progress",
  done: "text-status-done",
};


export function TaskStatusBadge({ status }: { status: TaskStatus }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
      <StatusIcon status={status} />
      {STATUS_LABEL[status]}
    </span>
  );
}

function StatusIcon({ status }: { status: TaskStatus }) {
  const colorClass = STATUS_COLOR[status];

  if (status === "done") {
    return (
      <svg
        className={`size-3.5 shrink-0 ${colorClass}`}
        viewBox="0 0 14 14"
        fill="none"
        aria-hidden
      >
        <circle cx="7" cy="7" r="6" fill="currentColor" />
        <path
          d="M4 7L6 9L10 5"
          stroke="white"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  if (status === "in_progress") {
    return (
      <svg
        className={`size-3.5 shrink-0 ${colorClass}`}
        viewBox="0 0 14 14"
        fill="none"
        aria-hidden
      >
        <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.5" />
        {/* Mitad derecha rellena */}
        <path d="M7 1.5 A5.5 5.5 0 0 1 7 12.5 Z" fill="currentColor" />
      </svg>
    );
  }

  return (
    <svg
      className={`size-3.5 shrink-0 ${colorClass}`}
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden
    >
      <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}
