import { useState } from "react";
import {
  Activity as ActivityIcon,
  ArrowRightLeft,
  Building2,
  CirclePlus,
  FolderPlus,
  Search,
  UserRoundPlus,
} from "lucide-react";
import type { ActivityItemDto } from "@orbit/shared/types";
import { Link } from "@tanstack/react-router";
import { Input } from "../../../shared/ui/Input";
import { Skeleton } from "../../../shared/ui/Skeleton";
import { useRecentActivity } from "../hooks/use-recent-activity";

const activityFilters = [
  { value: "all", label: "Todas" },
  { value: "tasks", label: "Tareas" },
  { value: "projects", label: "Proyectos" },
  { value: "team", label: "Equipo" },
] as const;

type ActivityFilter = (typeof activityFilters)[number]["value"];

export function ActivityFeed({ workspaceSlug }: { workspaceSlug: string }) {
  const { data: activities = [], isLoading, error } = useRecentActivity(
    workspaceSlug,
    50,
  );
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<ActivityFilter>("all");
  const searchTerm = search.trim().toLocaleLowerCase();
  const filteredActivities = activities.filter((activity) => {
    const searchableText = [
      activity.actorName,
      activity.workspaceName,
      activity.projectKey,
      activity.projectName,
      activity.taskIdentifier,
      activity.taskTitle,
      describeActivity(activity),
    ]
      .filter(Boolean)
      .join(" ")
      .toLocaleLowerCase();

    return (
      matchesFilter(activity.type, filter) && searchableText.includes(searchTerm)
    );
  });

  return (
    <section
      aria-labelledby="activity-feed-title"
      className="min-w-0 border border-border bg-card"
    >
      <header className="border-b border-border p-4 sm:p-5">
        <div className="flex items-center gap-2">
          <ActivityIcon className="size-4 text-primary" aria-hidden />
          <h2
            id="activity-feed-title"
            className="text-sm font-semibold text-foreground"
          >
            Actividad reciente
          </h2>
        </div>
        <p className="mt-1 text-xs text-muted-foreground">
          Lo último que ha ocurrido en este espacio.
        </p>
      </header>

      <div className="space-y-3 border-b border-border p-4 sm:p-5">
        <label className="relative block">
          <span className="sr-only">Buscar actividad</span>
          <Search
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden
          />
          <Input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Buscar persona, tarea o proyecto"
            className="pl-9"
          />
        </label>
        <div
          role="group"
          aria-label="Filtrar actividad por tipo"
          className="flex flex-wrap gap-1.5"
        >
          {activityFilters.map((option) => (
            <button
              key={option.value}
              type="button"
              aria-pressed={filter === option.value}
              onClick={() => setFilter(option.value)}
              className={`border px-2.5 py-1 text-xs transition-colors ${
                filter === option.value
                  ? "border-primary bg-primary/10 text-foreground"
                  : "border-border text-muted-foreground hover:bg-accent hover:text-foreground"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <ActivitySkeleton />
      ) : (
        <>
          {error && (
            <p
              role="alert"
              className="border-b border-border p-4 text-xs text-destructive"
            >
              No se pudo cargar la actividad.{" "}
              {error instanceof Error ? error.message : ""}
            </p>
          )}
          {activities.length === 0 ? (
            !error && (
              <p className="p-5 text-sm text-muted-foreground">
                Aún no hay actividad reciente. Aparecerá aquí cuando se creen
                proyectos o tareas, cambien de estado o se unan miembros.
              </p>
            )
          ) : filteredActivities.length === 0 ? (
            <div className="p-5 text-sm text-muted-foreground">
              No hay actividad que coincida con esos filtros.
            </div>
          ) : (
            <div className="p-4 sm:p-5">
              {groupActivities(filteredActivities).map((group) => (
                <section key={group.label} className="mb-5 last:mb-0">
                  <h3 className="mb-2 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                    {group.label}
                  </h3>
                  <ol className="space-y-1">
                    {group.items.map((activity) => (
                      <ActivityRow key={activity.id} activity={activity} />
                    ))}
                  </ol>
                </section>
              ))}
            </div>
          )}
        </>
      )}
    </section>
  );
}

function matchesFilter(
  type: ActivityItemDto["type"],
  filter: ActivityFilter,
): boolean {
  if (filter === "all") return true;
  if (filter === "tasks") {
    return type === "task_created" || type === "task_status_changed";
  }
  if (filter === "projects") return type === "project_created";
  return type === "member_joined" || type === "workspace_created";
}

function ActivityRow({ activity }: { activity: ActivityItemDto }) {
  const icon = iconForActivity(activity.type);
  const message = describeActivity(activity);
  const className =
    "flex gap-3 border-l border-border py-2 pl-3 transition-colors hover:border-primary/40 hover:bg-accent/50";
  const contents = (
    <>
      <span className="mt-0.5 inline-flex size-6 shrink-0 items-center justify-center border border-border bg-background text-muted-foreground">
        {icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-xs leading-5 text-foreground">
          <span className="font-medium">{activity.actorName}</span>{" "}
          {message}
        </span>
        <span className="mt-0.5 flex flex-wrap items-center gap-x-1 text-[10px] text-muted-foreground">
          <span>{activity.workspaceName}</span>
          {activity.projectKey && (
            <>
              <span aria-hidden>·</span>
              <span className="font-mono">{activity.projectKey}</span>
            </>
          )}
          <span aria-hidden>·</span>
          <time dateTime={activity.createdAt}>
            {formatTime(activity.createdAt)}
          </time>
        </span>
      </span>
    </>
  );

  return (
    <li>
      {activity.projectKey ? (
        <Link
          to="/workspaces/$workspaceSlug/projects/$projectKey"
          params={{
            workspaceSlug: activity.workspaceSlug,
            projectKey: activity.projectKey,
          }}
          className={className}
        >
          {contents}
        </Link>
      ) : (
        <Link
          to="/workspaces/$workspaceSlug"
          params={{ workspaceSlug: activity.workspaceSlug }}
          search={{ view: "projects" }}
          className={className}
        >
          {contents}
        </Link>
      )}
    </li>
  );
}

function iconForActivity(type: ActivityItemDto["type"]) {
  const iconProps = { className: "size-3.5", "aria-hidden": true as const };
  switch (type) {
    case "workspace_created":
    case "member_joined":
      return type === "workspace_created" ? (
        <Building2 {...iconProps} />
      ) : (
        <UserRoundPlus {...iconProps} />
      );
    case "project_created":
      return <FolderPlus {...iconProps} />;
    case "task_created":
      return <CirclePlus {...iconProps} />;
    case "task_status_changed":
      return <ArrowRightLeft {...iconProps} />;
  }
}

function describeActivity(activity: ActivityItemDto): string {
  switch (activity.type) {
    case "workspace_created":
      return `creó el espacio de trabajo ${activity.workspaceName}`;
    case "member_joined":
      return `se unió al espacio de trabajo ${activity.workspaceName}`;
    case "project_created": {
      const project = [activity.projectKey, activity.projectName]
        .filter(Boolean)
        .join(" · ");
      return `creó el proyecto ${project}`;
    }
    case "task_created":
      return `creó ${activity.taskIdentifier ?? "una tarea"} “${activity.taskTitle ?? ""}”`;
    case "task_status_changed":
      return `movió ${activity.taskIdentifier ?? "una tarea"} a ${statusLabel(activity.newStatus)}`;
  }
}

function statusLabel(status: ActivityItemDto["newStatus"]): string {
  switch (status) {
    case "todo":
      return "Pendiente";
    case "in_progress":
      return "En progreso";
    case "done":
      return "Hecho";
    default:
      return "otro estado";
  }
}

function groupActivities(activities: ActivityItemDto[]) {
  const today = new Date();
  const todayKey = localDateKey(today);
  const yesterday = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() - 1,
  );
  const yesterdayKey = localDateKey(yesterday);
  const groups: { label: string; items: ActivityItemDto[] }[] = [];

  for (const activity of activities) {
    const date = new Date(activity.createdAt);
    const dateKey = localDateKey(date);
    const label =
      dateKey === todayKey
        ? "Hoy"
        : dateKey === yesterdayKey
          ? "Ayer"
          : new Intl.DateTimeFormat("es", { dateStyle: "medium" }).format(date);
    const currentGroup = groups[groups.length - 1];
    if (currentGroup?.label === label) {
      currentGroup.items.push(activity);
    } else {
      groups.push({ label, items: [activity] });
    }
  }

  return groups;
}

function localDateKey(date: Date): string {
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
}

function formatTime(value: string): string {
  return new Intl.DateTimeFormat("es", {
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

function ActivitySkeleton() {
  return (
    <div
      role="status"
      aria-label="Cargando actividad"
      className="space-y-4 p-4 sm:p-5"
    >
      {Array.from({ length: 4 }, (_, index) => (
        <div key={index} className="flex gap-3">
          <Skeleton className="size-6 shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-2.5 w-2/3" />
          </div>
        </div>
      ))}
    </div>
  );
}
