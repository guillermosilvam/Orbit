import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import type { TaskResponseDto } from "@orbit/shared/types/responses";
import { useProject } from "../../features/tasks/hooks/use-project";
import { useTasks } from "../../features/tasks/hooks/use-tasks";
import { useWorkspaces } from "../../features/workspaces/hooks/use-workspaces";
import { useMembers } from "../../features/workspaces/hooks/use-members";
import {
  type TaskPriority,
} from "@orbit/shared/schemas/task.schema";
import {
  matchesDueDateFilter,
  type DueDateFilter,
} from "../../features/tasks/lib/task-dates";
import { TaskList } from "../../features/tasks/components/TaskList";
import { KanbanBoard } from "../../features/tasks/components/KanbanBoard";
import {
  TaskFilters,
  type TaskGroupBy,
} from "../../features/tasks/components/TaskFilters";
import { TaskProgress } from "../../features/tasks/components/TaskProgress";
import { CreateTaskDialog } from "../../features/tasks/components/CreateTaskDialog";
import { TaskDetailDrawer } from "../../features/tasks/components/TaskDetailDrawer";
import { Button } from "../../shared/ui/Button";
import { Breadcrumb } from "../../shared/ui/Breadcrumb";
import { Skeleton } from "../../shared/ui/Skeleton";

export const Route = createFileRoute(
  "/_authenticated/workspaces/$workspaceSlug_/projects/$projectKey",
)({
  component: ProjectDetailPage,
});

type Tab = "list" | "board";

