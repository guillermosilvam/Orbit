import { Clock, Trash2 } from "lucide-react";
import type { InvitationListItemDto } from "@orbit/shared/types/responses";
import { useRevokeInvitation } from "../hooks/use-revoke-invitation";
import { IconButton } from "../../../shared/ui/IconButton";
import { formatWorkspaceRole } from "../../workspaces/lib/format-role";

type Props = {
  invitations: InvitationListItemDto[];
  workspaceSlug: string;
};

/**
 * Lista de invitaciones pendientes. Cada fila muestra:
 * - Rol de la persona invitada.
 * - Email si fue para alguien específico, o "Enlace abierto" si no.
 * - Expiración (fecha local).
 * - Botón revocar.
 *
 * Nota: NO se muestra el link porque no se puede recuperar (el backend
 * guarda solo el hash). Para compartir de nuevo, revoca y crea otra.
 */
export function InvitationsList({ invitations, workspaceSlug }: Props) {
  const revoke = useRevokeInvitation(workspaceSlug);

  if (invitations.length === 0) {
    return (
      <div className="border border-border bg-card p-12 text-center">
        <h2 className="text-lg font-semibold text-foreground">
          Sin invitaciones pendientes
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Genera un enlace para invitar a alguien a este espacio de trabajo.
        </p>
      </div>
    );
  }

  return (
    <div className="border border-border bg-card">
      {invitations.map((inv) => (
        <div
          key={inv.id}
          className="flex items-center gap-3 border-b border-border px-3 py-3 last:border-b-0 sm:px-4"
        >
          <span className="border border-border bg-background px-1.5 py-0.5 text-[11px] font-medium text-muted-foreground">
            {formatWorkspaceRole(inv.role)}
          </span>

          <div className="flex-1 min-w-0">
            <p className="text-sm text-foreground truncate">
              {inv.email ?? "Enlace abierto"}
            </p>
            <p className="text-[11px] text-muted-foreground flex items-center gap-1 mt-0.5">
              <Clock className="size-3" />
              Expira{" "}
              {new Date(inv.expiresAt).toLocaleString("es", {
                dateStyle: "short",
                timeStyle: "short",
              })}
            </p>
          </div>

          <IconButton
            variant="danger"
            aria-label="Revocar invitación"
            onClick={() => {
              if (
                confirm(
                  "¿Revocar esta invitación? El enlace dejará de funcionar.",
                )
              ) {
                revoke.mutate(inv.id);
              }
            }}
            disabled={revoke.isPending}
          >
            <Trash2 className="size-4" />
          </IconButton>
        </div>
      ))}
    </div>
  );
}
