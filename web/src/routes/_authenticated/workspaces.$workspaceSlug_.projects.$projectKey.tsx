import { createFileRoute } from "@tanstack/react-router";

/**
 * Placeholder de detalle de proyecto. En el step 10 se convierte en la
 * página con lista de tareas y kanban.
 */
export const Route = createFileRoute(
  "/_authenticated/workspaces/$workspaceSlug_/projects/$projectKey",
)({
  component: ProjectDetailPlaceholder,
});

function ProjectDetailPlaceholder() {
  const { workspaceSlug, projectKey } = Route.useParams();
  return (
    <div className="p-8 max-w-3xl mx-auto">
      <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-1">
        Proyecto · {workspaceSlug}
      </p>
      <h1 className="text-2xl font-semibold text-foreground">{projectKey}</h1>
      <p className="text-sm text-muted-foreground mt-2">
        Tareas y kanban — próximamente.
      </p>
    </div>
  );
}
