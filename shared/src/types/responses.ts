import type { WorkspaceRole } from "../schemas/workspace.schema.ts";
import type { TaskStatus, TaskPriority } from "../schemas/task.schema.ts";

// ── Auth ──
export type UserResponseDto = {
  id: string;
  email: string;
  name: string;
  createdAt: string;
};

export type AuthResponseDto = {
  user: UserResponseDto;
};

// ── Workspaces ──
export type WorkspaceResponseDto = {
  id: string;
  name: string;
  slug: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
};

export type WorkspaceWithRoleDto = WorkspaceResponseDto & {
  role: WorkspaceRole;
};

export type WorkspaceMemberResponseDto = {
  id: string;
  userId: string;
  role: WorkspaceRole;
  createdAt: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
};

// ── Projects ──
export type ProjectResponseDto = {
  id: string;
  workspaceId: string;
  name: string;
  key: string;
  description: string | null;
  taskCounter: number;
  createdAt: string;
  updatedAt: string;
};

// ── Tasks ──
export type TaskResponseDto = {
  id: string;
  identifier: string;
  number: number;
  projectId: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  position: number;
  assigneeId: string | null;
  dueDate: string | null;
  createdAt: string;
  updatedAt: string;
};

// ── Invitations ──
export type InvitationPreviewDto = {
  workspaceName: string;
  workspaceSlug: string;
  role: WorkspaceRole;
  email: string | null;
  expiresAt: string;
};

export type CreatedInvitationDto = {
  id: string;
  url: string;
  role: WorkspaceRole;
  email: string | null;
  expiresAt: string;
};

export type InvitationListItemDto = {
  id: string;
  role: WorkspaceRole;
  email: string | null;
  expiresAt: string;
  createdAt: string;
};