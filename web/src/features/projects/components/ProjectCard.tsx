import { Link } from "@tanstack/react-router";
import type { ProjectResponseDto } from "@orbit/shared/types/responses";


export function ProjectCard({
  project,
  workspaceSlug,
}: {
  project: ProjectResponseDto;
  workspaceSlug: string;
}) {
  return (
    <Link
      to="/workspaces/$workspaceSlug/projects/$projectKey"
      params={{ workspaceSlug, projectKey: project.key }}
      className="flex flex-col gap-3 border border-border bg-card p-5 transition-colors hover:border-primary/40 hover:bg-accent"
    >
      <div className="flex items-start justify-between gap-3">
        <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground border border-border px-1.5 py-0.5">
          {project.key}
        </span>
        <span className="font-mono text-[10px] text-muted-foreground">
          {project.taskCounter} {project.taskCounter === 1 ? "tarea" : "tareas"}
        </span>
      </div>
      <div>
        <h3 className="font-semibold text-foreground">{project.name}</h3>
        {project.description && (
          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
            {project.description}
          </p>
        )}
      </div>
    </Link>
  );
}
