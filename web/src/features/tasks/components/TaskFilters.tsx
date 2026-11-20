import type { TaskPriority } from "@orbit/shared/schemas/task.schema";
import type { WorkspaceMemberResponseDto } from "@orbit/shared/types/responses";
import type { DueDateFilter } from "../lib/task-dates";
import { TaskAssigneeAvatar } from "./TaskAssigneeAvatar";
import { SearchableSelect } from "./SearchableSelect";

export type TaskGroupBy = "status" | "priority" | "assignee";

type Props = {
  members: WorkspaceMemberResponseDto[];
  priority: TaskPriority | "all";
  assigneeId: string;
  dueDate: DueDateFilter;
  groupBy: TaskGroupBy;
  showGrouping: boolean;
  membersLoading?: boolean;
  onPriorityChange: (value: TaskPriority | "all") => void;
  onAssigneeChange: (value: string) => void;
  onDueDateChange: (value: DueDateFilter) => void;
  onGroupByChange: (value: TaskGroupBy) => void;
};

const priorityOptions = [
  { value: "all", label: "Todas" },
  { value: "urgent", label: "Urgente" },
  { value: "high", label: "Alta" },
  { value: "medium", label: "Media" },
  { value: "low", label: "Baja" },
];

const dateOptions = [
  { value: "all", label: "Cualquier fecha" },
  { value: "overdue", label: "Vencidas" },
  { value: "today", label: "Hoy" },
  { value: "next_7_days", label: "Próximos 7 días" },
  { value: "no_date", label: "Sin fecha" },
];

const groupOptions = [
  { value: "status", label: "Estado" },
  { value: "priority", label: "Prioridad" },
  { value: "assignee", label: "Asignado" },
];

export function TaskFilters({
  members,
  priority,
  assigneeId,
  dueDate,
  groupBy,
  showGrouping,
  membersLoading = false,
  onPriorityChange,
  onAssigneeChange,
  onDueDateChange,
  onGroupByChange,
}: Props) {
  const memberOptions = [
    { value: "all", label: "Cualquiera" },
    { value: "unassigned", label: "Sin asignar" },
    ...members.map((member) => ({
      value: member.userId,
      label: member.user.name,
      searchText: member.user.email,
      leading: <TaskAssigneeAvatar member={member} size="sm" />,
    })),
  ];

  return (
    <div className="mb-4 flex flex-wrap items-center gap-2">
      <SearchableSelect
        label="Filtrar por prioridad"
        prefix="Prioridad"
        value={priority}
        options={priorityOptions}
        onChange={(value) => onPriorityChange(value as TaskPriority | "all")}
      />
      <SearchableSelect
        label="Filtrar por asignado"
        prefix="Asignado"
        value={assigneeId}
        options={memberOptions}
        onChange={onAssigneeChange}
        searchPlaceholder="Buscar persona…"
        disabled={membersLoading}
      />
      <SearchableSelect
        label="Filtrar por fecha"
        prefix="Fecha"
        value={dueDate}
        options={dateOptions}
        onChange={(value) => onDueDateChange(value as DueDateFilter)}
      />
      {showGrouping && (
        <SearchableSelect
          label="Agrupar tareas"
          prefix="Agrupar"
          value={groupBy}
          options={groupOptions}
          onChange={(value) => onGroupByChange(value as TaskGroupBy)}
        />
      )}
    </div>
  );
}
