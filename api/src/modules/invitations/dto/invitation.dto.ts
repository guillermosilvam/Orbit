import { z } from "zod";
import type { Invitation } from "../../../entities/invitation.entity.ts";
import type { WorkspaceRole } from "../../../entities/workspace-member.entity.ts";

export const createInvitationSchema = z.object({
    role: z.enum(["admin", "member"]),
    email: z.email().transform((v) => v.toLowerCase()).optional(),
    expiresInHours: z.coerce.number().int().min(1).max(24 * 30).optional(),
});

export type CreateInvitationInputDto = z.infer<typeof createInvitationSchema>;

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

export function toInvitationListItemDto(i: Invitation): InvitationListItemDto {
    return {
        id: i.id,
        role: i.role,
        email: i.email,
        expiresAt: i.expiresAt.toISOString(),
        createdAt: i.createdAt.toISOString(),
    };
}