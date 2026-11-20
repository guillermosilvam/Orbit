import type { TaskPriority } from "@orbit/shared/schemas/task.schema";

const PRIORITY_LABEL: Record<TaskPriority, string> = {
  low: "Baja",
  medium: "Media",
  high: "Alta",
  urgent: "Urgente",
};

const PRIORITY_CLASS: Record<TaskPriority, string> = {
  low: "border-border text-muted-foreground",
  medium: "border-border text-foreground",
  high: "border-status-in-progress text-status-in-progress",
  urgent: "border-destructive text-destructive",
};


export function TaskPriorityBadge({ priority }: { priority: TaskPriority }) {
  return (
    <span
      className={`text-[11px] font-medium border px-1.5 py-0.5 ${PRIORITY_CLASS[priority]}`}
    >
      {PRIORITY_LABEL[priority]}
    </span>
  );
}
