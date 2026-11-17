import type { Invitation } from "../../../entities/invitation.entity.ts";
import { createInvitationSchema } from "@orbit/shared/schemas/invitation.schema";
import type { CreateInvitationInputDto } from "@orbit/shared/schemas/invitation.schema";
import type {
    CreatedInvitationDto,
    InvitationListItemDto,
    InvitationPreviewDto,
} from "@orbit/shared/types";

export { createInvitationSchema };
export type {
    CreatedInvitationDto,
    CreateInvitationInputDto,
    InvitationListItemDto,
    InvitationPreviewDto,
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