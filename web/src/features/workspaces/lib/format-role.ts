import type { WorkspaceRole } from "@orbit/shared/schemas/workspace.schema";

const ROLE_LABELS: Record<WorkspaceRole, string> = {
  owner: "Propietario",
  admin: "Administrador",
  member: "Miembro",
};

export function formatWorkspaceRole(role: WorkspaceRole): string {
  return ROLE_LABELS[role];
}
