import { z } from 'zod'
import type { Workspace } from '../../../entities/workspace.entity'
import type { WorkspaceRole, WorkspaceMember } from '../../../entities/workspace-member.entity'

// -- INPUT ------------------------------------------------
export const createWorkspaceSchema = z.object({
    name: z.string().trim().min(1).max(100)
})

export type CreateWorkspaceInputDto = z.infer<typeof createWorkspaceSchema>

export const updateMemberRoleSchema = z.object({
    role: z.enum(["admin", "member"]),
});

export type UpdateMemberRoleInputDto = z.infer<typeof updateMemberRoleSchema>;

// -- OUTPUT -----------------------------------------------

export type WorkspaceResponseDto = {
    id: string;
    name: string;
    slug: string;
    ownerId: string;
    createdAt: string;
    updatedAt: string;
}

export type WorkspaceWithRoleDto = WorkspaceResponseDto & {
    role: WorkspaceRole
}


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
