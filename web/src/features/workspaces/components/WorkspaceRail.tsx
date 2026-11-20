import { useState } from "react";
import { Link, useMatchRoute } from "@tanstack/react-router";
import { Plus, Settings } from "lucide-react";
import { useWorkspaces } from "../hooks/use-workspaces";
import { CreateWorkspaceDialog } from "./CreateWorkspaceDialog";
import type { WorkspaceWithRoleDto } from "@orbit/shared/types/responses";

export function WorkspaceRail({
  className,
  onNavigate,
  onOpenSettings,
}: {
  className?: string;
  onNavigate?: () => void;
  onOpenSettings: () => void;
}) {
  const { data: workspaces = [] } = useWorkspaces();
  const match = useMatchRoute();
  const active = match({ to: "/workspaces/$workspaceSlug", fuzzy: true });
  const activeSlug = active ? active.workspaceSlug : undefined;

  const [createOpen, setCreateOpen] = useState(false);

  return (
    <>
      <nav
        className={`h-full w-14 shrink-0 flex-col items-center border-r border-border bg-sidebar py-3 md:w-16 ${className ?? "flex"}`}
        aria-label="Espacios de trabajo"
      >
        <div className="flex w-full flex-1 flex-col items-center gap-2 overflow-y-auto">
          {workspaces.map((ws) => (
            <RailIcon
              key={ws.id}
              workspace={ws}
              active={ws.slug === activeSlug}
              onNavigate={onNavigate}
            />
          ))}
        </div>
        <div className="mt-auto flex w-full flex-col items-center gap-2 pt-2">
          <button
            type="button"
            onClick={() => setCreateOpen(true)}
            className="flex size-10 items-center justify-center border border-dashed border-border bg-card text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            aria-label="Crear espacio de trabajo"
            title="Crear espacio de trabajo"
          >
            <Plus className="size-4" />
          </button>
          <button
            type="button"
            onClick={onOpenSettings}
            className="flex size-10 items-center justify-center text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            aria-label="Configuración"
            title="Configuración"
          >
            <Settings className="size-4" />
          </button>
        </div>
      </nav>

      <CreateWorkspaceDialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
      />
    </>
  );
}

function RailIcon({
  workspace,
  active,
  onNavigate,
}: {
  workspace: WorkspaceWithRoleDto;
  active: boolean;
  onNavigate?: () => void;
}) {
  return (
    <Link
      to="/workspaces/$workspaceSlug"
      params={{ workspaceSlug: workspace.slug }}
      className={`relative size-10 bg-card border border-border flex items-center justify-center font-semibold text-sm transition-colors hover:bg-accent ${
        active ? "text-foreground" : "text-muted-foreground"
      }`}
      onClick={onNavigate}
      aria-label={workspace.name}
      aria-current={active ? "page" : undefined}
      title={workspace.name}
    >
      {active && (
        <span className="absolute -left-2.25 top-2 bottom-2 w-0.5 bg-primary" />
      )}
      {getInitials(workspace.name)}
    </Link>
  );
}

function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .map((s) => s.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase();
}
