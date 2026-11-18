import { useState } from "react";
import { Link, useMatchRoute } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { useWorkspaces } from "../hooks/use-workspaces";
import { CreateWorkspaceDialog } from "./CreateWorkspaceDialog"
import type { WorkspaceWithRoleDto } from "@orbit/shared/types/responses";

export function WorkspaceRail() {
  const { data: workspaces = [] } = useWorkspaces();
  const match = useMatchRoute();
  const active = match({ to: "/workspaces/$workspaceSlug" });
  const activeSlug = active ? active.workspaceSlug : undefined;

  const [createOpen, setCreateOpen] = useState(false);

  return (
    <>
      <nav
        className="w-16 bg-sidebar border-r border-border flex flex-col items-center py-3 gap-2 shrink-0"
        aria-label="Workspaces"
      >
        {workspaces.map((ws) => (
          <RailIcon
            key={ws.id}
            workspace={ws}
            active={ws.slug === activeSlug}
          />
        ))}

        <button
          type="button"
          onClick={() => setCreateOpen(true)}
          className="size-10 border border-dashed border-border bg-card flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
          aria-label="Crear workspace"
        >
          <Plus className="size-4" />
        </button>
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
}: {
  workspace: WorkspaceWithRoleDto;
  active: boolean;
}) {
  return (
    <Link
      to="/workspaces/$workspaceSlug"
      params={{ workspaceSlug: workspace.slug }}
      className={`relative size-10 bg-card border border-border flex items-center justify-center font-semibold text-sm transition-colors hover:bg-accent ${
        active ? "text-foreground" : "text-muted-foreground"
      }`}
      aria-label={workspace.name}
      aria-current={active ? "page" : undefined}
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
