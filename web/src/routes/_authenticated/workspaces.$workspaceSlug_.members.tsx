import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useWorkspace } from "../../features/workspaces/hooks/use-workspace";
import { useMembers } from "../../features/workspaces/hooks/use-members";
import { useLeaveWorkspace } from "../../features/workspaces/hooks/use-leave-workspace";
import { MembersList } from "../../features/workspaces/components/MembersList";
import { Button } from "../../shared/ui/Button";
import { Breadcrumb } from "../../shared/ui/Breadcrumb";
import { Skeleton } from "../../shared/ui/Skeleton";
import { ConfirmDialog } from "../../shared/ui/ConfirmDialog";

export const Route = createFileRoute(
  "/_authenticated/workspaces/$workspaceSlug_/members",
)({
  component: MembersPage,
});

function MembersPage() {
  const { auth } = Route.useRouteContext();
  const { workspaceSlug } = Route.useParams();
  const workspaceQuery = useWorkspace(workspaceSlug);
  const workspace = workspaceQuery.data;
  const { data: members = [], isLoading: loadingMembers } =
    useMembers(workspaceSlug);
  const leave = useLeaveWorkspace(workspaceSlug);
  const [leaveOpen, setLeaveOpen] = useState(false);

  const user = auth.user;
  if (!user) return null;

  if (workspaceQuery.isLoading) {
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
          items={[{ label: "Inicio", to: "/" }, { label: "Miembros" }]}
        />
        <h1 className="text-2xl font-semibold text-foreground">
          {workspaceQuery.error instanceof Error
            ? workspaceQuery.error.message
            : "Espacio de trabajo no encontrado"}
        </h1>
      </div>
    );
  }

  const isOwner = workspace.role === "owner";

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
          { label: "Miembros" },
        ]}
      />

      <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Miembros
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Personas con acceso a este espacio de trabajo.
          </p>
        </div>

        {!isOwner && (
          <Button
            variant="secondary"
            onClick={() => setLeaveOpen(true)}
            loading={leave.isPending}
          >
            Salir del espacio
          </Button>
        )}
      </header>

      {loadingMembers ? (
        <MembersSkeleton />
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
          Como propietario no puedes salir del espacio de trabajo sin transferir
          la propiedad.
        </p>
      )}
      {leaveOpen && (
        <ConfirmDialog
          title="Salir del espacio de trabajo"
          description="Dejarás de tener acceso a sus proyectos y tareas. Un administrador tendrá que invitarte de nuevo."
          confirmLabel="Salir del espacio"
          onClose={() => setLeaveOpen(false)}
          onConfirm={() => leave.mutate()}
        />
      )}
    </div>
  );
}

function MembersSkeleton() {
  return (
    <div
      role="status"
      aria-label="Cargando miembros"
      className="border border-border bg-card"
    >
      {Array.from({ length: 4 }, (_, index) => (
        <div
          key={index}
          className="flex items-center gap-3 border-b border-border px-4 py-3 last:border-b-0"
          aria-hidden="true"
        >
          <Skeleton className="size-9 shrink-0" />
          <Skeleton className="h-4 flex-1" />
          <Skeleton className="h-6 w-20" />
        </div>
      ))}
    </div>
  );
}
