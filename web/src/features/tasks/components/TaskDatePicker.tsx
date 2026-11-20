import { useEffect, useRef, useState } from "react";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import {
  describeDueDate,
  localDateKey,
  toDateKey,
  toDueDateIso,
} from "../lib/task-dates";
import type { TaskStatus } from "@orbit/shared/schemas/task.schema";

type Props = {
  value: string | null;
  onChange: (value: string | null) => void;
  label: string;
  status?: TaskStatus;
};

const WEEKDAYS = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

export function TaskDatePicker({
  value,
  onChange,
  label,
  status,
}: Props) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const selectedKey = toDateKey(value);
  const [month, setMonth] = useState(
    () => {
      const currentDate = selectedKey ? parseDateKey(selectedKey) : new Date();
      return new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    },
  );
  const [today, setToday] = useState(() => localDateKey(new Date()));
  const dueDate = describeDueDate(value, status);
  const daysInMonth = new Date(
    month.getFullYear(),
    month.getMonth() + 1,
    0,
  ).getDate();
  const firstDayOffset =
    (new Date(month.getFullYear(), month.getMonth(), 1).getDay() + 6) % 7;

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  const monthLabel = new Intl.DateTimeFormat("es", {
    month: "long",
    year: "numeric",
  }).format(month);
  const toggleCalendar = () => {
    if (!open) {
      const currentDate = selectedKey ? parseDateKey(selectedKey) : new Date();
      setMonth(new Date(currentDate.getFullYear(), currentDate.getMonth(), 1));
      setToday(localDateKey(new Date()));
      setOpen(true);
    } else {
      setOpen(false);
    }
  };

  return (
    <div ref={rootRef} className="relative min-w-0">
      <button
        type="button"
        aria-label={label}
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={toggleCalendar}
        className="inline-flex h-10 w-full items-center justify-between gap-2 border border-border bg-card px-3 text-left text-sm text-foreground transition-colors hover:bg-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      >
        <span className="inline-flex min-w-0 items-center gap-2">
          <CalendarDays className="size-4 shrink-0 text-muted-foreground" />
          <span className="truncate">
            {dueDate.label || "Elegir fecha"}
          </span>
        </span>
      </button>

      {open && (
        <div
          role="dialog"
          aria-label="Elegir fecha límite"
          className="absolute left-0 top-full z-60 mt-1 w-72 border border-border bg-popover p-3 text-popover-foreground shadow-lg"
        >
          <header className="mb-3 flex items-center justify-between">
            <button
              type="button"
              onClick={() =>
                setMonth(
                  (current) =>
                    new Date(current.getFullYear(), current.getMonth() - 1, 1),
                )
              }
              aria-label="Mes anterior"
              className="inline-flex size-8 items-center justify-center text-muted-foreground hover:bg-accent hover:text-foreground"
            >
              <ChevronLeft className="size-4" />
            </button>
            <p className="text-sm font-medium capitalize text-foreground">
              {monthLabel}
            </p>
            <button
              type="button"
              onClick={() =>
                setMonth(
                  (current) =>
                    new Date(current.getFullYear(), current.getMonth() + 1, 1),
                )
              }
              aria-label="Mes siguiente"
              className="inline-flex size-8 items-center justify-center text-muted-foreground hover:bg-accent hover:text-foreground"
            >
              <ChevronRight className="size-4" />
            </button>
          </header>

          <div className="grid grid-cols-7 gap-1">
            {WEEKDAYS.map((day) => (
              <span
                key={day}
                className="py-1 text-center text-[10px] font-medium text-muted-foreground"
              >
                {day}
              </span>
            ))}
            {Array.from({ length: firstDayOffset }, (_, index) => (
              <span key={`empty-${index}`} aria-hidden />
            ))}
            {Array.from({ length: daysInMonth }, (_, index) => {
              const day = index + 1;
              const dateKey = localDateKey(
                new Date(month.getFullYear(), month.getMonth(), day),
              );
              const isSelected = dateKey === selectedKey;
              const isToday = dateKey === today;
              return (
                <button
                  key={dateKey}
                  type="button"
                  aria-label={formatAccessibleDate(dateKey)}
                  aria-pressed={isSelected}
                  onClick={() => {
                    onChange(toDueDateIso(dateKey));
                    setOpen(false);
                  }}
                  className={`inline-flex size-8 items-center justify-center text-xs transition-colors hover:bg-accent ${
                    isSelected
                      ? "bg-primary text-primary-foreground hover:bg-primary-hover"
                      : isToday
                        ? "border border-primary text-foreground"
                        : "text-foreground"
                  }`}
                >
                  {day}
                </button>
              );
            })}
          </div>

          <div className="mt-3 flex justify-between border-t border-border pt-2">
            <button
              type="button"
              onClick={() => {
                onChange(null);
                setOpen(false);
              }}
              className="px-2 py-1 text-xs text-muted-foreground hover:text-foreground"
            >
              Quitar fecha
            </button>
            <button
              type="button"
              onClick={() => {
                onChange(toDueDateIso(today));
                setOpen(false);
              }}
              className="px-2 py-1 text-xs font-medium text-primary hover:underline"
            >
              Hoy
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function parseDateKey(dateKey: string): Date {
  const [year, month, day] = dateKey.split("-").map(Number);
  return new Date(year!, month! - 1, day!);
}

function formatAccessibleDate(dateKey: string): string {
  return new Intl.DateTimeFormat("es", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(parseDateKey(dateKey));
}
