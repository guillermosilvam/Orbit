import { useState } from "react";
import { Link, useMatchRoute, useRouterState } from "@tanstack/react-router";
import { Activity, ListTodo, Plus, Users, UserPlus } from "lucide-react";
import { useWorkspaces } from "../hooks/use-workspaces";
import { useProjects } from "../../projects/hooks/use-projects";
import { CreateProjectDialog } from "../../projects/components/CreateProjectDialog";
import { SidebarFooter } from "./SidebarFooter";
import { IconButton } from "../../../shared/ui/IconButton";

export function AppSidebar({
  user,
  className,
  onNavigate,
}: {
  user: { id: string; email: string; name: string; createdAt: string };
  className?: string;
  onNavigate?: () => void;
}) {
  const { data: workspaces = [] } = useWorkspaces();
  const match = useMatchRoute();
  const isMyTasksView = useRouterState({
    select: (state) => state.location.search.view === "my-tasks",
  });
  const isActivityView = useRouterState({
    select: (state) => state.location.search.view === "activity",
  });
  const params = match({ to: "/workspaces/$workspaceSlug", fuzzy: true });
  const currentSlug = params ? params.workspaceSlug : undefined;
  const current = currentSlug
    ? workspaces.find((w) => w.slug === currentSlug)
    : undefined;

  const { data: projects = [] } = useProjects(currentSlug);
  const [createOpen, setCreateOpen] = useState(false);

  const canManage =
    current && (current.role === "owner" || current.role === "admin");

  return (
    <>
      <aside
        className={`w-60 shrink-0 flex-col border-r border-border bg-sidebar ${className ?? "flex"}`}
      >
        <div className="p-4 border-b border-border ">
          <Link
            to="/"
            className="inline-flex items-center gap-2 shrink-0"
            aria-label="Ir al inicio"
            onClick={onNavigate}
          >
            <svg
              className="text-primary"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden
            >
              <circle
                cx="12"
                cy="12"
                r="9"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeDasharray="2 2"
              />
              <circle cx="12" cy="12" r="3.5" fill="currentColor" />
            </svg>
            <span className="text-lg font-semibold tracking-tight text-foreground">
              Orbit
            </span>
          </Link>
        </div>

        <div className="flex-1 overflow-auto p-4">
          {current ? (
            <>
              <p className="text-sm font-medium text-foreground truncate">
                {current.name}
              </p>

              <div className="mt-6">
                <div className="flex items-center justify-between mb-2">
                  <p className="section-label">Proyectos</p>
                  {canManage && (
                    <IconButton
                      size="sm"
                      aria-label="Crear proyecto"
                      onClick={() => setCreateOpen(true)}
                    >
                      <Plus className="size-3.5" />
                    </IconButton>
                  )}
                </div>

                {projects.length === 0 ? (
                  <p className="text-xs text-muted-foreground">Sin proyectos</p>
                ) : (
                  <ul className="space-y-0.5">
                    {projects.map((p) => (
                      <li key={p.id}>
                        <SidebarLink
                          to="/workspaces/$workspaceSlug/projects/$projectKey"
                          params={{
                            workspaceSlug: current.slug,
                            projectKey: p.key,
                          }}
                          onNavigate={onNavigate}
                        >
                          <span className="font-mono text-[10px] text-muted-foreground">
                            {p.key}
                          </span>
                          <span className="truncate">{p.name}</span>
                        </SidebarLink>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="mt-6">
                <p className="section-label mb-2">Tareas</p>
                <ul className="space-y-0.5">
                  <li>
                    <Link
                      to="/workspaces/$workspaceSlug"
                      params={{ workspaceSlug: current.slug }}
                      search={{ view: "my-tasks" }}
                      onClick={onNavigate}
                      className={`flex items-center gap-2 px-2 py-1.5 text-sm transition-colors ${
                        isMyTasksView
                          ? "border-l-2 border-l-primary pl-1.5 text-foreground"
                          : "text-muted-foreground hover:bg-accent hover:text-foreground"
                      }`}
                    >
                      <ListTodo className="size-3.5" />
                      <span>Mis tareas</span>
                    </Link>
                  </li>
                </ul>
              </div>

              <div className="mt-6">
                <p className="section-label mb-2">Espacio</p>
                <ul className="space-y-0.5">
                  <li>
                    <Link
                      to="/workspaces/$workspaceSlug"
                      params={{ workspaceSlug: current.slug }}
                      search={{ view: "activity" }}
                      onClick={onNavigate}
                      className={`flex items-center gap-2 px-2 py-1.5 text-sm transition-colors ${
                        isActivityView
                          ? "border-l-2 border-l-primary pl-1.5 text-foreground"
                          : "text-muted-foreground hover:bg-accent hover:text-foreground"
                      }`}
                    >
                      <Activity className="size-3.5" />
                      <span>Actividad</span>
                    </Link>
                  </li>
                </ul>
              </div>

              <div className="mt-6">
                <p className="section-label mb-2">Gestión de equipo</p>
                <ul className="space-y-0.5">
                  <li>
                    <SidebarLink
                      to="/workspaces/$workspaceSlug/members"
                      params={{ workspaceSlug: current.slug }}
                      onNavigate={onNavigate}
                    >
                      <Users className="size-3.5" />
                      <span>Miembros</span>
                    </SidebarLink>
                  </li>
                  {canManage && (
                    <li>
                      <SidebarLink
                        to="/workspaces/$workspaceSlug/invitations"
                        params={{ workspaceSlug: current.slug }}
                        onNavigate={onNavigate}
                      >
                        <UserPlus className="size-3.5" />
                        <span>Invitaciones</span>
                      </SidebarLink>
                    </li>
                  )}
                </ul>
              </div>
            </>
          ) : (
            <p className="text-xs text-muted-foreground">
              Selecciona un espacio de trabajo para ver su contenido.
            </p>
          )}
        </div>

        <SidebarFooter user={user} />
      </aside>

      {currentSlug && (
        <CreateProjectDialog
          open={createOpen}
          onClose={() => setCreateOpen(false)}
          workspaceSlug={currentSlug}
        />
      )}
    </>
  );
}

function SidebarLink({
  to,
  params,
  children,
  onNavigate,
}: {
  to: string;
  params: Record<string, string>;
  children: React.ReactNode;
  onNavigate?: () => void;
}) {
  const match = useMatchRoute();
  const isActive = Boolean(match({ to, params, fuzzy: true }));

  return (
    <Link
      to={to}
      params={params}
      onClick={onNavigate}
      className={`flex items-center gap-2 px-2 py-1.5 text-sm transition-colors ${
        isActive
          ? "text-foreground border-l-2 border-l-primary pl-1.5"
          : "text-muted-foreground hover:bg-accent hover:text-foreground"
      }`}
    >
      {children}
    </Link>
  );
}
