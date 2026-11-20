import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useWorkspaces } from "../../features/workspaces/hooks/use-workspaces";
import { WorkspaceCard } from "../../features/workspaces/components/WorkspaceCard";
import { CreateWorkspaceDialog } from "../../features/workspaces/components/CreateWorkspaceDialog";
import { Button } from "../../shared/ui/Button";
import { Skeleton } from "../../shared/ui/Skeleton";

export const Route = createFileRoute("/_authenticated/")({
  component: DashboardPage,
});

function DashboardPage() {
  const { auth } = Route.useRouteContext();
  const { data: workspaces = [], isLoading } = useWorkspaces();
  const [createOpen, setCreateOpen] = useState(false);
  const firstName = auth.user?.name.split(/\s+/)[0];

  return (
    <div className="mx-auto w-full max-w-6xl p-4 sm:p-6 lg:p-8">
      <header className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-1 text-xs text-muted-foreground">
            Tu espacio de trabajo
          </p>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            {firstName ? `Hola, ${firstName}` : "Mis espacios de trabajo"}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {workspaces.length
              ? `Tienes ${workspaces.length} ${workspaces.length === 1 ? "espacio de trabajo" : "espacios de trabajo"}.`
              : "Organiza proyectos y colabora con tu equipo desde un solo lugar."}
          </p>
        </div>
        <Button
          onClick={() => setCreateOpen(true)}
          className="w-full sm:w-auto"
        >
          Nuevo espacio
        </Button>
      </header>

      <section>
        <h2 className="mb-3 text-sm font-semibold text-foreground">
          Tus espacios
        </h2>
        {isLoading && (
          <div
            role="status"
            aria-label="Cargando espacios de trabajo"
            className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3"
          >
            {Array.from({ length: 3 }, (_, index) => (
              <div
                key={index}
                className="border border-border bg-card p-5"
                aria-hidden="true"
              >
                <Skeleton className="mb-5 size-10" />
                <Skeleton className="mb-2 h-4 w-2/3" />
                <Skeleton className="h-3 w-1/3" />
              </div>
            ))}
          </div>
        )}

        {!isLoading && workspaces.length === 0 && (
          <div className="border border-border bg-card px-5 py-12 text-center sm:px-12">
            <h3 className="text-lg font-semibold text-foreground">
              Aún no tienes espacios de trabajo
            </h3>
            <p className="text-sm text-muted-foreground mt-1 mb-6">
              Crea tu primer espacio para empezar a organizar proyectos y
              tareas.
            </p>
            <Button onClick={() => setCreateOpen(true)}>
              Crear mi primer espacio
            </Button>
          </div>
        )}

        {!isLoading && workspaces.length > 0 && (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {workspaces.map((ws) => (
              <WorkspaceCard key={ws.id} workspace={ws} />
            ))}
          </div>
        )}
      </section>

      <CreateWorkspaceDialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
      />
    </div>
  );
}
