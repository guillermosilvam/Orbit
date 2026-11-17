import type { Workspace } from '../../../entities/workspace.entity'
import type { WorkspaceMember } from '../../../entities/workspace-member.entity'
import {
    createWorkspaceSchema,
    updateMemberRoleSchema,
} from "@orbit/shared/schemas/workspace.schema";
import type {
    CreateWorkspaceInputDto,
    UpdateMemberRoleInputDto,
} from "@orbit/shared/schemas/workspace.schema";
import type {
    WorkspaceMemberResponseDto,
    WorkspaceResponseDto,
    WorkspaceWithRoleDto,
} from "@orbit/shared/types";

export { createWorkspaceSchema, updateMemberRoleSchema };
export type {
    CreateWorkspaceInputDto,
    UpdateMemberRoleInputDto,
    WorkspaceMemberResponseDto,
    WorkspaceResponseDto,
    WorkspaceWithRoleDto,
};

// -- MAPPER -----------------------------------------------
export function toWorkspaceMemberResponseDto(m: WorkspaceMember): WorkspaceMemberResponseDto {
    return {
        id: m.id,
        userId: m.userId,
        role: m.role,
        createdAt: m.createdAt.toISOString(),
        user: {
            id: m.user.id,
            email: m.user.email,
            name: m.user.name,
        },
    };
}

export function toWorkspaceResponseDto(w: Workspace): WorkspaceResponseDto {
    return {
        id: w.id,
        name: w.name,
        slug: w.slug,
        ownerId: w.ownerId,
        createdAt: w.createdAt.toISOString(),
        updatedAt: w.updatedAt.toISOString(),
    };
}
