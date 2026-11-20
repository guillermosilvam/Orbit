import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Check, X } from "lucide-react";
import { useInvitationPreview } from "../../features/invitations/hooks/use-invitation-preview";
import { useAcceptInvitation } from "../../features/invitations/hooks/use-accept-invitation";
import { Button } from "../../shared/ui/Button";
import { ApiError } from "../../shared/lib/api-client";
import { formatWorkspaceRole } from "../../features/workspaces/lib/format-role";
import { Skeleton } from "../../shared/ui/Skeleton";

export const Route = createFileRoute("/_authenticated/invitations/$token")({
  component: AcceptInvitationPage,
});

function AcceptInvitationPage() {
  const { token } = Route.useParams();
  const preview = useInvitationPreview(token);
  const accept = useAcceptInvitation(token);

  if (preview.isLoading) {
    return (
      <main className="min-h-screen bg-dots flex items-center justify-center p-4">
        <div
          role="status"
          aria-label="Cargando invitación"
          className="w-full max-w-md border border-border bg-card p-6 sm:p-8"
        >
          <Skeleton className="mb-3 h-3 w-24" />
          <Skeleton className="mb-2 h-7 w-48 max-w-full" />
          <Skeleton className="mb-6 h-3 w-32" />
          <Skeleton className="mb-6 h-20 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </main>
    );
  }

  if (preview.error) {
    const message =
      preview.error instanceof ApiError
        ? preview.error.message
        : "Invitación inválida";

    return (
      <main className="min-h-screen bg-dots flex items-center justify-center p-4">
        <div className="w-full max-w-md border border-border bg-card p-6 text-center sm:p-8">
          <X className="size-8 text-destructive mx-auto mb-3" />
          <h1 className="text-lg font-semibold text-foreground">
            Invitación no disponible
          </h1>
          <p className="text-sm text-muted-foreground mt-2">{message}</p>
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline mt-6 font-medium"
          >
            <ArrowLeft className="size-3.5" /> Ir al inicio
          </Link>
        </div>
      </main>
    );
  }

  if (!preview.data) return null;

  const invitation = preview.data;
  const serverError =
    accept.error instanceof ApiError
      ? accept.error.message
      : accept.error?.message;

  return (
    <main className="min-h-screen bg-dots flex items-center justify-center p-4">
      <div className="w-full max-w-md border border-border bg-card p-6 sm:p-8">
        <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-1">
          Invitación
        </p>
        <h1 className="text-2xl font-semibold text-foreground">
          {invitation.workspaceName}
        </h1>
        <p className="font-mono text-[11px] text-muted-foreground mt-1">
          /{invitation.workspaceSlug}
        </p>

        <div className="border border-border bg-border grid grid-cols-2 gap-px my-6">
          <div className="bg-card p-3">
            <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-1">
              Rol
            </p>
            <p className="text-sm text-foreground">
              {formatWorkspaceRole(invitation.role)}
            </p>
          </div>
          <div className="bg-card p-3">
            <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-1">
              Expira
            </p>
            <p className="text-sm text-foreground">
              {new Date(invitation.expiresAt).toLocaleString("es", {
                dateStyle: "short",
                timeStyle: "short",
              })}
            </p>
          </div>
        </div>

        {invitation.email && (
          <p className="text-xs text-muted-foreground mb-4">
            Esta invitación es para{" "}
            <strong className="text-foreground">{invitation.email}</strong>.
          </p>
        )}

        {serverError && (
          <p role="alert" className="text-sm text-destructive mb-4">
            {serverError}
          </p>
        )}

        <div className="flex flex-col gap-2">
          <Button
            onClick={() => accept.mutate()}
            loading={accept.isPending}
            className="w-full"
          >
            <Check className="size-4" />
            {accept.isPending ? "Aceptando…" : "Aceptar invitación"}
          </Button>
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors py-2"
          >
            <ArrowLeft className="size-3.5" /> Rechazar y volver al inicio
          </Link>
        </div>
      </div>
    </main>
  );
}
