import type { TaskStatus } from "@orbit/shared/schemas/task.schema";

export type DueDateFilter =
  | "all"
  | "overdue"
  | "today"
  | "next_7_days"
  | "no_date";

export function toDateKey(value: string | null | undefined): string | null {
  return value ? value.slice(0, 10) : null;
}

export function toDueDateIso(dateKey: string | null): string | null {
  return dateKey ? `${dateKey}T00:00:00.000Z` : null;
}

export function localDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function formatDateKey(dateKey: string): string {
  const [year, month, day] = dateKey.split("-").map(Number);
  return new Intl.DateTimeFormat("es", { dateStyle: "medium" }).format(
    new Date(year!, month! - 1, day!),
  );
}

export function describeDueDate(
  value: string | null | undefined,
  status?: TaskStatus,
): { label: string; overdue: boolean; dateKey: string | null } {
  const dateKey = toDateKey(value);
  if (!dateKey) return { label: "", overdue: false, dateKey: null };

  const today = localDateKey(new Date());
  const tomorrowDate = new Date();
  tomorrowDate.setDate(tomorrowDate.getDate() + 1);
  const tomorrow = localDateKey(tomorrowDate);
  const overdue = dateKey < today && status !== "done";

  if (overdue) return { label: "Vencida", overdue, dateKey };
  if (dateKey === today) return { label: "Hoy", overdue, dateKey };
  if (dateKey === tomorrow) return { label: "Mañana", overdue, dateKey };
  return { label: formatDateKey(dateKey), overdue, dateKey };
}

export function matchesDueDateFilter(
  value: string | null,
  status: TaskStatus,
  filter: DueDateFilter,
): boolean {
  if (filter === "all") return true;
  if (filter === "no_date") return value === null;
  if (!value) return false;

  const dateKey = toDateKey(value);
  if (!dateKey) return false;
  const today = localDateKey(new Date());

  if (filter === "overdue") {
    return dateKey < today && status !== "done";
  }
  if (filter === "today") return dateKey === today;

  const endDate = new Date();
  endDate.setDate(endDate.getDate() + 6);
  return dateKey >= today && dateKey <= localDateKey(endDate);
}
