import { CalendarDays } from "lucide-react";
import type { TaskStatus } from "@orbit/shared/schemas/task.schema";
import { describeDueDate, formatDateKey } from "../lib/task-dates";

export function DueDateBadge({
  dueDate,
  status,
  compact = false,
}: {
  dueDate: string | null;
  status: TaskStatus;
  compact?: boolean;
}) {
  if (!dueDate) return null;

  const due = describeDueDate(dueDate, status);
  if (!due.dateKey) return null;

  return (
    <span
      title={formatDateKey(due.dateKey)}
      className={`inline-flex min-w-0 items-center gap-1 text-[11px] ${
        due.overdue ? "text-destructive" : "text-muted-foreground"
      }`}
    >
      <CalendarDays className="size-3 shrink-0" />
      <span className={compact ? "max-w-24 truncate sm:max-w-none" : ""}>
        {due.label}
      </span>
    </span>
  );
}