function ProjectDetailPage() {
  const { workspaceSlug, projectKey } = Route.useParams();
  const project = useProject(workspaceSlug, projectKey);
  const tasks = useTasks(workspaceSlug, projectKey);
  const { data: workspaces = [] } = useWorkspaces();
  const membersQuery = useMembers(workspaceSlug);
  const members = membersQuery.data ?? [];
  const [createOpen, setCreateOpen] = useState(false);
  const [tab, setTab] = useState<Tab>("list");
  const [priorityFilter, setPriorityFilter] =
    useState<TaskPriority | "all">("all");
  const [assigneeFilter, setAssigneeFilter] = useState("all");
  const [dueDateFilter, setDueDateFilter] = useState<DueDateFilter>("all");
  const [groupBy, setGroupBy] = useState<TaskGroupBy>("status");
  const [selectedTask, setSelectedTask] = useState<TaskResponseDto | null>(
    null,
  );

  const workspace = workspaces.find((w) => w.slug === workspaceSlug);
  const taskList = tasks.data;
  const filteredTasks = taskList?.filter((task) => {
    const matchesPriority =
      priorityFilter === "all" || task.priority === priorityFilter;
    const matchesAssignee =
      assigneeFilter === "all" ||
      (assigneeFilter === "unassigned"
        ? !task.assigneeId
        : task.assigneeId === assigneeFilter);
    return (
      matchesPriority &&
      matchesAssignee &&
      matchesDueDateFilter(task.dueDate, task.status, dueDateFilter)
    );
  });

  const resetFilters = () => {
    setPriorityFilter("all");
    setAssigneeFilter("all");
    setDueDateFilter("all");
  };

  if (project.isLoading) {
    return (
      <div
        role="status"
        aria-label="Cargando proyecto"
        className="mx-auto w-full max-w-6xl p-4 sm:p-6 lg:p-8"
      >
        <Skeleton className="mb-5 h-3 w-40" />
        <Skeleton className="mb-3 h-8 w-64 max-w-full" />
        <Skeleton className="mb-8 h-4 w-80 max-w-full" />
        <div className="space-y-2 border border-border bg-card p-4">
          {Array.from({ length: 4 }, (_, index) => (
            <Skeleton key={index} className="h-10 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (!project.data) {
    return (
      <div className="mx-auto w-full max-w-3xl p-4 sm:p-6 lg:p-8">
        <h1 className="text-2xl font-semibold text-foreground">
          Proyecto no encontrado
        </h1>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-6xl p-4 sm:p-6 lg:p-8">
      <Breadcrumb
        className="mb-4"
        items={[
          {
            label: workspace?.name ?? workspaceSlug,
            to: "/workspaces/$workspaceSlug",
            params: { workspaceSlug },
          },
          { label: project.data.name },
        ]}
      />

      <header className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h1 className="truncate text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              {project.data.name}
            </h1>
            <span className="font-mono text-xs text-muted-foreground border border-border px-1.5 py-0.5">
              {project.data.key}
            </span>
          </div>
          {project.data.description && (
            <p className="text-sm text-muted-foreground mt-1">
              {project.data.description}
            </p>
          )}
        </div>
        <Button
          onClick={() => setCreateOpen(true)}
          className="w-full sm:w-auto"
        >
          <Plus className="size-4" />
          Nueva tarea
        </Button>
      </header>

      {taskList && <TaskProgress tasks={taskList} />}

      <div className="mb-4 flex gap-0 border-b border-border">
        <TabButton active={tab === "list"} onClick={() => setTab("list")}>
          Lista
        </TabButton>
        <TabButton active={tab === "board"} onClick={() => setTab("board")}>
          Tablero
        </TabButton>
      </div>

      {taskList && (
        <TaskFilters
          members={members}
          membersLoading={membersQuery.isLoading}
          priority={priorityFilter}
          assigneeId={assigneeFilter}
          dueDate={dueDateFilter}
          groupBy={groupBy}
          showGrouping={tab === "list"}
          onPriorityChange={setPriorityFilter}
          onAssigneeChange={setAssigneeFilter}
          onDueDateChange={setDueDateFilter}
          onGroupByChange={setGroupBy}
        />
      )}

      {tasks.isError && (
        <p role="alert" className="mb-4 text-sm text-destructive">
          No se pudieron cargar las tareas.{" "}
          {tasks.error instanceof Error ? tasks.error.message : ""}
        </p>
      )}
      {membersQuery.isError && (
        <p role="alert" className="mb-4 text-xs text-destructive">
          No se pudieron cargar los miembros; algunos nombres y avatares pueden
          no aparecer.
        </p>
      )}

      {tasks.isLoading ? (
        tab === "board" ? <BoardSkeleton /> : <TaskListSkeleton />
      ) : taskList && filteredTasks?.length === 0 && taskList.length > 0 ? (
        <div className="border border-border bg-card px-5 py-10 text-center">
          <p className="text-sm text-muted-foreground">
            Ninguna tarea coincide con estos filtros.
          </p>
          <button
            type="button"
            onClick={resetFilters}
            className="mt-3 text-sm font-medium text-primary hover:underline"
          >
            Limpiar filtros
          </button>
        </div>
      ) : taskList && filteredTasks ? (
        tab === "list" ? (
          <TaskList
            tasks={filteredTasks}
            members={members}
            groupBy={groupBy}
            workspaceSlug={workspaceSlug}
            projectKey={projectKey}
            onSelectTask={setSelectedTask}
          />
        ) : (
          <KanbanBoard
            tasks={filteredTasks}
            members={members}
            workspaceSlug={workspaceSlug}
            projectKey={projectKey}
            onSelectTask={setSelectedTask}
          />
        )
      ) : null}

      <CreateTaskDialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        workspaceSlug={workspaceSlug}
        projectKey={projectKey}
      />

      <TaskDetailDrawer
        task={selectedTask}
        onClose={() => setSelectedTask(null)}
        workspaceSlug={workspaceSlug}
        projectKey={projectKey}
      />
    </div>
  );
}

function TaskListSkeleton() {
  return (
    <div role="status" aria-label="Cargando tareas" className="space-y-2">
      {Array.from({ length: 4 }, (_, index) => (
        <Skeleton
          key={index}
          className="h-12 w-full border border-border bg-card"
        />
      ))}
    </div>
  );
}

function BoardSkeleton() {
  return (
    <div
      role="status"
      aria-label="Cargando tablero"
      className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0"
    >
      <div className="grid min-w-3xl grid-cols-3 gap-3">
        {Array.from({ length: 3 }, (_, columnIndex) => (
          <div
            key={columnIndex}
            className="min-h-96 border border-border bg-card p-3"
            aria-hidden="true"
          >
            <Skeleton className="mb-4 h-4 w-24" />
            <div className="space-y-2">
              {Array.from({ length: 3 }, (_, cardIndex) => (
                <Skeleton key={cardIndex} className="h-20 w-full" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors -mb-px ${
        active
          ? "border-primary text-foreground"
          : "border-transparent text-muted-foreground hover:text-foreground"
      }`}
    >
      {children}
    </button>
  );
}
