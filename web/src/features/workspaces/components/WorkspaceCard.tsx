import { Link } from "@tanstack/react-router";
import type { WorkspaceWithRoleDto } from "@orbit/shared/types/responses";
import { formatWorkspaceRole } from "../lib/format-role";


export function WorkspaceCard({
  workspace,
}: {
  workspace: WorkspaceWithRoleDto;
}) {
  return (
    <Link
      to="/workspaces/$workspaceSlug"
      params={{ workspaceSlug: workspace.slug }}
      search={{ view: "projects" }}
      className="group flex flex-col gap-4 border border-border bg-card p-5 transition-colors hover:border-primary/40 hover:bg-accent"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="size-10 bg-sidebar border border-border flex items-center justify-center font-semibold text-sm text-foreground">
          {getInitials(workspace.name)}
        </div>
        <RoleBadge role={workspace.role} />
      </div>
      <div>
        <h3 className="font-semibold text-foreground">{workspace.name}</h3>
        <p className="mt-1 font-mono text-[11px] text-muted-foreground">
          /{workspace.slug}
        </p>
      </div>
      <span className="mt-auto inline-flex items-center gap-1.5 text-xs font-medium text-primary opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-visible:opacity-100">
        Abrir espacio <span aria-hidden>→</span>
      </span>
    </Link>
  );
}

function RoleBadge({ role }: { role: WorkspaceWithRoleDto["role"] }) {
  return (
    <span className="border border-border bg-background px-1.5 py-0.5 text-[11px] font-medium text-muted-foreground">
      {formatWorkspaceRole(role)}
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
