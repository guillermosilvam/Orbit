import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { useWorkspaces } from "../../features/workspaces/hooks/use-workspaces";
import { useInvitations } from "../../features/invitations/hooks/use-invitations";
import { InvitationsList } from "../../features/invitations/components/InvitationsList";
import { CreateInvitationDialog } from "../../features/invitations/components/CreateInvitationDialog";
import { Button } from "../../shared/ui/Button";
import { Breadcrumb } from "../../shared/ui/Breadcrumb";
import { Skeleton } from "../../shared/ui/Skeleton";

export const Route = createFileRoute(
  "/_authenticated/workspaces/$workspaceSlug_/invitations",
)({
  component: InvitationsPage,
});

function InvitationsPage() {
  const { workspaceSlug } = Route.useParams();
  const { data: workspaces = [], isLoading: loadingWorkspaces } =
    useWorkspaces();
  const { data: invitations = [], isLoading: loadingInvitations } =
    useInvitations(workspaceSlug);
  const [createOpen, setCreateOpen] = useState(false);

  const workspace = workspaces.find((w) => w.slug === workspaceSlug);

  if (loadingWorkspaces) {
    return (
      <div className="mx-auto w-full max-w-3xl p-4 sm:p-6 lg:p-8">
        <Skeleton className="mb-2 h-3 w-32" />
        <Skeleton className="h-8 w-48" />
      </div>
    );
  }

  if (!workspace) {
    return (
      <div className="mx-auto w-full max-w-3xl p-4 sm:p-6 lg:p-8">
        <Breadcrumb
          className="mb-4"
          items={[{ label: "Inicio", to: "/" }, { label: "Invitaciones" }]}
        />
        <h1 className="text-2xl font-semibold text-foreground">
          Espacio de trabajo no encontrado
        </h1>
      </div>
    );
  }

  const canManage = workspace.role === "owner" || workspace.role === "admin";

  if (!canManage) {
    return (
      <div className="mx-auto w-full max-w-3xl p-4 sm:p-6 lg:p-8">
        <Breadcrumb
          className="mb-4"
          items={[
            {
              label: workspace.name,
              to: "/workspaces/$workspaceSlug",
              params: { workspaceSlug },
            },
            { label: "Invitaciones" },
          ]}
        />
        <h1 className="text-2xl font-semibold text-foreground">Sin acceso</h1>
        <p className="text-sm text-muted-foreground mt-2">
          Solo propietarios y administradores pueden gestionar invitaciones.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-3xl p-4 sm:p-6 lg:p-8">
      <Breadcrumb
        className="mb-4"
        items={[
          {
            label: workspace.name,
            to: "/workspaces/$workspaceSlug",
            params: { workspaceSlug },
          },
          { label: "Invitaciones" },
        ]}
      />

      <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Invitaciones
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Enlaces pendientes para unirse a este espacio de trabajo.
          </p>
        </div>
        <Button
          onClick={() => setCreateOpen(true)}
          className="w-full sm:w-auto"
        >
          <Plus className="size-4" />
          Nueva invitación
        </Button>
      </header>

      {loadingInvitations ? (
        <InvitationsSkeleton />
      ) : (
        <InvitationsList
          invitations={invitations}
          workspaceSlug={workspaceSlug}
        />
      )}

      <CreateInvitationDialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        workspaceSlug={workspaceSlug}
      />
    </div>
  );
}

function InvitationsSkeleton() {
  return (
    <div
      role="status"
      aria-label="Cargando invitaciones"
      className="border border-border bg-card"
    >
      {Array.from({ length: 3 }, (_, index) => (
        <div
          key={index}
          className="flex items-center gap-3 border-b border-border px-4 py-4 last:border-b-0"
          aria-hidden="true"
        >
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-4 flex-1" />
          <Skeleton className="size-8" />
        </div>
      ))}
    </div>
  );
}
