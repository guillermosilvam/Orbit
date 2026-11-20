import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Plus, Trash2, UserPlus, Users } from "lucide-react";
import { useWorkspace } from "../../features/workspaces/hooks/use-workspace";
import { useDeleteWorkspace } from "../../features/workspaces/hooks/use-delete-workspace";
import { useProjects } from "../../features/projects/hooks/use-projects";
import { ProjectCard } from "../../features/projects/components/ProjectCard";
import { CreateProjectDialog } from "../../features/projects/components/CreateProjectDialog";
import { Button } from "../../shared/ui/Button";
import { IconButton } from "../../shared/ui/IconButton";
import { Skeleton } from "../../shared/ui/Skeleton";
import { ConfirmDialog } from "../../shared/ui/ConfirmDialog";
import { formatWorkspaceRole } from "../../features/workspaces/lib/format-role";
import { z } from "zod";
import { MyTasksView } from "../../features/tasks/components/MyTasksView";
import { ActivityFeed } from "../../features/activity/components/ActivityFeed";

export const Route = createFileRoute(
  "/_authenticated/workspaces/$workspaceSlug",
)({
  validateSearch: z.object({
    view: z.enum(["projects", "my-tasks", "activity"]).optional(),
  }),
  component: WorkspaceDetailPage,
});

function WorkspaceDetailPage() {
  const { workspaceSlug } = Route.useParams();
  const { view } = Route.useSearch();
  const { auth } = Route.useRouteContext();
  const workspaceQuery = useWorkspace(workspaceSlug);
  const workspace = workspaceQuery.data;
  const deleteWorkspace = useDeleteWorkspace(workspaceSlug);
  const { data: projects = [], isLoading: loadingProjects } =
    useProjects(workspaceSlug);
  const [createOpen, setCreateOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  if (workspaceQuery.isLoading) {
    return (
      <div className="mx-auto w-full max-w-6xl p-4 sm:p-6 lg:p-8">
        <WorkspacePageSkeleton />
      </div>
    );
  }

  if (!workspace) {
    return (
      <div className="mx-auto w-full max-w-3xl p-4 sm:p-6 lg:p-8">
        <h1 className="text-2xl font-semibold text-foreground">
          {workspaceQuery.error instanceof Error
            ? workspaceQuery.error.message
            : "Espacio de trabajo no encontrado"}
        </h1>
        <p className="text-sm text-muted-foreground mt-2">
          No eres miembro de este espacio de trabajo o no existe.
        </p>
      </div>
    );
  }

  const canManage = workspace.role === "owner" || workspace.role === "admin";

  if (view === "my-tasks" && auth.user) {
    return (
      <div className="mx-auto w-full max-w-4xl p-4 sm:p-6 lg:p-8">
        <MyTasksView
          workspaceSlug={workspaceSlug}
          workspaceName={workspace.name}
          userId={auth.user.id}
        />
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-6xl p-4 sm:p-6 lg:p-8">
      <header className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs text-muted-foreground mb-1">
            Espacio de trabajo ·{" "}
            <span className="font-medium text-foreground">
              {formatWorkspaceRole(workspace.role)}
            </span>
          </p>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            {workspace.name}
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link
            to="/workspaces/$workspaceSlug/members"
            params={{ workspaceSlug }}
            aria-label="Ver miembros"
          >
            <IconButton aria-label="Ver miembros">
              <Users className="size-4" />
            </IconButton>
          </Link>
          {canManage && (
            <Link
              to="/workspaces/$workspaceSlug/invitations"
              params={{ workspaceSlug }}
              aria-label="Invitaciones"
            >
              <IconButton aria-label="Invitaciones">
                <UserPlus className="size-4" />
              </IconButton>
            </Link>
          )}
             
          {canManage && (
            <Button onClick={() => setCreateOpen(true)}>
              <Plus className="size-4" />
              Nuevo proyecto
            </Button>
          )}
        </div>
      </header>

      {view === "activity" ? (
        <ActivityFeed workspaceSlug={workspaceSlug} />
      ) : (
        <>
          {loadingProjects && (
            <div role="status" aria-label="Cargando proyectos">
              <ProjectCardsSkeleton />
            </div>
          )}

          {!loadingProjects && projects.length === 0 && (
            <div className="border border-border bg-card px-5 py-12 text-center sm:px-12">
              <h2 className="text-lg font-semibold text-foreground">
                Aún no hay proyectos
              </h2>
              <p className="text-sm text-muted-foreground mt-1 mb-6">
                Los proyectos agrupan las tareas de un área de trabajo.
              </p>
              {canManage && (
                <Button onClick={() => setCreateOpen(true)}>
                  <Plus className="size-4" />
                  Crear mi primer proyecto
                </Button>
              )}
            </div>
          )}

          {!loadingProjects && projects.length > 0 && (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {projects.map((p) => (
                <ProjectCard
                  key={p.id}
                  project={p}
                  workspaceSlug={workspaceSlug}
                />
              ))}
            </div>
          )}
        </>
      )}

      {canManage && (
        <CreateProjectDialog
          open={createOpen}
          onClose={() => setCreateOpen(false)}
          workspaceSlug={workspaceSlug}
        />
      )}
      {deleteOpen && view !== "activity" && (
        <ConfirmDialog
          title="Eliminar espacio de trabajo"
          description="Esta acción es permanente y eliminará todos los proyectos, tareas, miembros e invitaciones del espacio."
          confirmLabel="Eliminar espacio"
          requiredText={workspace.name}
          onClose={() => setDeleteOpen(false)}
          onConfirm={() => deleteWorkspace.mutate()}
        />
      )}
      {workspace?.role === "owner" && view !== "activity" && (
        <section className="mt-10 flex flex-col gap-4 border border-destructive/30 bg-card p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
          <div>
            <h2 className="text-sm font-semibold text-foreground">
              Zona de peligro
            </h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Eliminar el proyecto también eliminará todas sus tareas.
            </p>
          </div>
          <Button
            variant="destructive"
            loading={deleteWorkspace.isPending}
            onClick={() => setDeleteOpen(true)}
            className="w-full shrink-0 sm:w-auto"
          >
            <Trash2 className="size-4" />
            Eliminar proyecto
          </Button>
        </section>
      )}
    </div>
  );
}

function WorkspacePageSkeleton() {
  return (
    <div role="status" aria-label="Cargando espacio de trabajo">
      <Skeleton className="mb-2 h-3 w-32" />
      <Skeleton className="mb-8 h-8 w-64 max-w-full" />
      <ProjectCardsSkeleton />
    </div>
  );
}

function ProjectCardsSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 3 }, (_, index) => (
        <div
          key={index}
          className="border border-border bg-card p-5"
          aria-hidden="true"
        >
          <Skeleton className="mb-5 h-4 w-16" />
          <Skeleton className="mb-2 h-4 w-2/3" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      ))}
    </div>
  );
}
