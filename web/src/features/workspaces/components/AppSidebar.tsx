import { useState } from "react";
import { Link, useMatchRoute } from "@tanstack/react-router";
import { Plus, Users, UserPlus } from "lucide-react";
import { useWorkspaces } from "../hooks/use-workspaces";
import { useProjects } from "../../projects/hooks/use-projects";
import { CreateProjectDialog } from "../../projects/components/CreateProjectDialog";
import { SidebarFooter } from "./SidebarFooter";
import { IconButton } from "../../../shared/ui/IconButton";

export function AppSidebar({
  user,
}: {
  user: { id: string; email: string; name: string; createdAt: string };
}) {
  const { data: workspaces = [] } = useWorkspaces();
  const match = useMatchRoute();
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
      <aside className="w-60 bg-sidebar border-r border-border flex flex-col shrink-0">
        <Link
          to="/"
          className="p-4 border-b border-border flex items-center gap-2 shrink-0"
          aria-label="Ir al inicio"
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
            <circle cx="19" cy="8" r="1.5" fill="var(--status-in-progress)" />
          </svg>
          <span className="text-lg font-semibold tracking-tight text-foreground">
            Orbit
          </span>
        </Link>

        <div className="flex-1 overflow-auto p-4">
          {current ? (
            <>
              <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-2">
                Workspace
              </p>
              <p className="text-sm font-medium text-foreground truncate">
                {current.name}
              </p>
              <p className="font-mono text-[11px] text-muted-foreground mt-0.5">
                /{current.slug}
              </p>

              <div className="mt-6">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                    Proyectos
                  </p>
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
                <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-2">
                  Workspace
                </p>
                <ul className="space-y-0.5">
                  <li>
                    <SidebarLink
                      to="/workspaces/$workspaceSlug/members"
                      params={{ workspaceSlug: current.slug }}
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
              Selecciona un workspace para ver su contenido.
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
}: {
  to: string;
  params: Record<string, string>;
  children: React.ReactNode;
}) {
  const match = useMatchRoute();
  const isActive = Boolean(match({ to, params, fuzzy: true }));

  return (
    <Link
      to={to}
      params={params}
      className={`flex items-center gap-2 px-2 py-1.5 text-sm transition-colors ${
        isActive
          ? "text-foreground border-l-[2.5px] border-l-primary"
          : "text-muted-foreground hover:bg-accent hover:text-foreground"
      }`}
    >
      {children}
    </Link>
  );
}
