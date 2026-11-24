import { useState } from "react";
import { ChevronDown, Trash2 } from "lucide-react";
import type { WorkspaceMemberResponseDto } from "@orbit/shared/types/responses";
import type { WorkspaceRole } from "@orbit/shared/schemas/workspace.schema";
import { useUpdateMemberRole } from "../hooks/use-update-member-role";
import { useRemoveMember } from "../hooks/use-remove-member";
import { IconButton } from "../../../shared/ui/IconButton";
import { formatWorkspaceRole } from "../lib/format-role";
import { ConfirmDialog } from "../../../shared/ui/ConfirmDialog";

type Props = {
  members: WorkspaceMemberResponseDto[];
  workspaceSlug: string;
  currentUserId: string;
  currentUserRole: WorkspaceRole;
};

export function MembersList({
  members,
  workspaceSlug,
  currentUserId,
  currentUserRole,
}: Props) {
  const [memberToRemove, setMemberToRemove] =
    useState<WorkspaceMemberResponseDto | null>(null);
  const updateRole = useUpdateMemberRole(workspaceSlug);
  const remove = useRemoveMember(workspaceSlug);

  const canManage = currentUserRole === "owner" || currentUserRole === "admin";

  return (
    <div className="border border-border bg-card">
      {members.map((member) => {
        const isSelf = member.userId === currentUserId;
        const isOwner = member.role === "owner";
        const canChangeRole = canManage && !isSelf && !isOwner;
        const canRemove = canManage && !isSelf && !isOwner;

        return (
          <div
            key={member.id}
            className="flex flex-wrap items-center gap-3 border-b border-border px-3 py-3 last:border-b-0 sm:flex-nowrap sm:px-4"
          >
            <div className="size-9 bg-sidebar border border-border flex items-center justify-center font-semibold text-xs text-foreground shrink-0">
              {initials(member.user.name)}
            </div>

            <div className="min-w-0 flex-1 basis-[calc(100%-3.5rem)] sm:basis-auto">
              <p className="text-sm font-medium text-foreground truncate">
                {member.user.name}
                {isSelf && (
                  <span className="ml-2 font-mono text-[10px] text-muted-foreground">
                    (tú)
                  </span>
                )}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {member.user.email}
              </p>
            </div>

            {canChangeRole ? (
              <div className="relative shrink-0">
                <select
                  value={member.role}
                  onChange={(e) =>
                    updateRole.mutate({
                      userId: member.userId,
                      input: { role: e.target.value as "admin" | "member" },
                    })
                  }
                  disabled={updateRole.isPending}
                  className="h-8 appearance-none border border-border bg-card pl-2.5 pr-8 text-xs font-medium text-foreground transition-colors hover:bg-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:cursor-not-allowed disabled:opacity-50"
                  aria-label={`Rol de ${member.user.name}`}
                >
                  <option value="member">Miembro</option>
                  <option value="admin">Administrador</option>
                </select>
                <ChevronDown
                  className="pointer-events-none absolute right-2 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground"
                  aria-hidden
                />
              </div>
            ) : (
              <span className="border border-border bg-background px-1.5 py-0.5 text-[11px] font-medium text-muted-foreground">
                {formatWorkspaceRole(member.role)}
              </span>
            )}

            {canRemove ? (
              <IconButton
                variant="danger"
                aria-label={`Quitar a ${member.user.name}`}
                onClick={() => setMemberToRemove(member)}
                disabled={remove.isPending}
              >
                <Trash2 className="size-4" />
              </IconButton>
            ) : (
              <div className="hidden size-4 sm:block" aria-hidden />
            )}
          </div>
        );
      })}
      {memberToRemove && (
        <ConfirmDialog
          title="Quitar miembro"
          description={`¿Quitar a ${memberToRemove.user.name} de este espacio de trabajo? Perderá acceso a sus proyectos y tareas.`}
          confirmLabel="Quitar miembro"
          onClose={() => setMemberToRemove(null)}
          onConfirm={() => remove.mutate(memberToRemove.userId)}
        />
      )}
    </div>
  );
}

function initials(name: string): string {
  return name
    .split(/\s+/)
    .map((s) => s.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase();
}
