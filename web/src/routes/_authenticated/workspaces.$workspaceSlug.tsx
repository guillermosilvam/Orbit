import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useWorkspaces } from "../../features/workspaces/hooks/use-workspaces";
import { useProjects } from "../../features/projects/hooks/use-projects";
import { ProjectCard } from "../../features/projects/components/ProjectCard";
import { CreateProjectDialog } from "../../features/projects/components/CreateProjectDialog";
import { Button } from "../../shared/ui/Button";
import { Link } from "@tanstack/react-router";
import { Plus, UserPlus, Users } from "lucide-react";
import { IconButton } from "../../shared/ui/IconButton";

export const Route = createFileRoute(
  "/_authenticated/workspaces/$workspaceSlug",
)({
  component: WorkspaceDetailPage,
});

function WorkspaceDetailPage() {
  const { workspaceSlug } = Route.useParams();
  const { data: workspaces = [], isLoading: loadingWorkspaces } =
    useWorkspaces();
  const { data: projects = [], isLoading: loadingProjects } =
    useProjects(workspaceSlug);
  const [createOpen, setCreateOpen] = useState(false);

  const workspace = workspaces.find((w) => w.slug === workspaceSlug);

  if (loadingWorkspaces) {
    return (
      <div className="p-8">
        <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
          Cargando…
        </p>
      </div>
    );
  }

  if (!workspace) {
    return (
      <div className="p-8 max-w-3xl mx-auto">
        <h1 className="text-2xl font-semibold text-foreground">
          Workspace no encontrado
        </h1>
        <p className="text-sm text-muted-foreground mt-2">
          No eres miembro de este workspace o no existe.
        </p>
      </div>
    );
  }

  const canCreate = workspace.role === "owner" || workspace.role === "admin";
  const canManage = workspace.role === "owner" || workspace.role === "admin";

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <header className="flex items-end justify-between mb-6 gap-4">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-1">
            Workspace · {workspace.role}
          </p>
          <h1 className="text-2xl font-semibold text-foreground">
            {workspace.name}
          </h1>
          <p className="font-mono text-[11px] text-muted-foreground mt-1">
            /{workspace.slug}
          </p>
        </div>

        <div className="flex items-center gap-1">
          <Link
            to="/workspaces/$workspaceSlug/members"
            params={{ workspaceSlug }}
          >
            <IconButton aria-label="Ver miembros">
              <Users className="size-4" />
            </IconButton>
          </Link>
          {canManage && (
            <Link
              to="/workspaces/$workspaceSlug/invitations"
              params={{ workspaceSlug }}
            >
              <IconButton aria-label="Invitaciones">
                <UserPlus className="size-4" />
              </IconButton>
            </Link>
          )}
          {canManage && (
            <Button onClick={() => setCreateOpen(true)} className="ml-2">
              <Plus className="size-4" />
              Nuevo proyecto
            </Button>
          )}
        </div>
      </header>

      {loadingProjects && (
        <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
          Cargando proyectos…
        </p>
      )}

      {!loadingProjects && projects.length === 0 && (
        <div className="border border-border bg-card p-12 text-center">
          <h2 className="text-lg font-semibold text-foreground">
            Aún no hay proyectos
          </h2>
          <p className="text-sm text-muted-foreground mt-1 mb-6">
            Los proyectos agrupan las tareas de un área de trabajo.
          </p>
          {canCreate && (
            <Button onClick={() => setCreateOpen(true)}>
              Crear mi primer proyecto
            </Button>
          )}
        </div>
      )}

      {!loadingProjects && projects.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-border border border-border">
          {projects.map((p) => (
            <ProjectCard key={p.id} project={p} workspaceSlug={workspaceSlug} />
          ))}
        </div>
      )}

      {canCreate && (
        <CreateProjectDialog
          open={createOpen}
          onClose={() => setCreateOpen(false)}
          workspaceSlug={workspaceSlug}
        />
      )}
    </div>
  );
}
