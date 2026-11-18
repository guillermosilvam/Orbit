import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
  "/_authenticated/workspaces/$workspaceSlug",
)({
  component: WorkspaceDetailPlaceholder,
});

function WorkspaceDetailPlaceholder() {
  const { workspaceSlug } = Route.useParams();
  return (
    <div className="p-8 max-w-3xl mx-auto">
      <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-1">
        Workspace
      </p>
      <h1 className="text-2xl font-semibold text-foreground">
        {workspaceSlug}
      </h1>
      <p className="text-sm text-muted-foreground mt-2">
        Proyectos y miembros — próximamente.
      </p>
    </div>
  );
}
