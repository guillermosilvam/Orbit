import { apiClient } from "../../../shared/lib/api-client";
import type { CreateInvitationInputDto } from "@orbit/shared/schemas/workspace.schema";
import type {
    CreatedInvitationDto,
    InvitationListItemDto,
    InvitationPreviewDto,
} from "@orbit/shared/types/responses";


export const invitationsApi = {
    create: (workspaceSlug: string, input: CreateInvitationInputDto) =>
        apiClient<{ invitation: CreatedInvitationDto }>(
            `/workspaces/${workspaceSlug}/invitations`,
            { method: "POST", body: input },
        ),

    list: (workspaceSlug: string) =>
        apiClient<{ invitations: InvitationListItemDto[] }>(
            `/workspaces/${workspaceSlug}/invitations`,
        ),

    revoke: (workspaceSlug: string, invitationId: string) =>
        apiClient<null>(
            `/workspaces/${workspaceSlug}/invitations/${invitationId}`,
            { method: "DELETE" },
        ),

    preview: (token: string) =>
        apiClient<{ invitation: InvitationPreviewDto }>(`/invitations/${token}`),

    accept: (token: string) =>
        apiClient<{ workspaceSlug: string }>(`/invitations/${token}/accept`, {
            method: "POST",
        }),
};