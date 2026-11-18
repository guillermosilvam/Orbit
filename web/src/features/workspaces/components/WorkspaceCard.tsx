import { Link } from "@tanstack/react-router";
import type { WorkspaceWithRoleDto } from "@orbit/shared/types/responses";

/**
 * Tarjeta de workspace para el dashboard. Toda la tarjeta es un link
 * al workspace, así el click va directo sin botón extra.
 */
export function WorkspaceCard({
  workspace,
}: {
  workspace: WorkspaceWithRoleDto;
}) {
  return (
    <Link
      to="/workspaces/$workspaceSlug"
      params={{ workspaceSlug: workspace.slug }}
      className="bg-card p-5 hover:bg-accent transition-colors flex flex-col gap-3"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="size-10 bg-sidebar border border-border flex items-center justify-center font-semibold text-sm text-foreground">
          {getInitials(workspace.name)}
        </div>
        <RoleBadge role={workspace.role} />
      </div>
      <div>
        <h3 className="font-semibold text-foreground">{workspace.name}</h3>
        <p className="font-mono text-[11px] text-muted-foreground mt-1">
          /{workspace.slug}
        </p>
      </div>
    </Link>
  );
}

function RoleBadge({ role }: { role: WorkspaceWithRoleDto["role"] }) {
  return (
    <span className="font-mono text-[10px] uppercase tracking-wider border border-border bg-background px-1.5 py-0.5 text-muted-foreground">
      {role}
    </span>
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
