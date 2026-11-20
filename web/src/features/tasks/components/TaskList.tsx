import type { TaskResponseDto } from "@orbit/shared/types/responses";
import type { TaskStatus } from "@orbit/shared/schemas/task.schema";
import {
  TASK_PRIORITIES,
  type TaskPriority,
} from "@orbit/shared/schemas/task.schema";
import { TaskStatusBadge } from "./TaskStatusBadge";
import { TaskPriorityBadge } from "./TaskPriorityBadge";
import type { WorkspaceMemberResponseDto } from "@orbit/shared/types/responses";
import { TaskAssigneeAvatar } from "./TaskAssigneeAvatar";
import { DueDateBadge } from "./DueDateBadge";
import type { TaskGroupBy } from "./TaskFilters";

const STATUS_ORDER: TaskStatus[] = ["todo", "in_progress", "done"];
const PRIORITY_ORDER: TaskPriority[] = [...TASK_PRIORITIES].reverse();

type Props = {
  tasks: TaskResponseDto[];
  members?: WorkspaceMemberResponseDto[];
  groupBy?: TaskGroupBy;
  workspaceSlug: string;
  projectKey: string;
  onSelectTask: (task: TaskResponseDto) => void;
};

type TaskGroup = {
  key: string;
  label: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  member?: WorkspaceMemberResponseDto;
  tasks: TaskResponseDto[];
};

const PRIORITY_LABEL: Record<TaskPriority, string> = {
  low: "Baja",
  medium: "Media",
  high: "Alta",
  urgent: "Urgente",
};

export function TaskList({
  tasks,
  members = [],
  groupBy = "status",
  onSelectTask,
}: Props) {
  const grouped = groupTasks(tasks, members, groupBy);

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
      {grouped.map((group) => {
        return (
          <section key={group.key}>
            <header className="flex items-center gap-2 mb-2">
              {group.status ? (
                <TaskStatusBadge status={group.status} />
              ) : group.priority ? (
                <TaskPriorityBadge priority={group.priority} />
              ) : (
                <>
                  <TaskAssigneeAvatar
                    member={group.member}
                    assigned={group.key !== "unassigned"}
                    size="sm"
                  />
                  <span className="text-xs font-medium text-foreground">
                    {group.label}
                  </span>
                </>
              )}
              <span className="font-mono text-[10px] text-muted-foreground">
                {group.tasks.length}
              </span>
            </header>

            <div className="border border-border bg-card">
              {group.tasks.map((task) => (
                <TaskRow
                  key={task.id}
                  task={task}
                  member={members.find(
                    (item) => item.userId === task.assigneeId,
                  )}
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
  member,
  onClick,
}: {
  task: TaskResponseDto;
  member?: WorkspaceMemberResponseDto;
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
      <span className="min-w-0 flex-1 truncate text-sm text-foreground">
        {task.title}
      </span>
      <span className="ml-auto flex shrink-0 items-center gap-2">
        <TaskAssigneeAvatar
          member={member}
          assigned={Boolean(task.assigneeId)}
          size="sm"
        />
        <DueDateBadge
          dueDate={task.dueDate}
          status={task.status}
          compact
        />
        <TaskPriorityBadge priority={task.priority} />
      </span>
    </button>
  );
}

function groupTasks(
  tasks: TaskResponseDto[],
  members: WorkspaceMemberResponseDto[],
  groupBy: TaskGroupBy,
): TaskGroup[] {
  if (groupBy === "status") {
    return STATUS_ORDER.map((status) => ({
      key: status,
      label: status,
      status,
      tasks: tasks.filter((task) => task.status === status),
    })).filter((group) => group.tasks.length > 0);
  }

  if (groupBy === "priority") {
    return PRIORITY_ORDER.map((priority) => ({
      key: priority,
      label: PRIORITY_LABEL[priority],
      priority,
      tasks: tasks.filter((task) => task.priority === priority),
    })).filter((group) => group.tasks.length > 0);
  }

  const assigneeIds = [...new Set(tasks.map((task) => task.assigneeId))].sort(
    (left, right) => {
      if (left === null) return 1;
      if (right === null) return -1;
      const leftName =
        members.find((member) => member.userId === left)?.user.name ?? left;
      const rightName =
        members.find((member) => member.userId === right)?.user.name ?? right;
      return leftName.localeCompare(rightName, "es");
    },
  );

  return assigneeIds.map((assigneeId) => {
    const member = members.find((item) => item.userId === assigneeId);
    return {
      key: assigneeId ?? "unassigned",
      label:
        assigneeId === null
          ? "Sin asignar"
          : (member?.user.name ?? "Persona asignada"),
      member,
      tasks: tasks.filter((task) => task.assigneeId === assigneeId),
    };
  });
}
