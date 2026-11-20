import { useQueries } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import type { TaskStatus } from "@orbit/shared/schemas/task.schema";
import { useProjects } from "../../projects/hooks/use-projects";
import { useMembers } from "../../workspaces/hooks/use-members";
import { tasksListQueryOptions } from "../api/tasks-queries";
import { DueDateBadge } from "./DueDateBadge";
import { TaskAssigneeAvatar } from "./TaskAssigneeAvatar";
import { TaskPriorityBadge } from "./TaskPriorityBadge";
import { TaskStatusBadge } from "./TaskStatusBadge";
import { Skeleton } from "../../../shared/ui/Skeleton";

type Props = {
  workspaceSlug: string;
  workspaceName: string;
  userId: string;
};

const STATUS_ORDER: TaskStatus[] = ["todo", "in_progress", "done"];

export function MyTasksView({
  workspaceSlug,
  workspaceName,
  userId,
}: Props) {
  const projectsQuery = useProjects(workspaceSlug);
  const projects = projectsQuery.data ?? [];
  const membersQuery = useMembers(workspaceSlug);
  const members = membersQuery.data ?? [];
  const taskQueries = useQueries({
    queries: projects.map((project) =>
      tasksListQueryOptions(workspaceSlug, project.key),
    ),
  });

  const tasksLoading =
    projectsQuery.isLoading || taskQueries.some((query) => query.isLoading);
  const tasksError =
    projectsQuery.error ??
    taskQueries.find((query) => query.isError)?.error ??
    null;
  const myTasks = projects
    .flatMap((project, index) =>
      (taskQueries[index]?.data ?? [])
        .filter((task) => task.assigneeId === userId)
        .map((task) => ({ task, project })),
    )
    .sort((left, right) => {
      const leftDate = left.task.dueDate?.slice(0, 10) ?? "9999-12-31";
      const rightDate = right.task.dueDate?.slice(0, 10) ?? "9999-12-31";
      return leftDate.localeCompare(rightDate);
    });

  return (
    <div>
      <header className="mb-6">
        <p className="mb-1 text-xs text-muted-foreground">{workspaceName}</p>
        <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          Mis tareas
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Tareas asignadas a ti en todos los proyectos de este espacio.
        </p>
      </header>

      {tasksLoading ? (
        <MyTasksSkeleton />
      ) : tasksError ? (
        <p
          role="alert"
          className="border border-destructive/30 bg-card p-4 text-sm text-destructive"
        >
          No se pudieron cargar tus tareas.{" "}
          {tasksError instanceof Error ? tasksError.message : ""}
        </p>
      ) : myTasks.length === 0 ? (
        <div className="border border-border bg-card px-5 py-12 text-center sm:px-12">
          <h3 className="text-lg font-semibold text-foreground">
            No tienes tareas asignadas
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Cuando te asignen una tarea, aparecerá aquí.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {STATUS_ORDER.map((status) => {
            const items = myTasks.filter((item) => item.task.status === status);
            if (!items.length) return null;

            return (
              <section key={status}>
                <header className="mb-2 flex items-center gap-2">
                  <TaskStatusBadge status={status} />
                  <span className="font-mono text-[10px] text-muted-foreground">
                    {items.length}
                  </span>
                </header>
                <div className="border border-border bg-card">
                  {items.map(({ task, project }) => (
                    <Link
                      key={task.id}
                      to="/workspaces/$workspaceSlug/projects/$projectKey"
                      params={{ workspaceSlug, projectKey: project.key }}
                      className="flex flex-wrap items-center gap-2 border-b border-border px-3 py-3 transition-colors last:border-b-0 hover:bg-accent sm:flex-nowrap sm:gap-3 sm:px-4"
                    >
                      <span className="w-16 shrink-0 font-mono text-[10px] text-muted-foreground sm:text-[11px]">
                        {task.identifier}
                      </span>
                      <span className="min-w-0 flex-1 truncate text-sm text-foreground">
                        {task.title}
                      </span>
                      <span className="mr-auto inline-flex items-center gap-1.5 text-[10px] text-muted-foreground sm:mr-0">
                        <span className="font-mono">{project.key}</span>
                        <span aria-hidden>·</span>
                        <span className="max-w-28 truncate">{project.name}</span>
                      </span>
                      <span className="ml-auto flex shrink-0 items-center gap-2 sm:ml-0">
                        <TaskAssigneeAvatar
                          member={members.find(
                            (member) => member.userId === task.assigneeId,
                          )}
                          assigned
                          size="sm"
                        />
                        <DueDateBadge
                          dueDate={task.dueDate}
                          status={task.status}
                          compact
                        />
                        <TaskPriorityBadge priority={task.priority} />
                      </span>
                    </Link>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      )}

      {membersQuery.isError && (
        <p role="alert" className="mt-4 text-xs text-destructive">
          No se pudieron cargar los datos de asignación.
        </p>
      )}
    </div>
  );
}

function MyTasksSkeleton() {
  return (
    <div role="status" aria-label="Cargando tus tareas">
      <div className="space-y-2 border border-border bg-card p-3">
        {Array.from({ length: 5 }, (_, index) => (
          <Skeleton key={index} className="h-10 w-full" />
        ))}
      </div>
    </div>
  );
}
