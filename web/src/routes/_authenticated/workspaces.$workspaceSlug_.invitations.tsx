import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Plus } from "lucide-react";
import { useWorkspaces } from "../../features/workspaces/hooks/use-workspaces";
import { useInvitations } from "../../features/invitations/hooks/use-invitations";
import { InvitationsList } from "../../features/invitations/components/InvitationsList";
import { CreateInvitationDialog } from "../../features/invitations/components/CreateInvitationDialog";
import { Button } from "../../shared/ui/Button";

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
      <div className="p-8">
        <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
          Cargando…
        </p>
      </div>
    );
  }

  if (!workspace) {
    return (
      <div className="p-8 max-w-3xl mx-auto">
        <h1 className="text-2xl font-semibold text-foreground">
          Workspace no encontrado
        </h1>
      </div>
    );
  }

  const canManage = workspace.role === "owner" || workspace.role === "admin";

  if (!canManage) {
    return (
      <div className="p-8 max-w-3xl mx-auto">
        <Link
          to="/workspaces/$workspaceSlug"
          params={{ workspaceSlug }}
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mb-4"
        >
          <ArrowLeft className="size-3.5" /> Volver
        </Link>
        <h1 className="text-2xl font-semibold text-foreground">Sin acceso</h1>
        <p className="text-sm text-muted-foreground mt-2">
          Solo owners y admins pueden gestionar invitaciones.
        </p>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <Link
        to="/workspaces/$workspaceSlug"
        params={{ workspaceSlug }}
        className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mb-4 group"
      >
        <ArrowLeft className="size-3.5 group-hover:-translate-x-0.5 transition-transform" />
        Volver al workspace
      </Link>

      <header className="flex items-end justify-between mb-6 gap-4">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-1">
            {workspace.name}
          </p>
          <h1 className="text-2xl font-semibold text-foreground">
            Invitaciones
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Links pendientes para unirse a este workspace.
          </p>
        </div>
        <Button onClick={() => setCreateOpen(true)}>
          <Plus className="size-4" />
          Nueva invitación
        </Button>
      </header>

      {loadingInvitations ? (
        <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
          Cargando invitaciones…
        </p>
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
