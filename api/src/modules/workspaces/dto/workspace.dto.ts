import { z } from 'zod'
import type { Workspace } from '../../../entities/workspace.entity'
import type { WorkspaceRole } from '../../../entities/workspace-member.entity'

// -- INPUT ------------------------------------------------
export const createWorkspaceSchema = z.object({
    name: z.string().trim().min(1).max(100)
})

export type CreateWorkspaceInputDto = z.infer<typeof createWorkspaceSchema>

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

// -- MAPPER -----------------------------------------------

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
