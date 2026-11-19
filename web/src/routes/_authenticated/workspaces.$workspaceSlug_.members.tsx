import { createFileRoute } from "@tanstack/react-router";
import { useWorkspaces } from "../../features/workspaces/hooks/use-workspaces";
import { useMembers } from "../../features/workspaces/hooks/use-members";
import { useLeaveWorkspace } from "../../features/workspaces/hooks/use-leave-workspace";
import { MembersList } from "../../features/workspaces/components/MembersList";
import { Button } from "../../shared/ui/Button";

export const Route = createFileRoute(
  "/_authenticated/workspaces/$workspaceSlug_/members",
)({
  component: MembersPage,
});

function MembersPage() {
  const { auth } = Route.useRouteContext();
  const { workspaceSlug } = Route.useParams();
  const { data: workspaces = [], isLoading: loadingWorkspaces } =
    useWorkspaces();
  const { data: members = [], isLoading: loadingMembers } =
    useMembers(workspaceSlug);
  const leave = useLeaveWorkspace(workspaceSlug);

  const user = auth.user;
  const workspace = workspaces.find((w) => w.slug === workspaceSlug);

  if (!user) return null;

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

  const isOwner = workspace.role === "owner";

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <header className="flex items-end justify-between mb-6 gap-4">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-1">
            {workspace.name}
          </p>
          <h1 className="text-2xl font-semibold text-foreground">Miembros</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Personas con acceso a este workspace.
          </p>
        </div>

        {!isOwner && (
          <Button
            variant="secondary"
            onClick={() => {
              if (confirm("¿Salir de este workspace?")) {
                leave.mutate();
              }
            }}
            loading={leave.isPending}
          >
            Salir del workspace
          </Button>
        )}
      </header>

      {loadingMembers ? (
        <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
          Cargando miembros…
        </p>
      ) : (
        <MembersList
          members={members}
          workspaceSlug={workspaceSlug}
          currentUserId={user.id}
          currentUserRole={workspace.role}
        />
      )}

      {isOwner && (
        <p className="text-xs text-muted-foreground mt-4">
          Como dueño no puedes salir del workspace sin transferir la propiedad.
        </p>
      )}
    </div>
  );
}
