import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useWorkspaces } from "../../features/workspaces/hooks/use-workspaces";
import { WorkspaceCard } from "../../features/workspaces/components/WorkspaceCard";
import { CreateWorkspaceDialog } from "../../features/workspaces/components/CreateWorkspaceDialog";
import { Button } from "../../shared/ui/Button";

export const Route = createFileRoute("/_authenticated/")({
  component: DashboardPage,
});

function DashboardPage() {
  const { data: workspaces = [], isLoading } = useWorkspaces();
  const [createOpen, setCreateOpen] = useState(false);

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <header className="flex items-end justify-between mb-6">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-1">
            Dashboard
          </p>
          <h1 className="text-2xl font-semibold text-foreground">
            Mis workspaces
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Espacios donde colaboras con tu equipo.
          </p>
        </div>
        <Button onClick={() => setCreateOpen(true)}>Nuevo workspace</Button>
      </header>

      {isLoading && (
        <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
          Cargando…
        </p>
      )}

      {!isLoading && workspaces.length === 0 && (
        <div className="border border-border bg-card p-12 text-center">
          <h2 className="text-lg font-semibold text-foreground">
            Aún no tienes workspaces
          </h2>
          <p className="text-sm text-muted-foreground mt-1 mb-6">
            Crea tu primer workspace para empezar a organizar proyectos y
            tareas.
          </p>
          <Button onClick={() => setCreateOpen(true)}>
            Crear mi primer workspace
          </Button>
        </div>
      )}

      {!isLoading && workspaces.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-border border border-border">
          {workspaces.map((ws) => (
            <WorkspaceCard key={ws.id} workspace={ws} />
          ))}
        </div>
      )}

      <CreateWorkspaceDialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
      />
    </div>
  );
}
