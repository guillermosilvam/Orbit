import { useMutation, useQueryClient } from "@tanstack/react-query";
import { invitationsApi } from "../api/invitations.api";
import { queryKeys } from "../../../shared/lib/query-keys";
import type { CreateInvitationInputDto } from "@orbit/shared/schemas/workspace.schema";
import type { CreatedInvitationDto } from "@orbit/shared/types/responses";


export function useCreateInvitation(workspaceSlug: string) {
    const queryClient = useQueryClient();

    return useMutation<CreatedInvitationDto, Error, CreateInvitationInputDto>({
        mutationFn: async (input) => {
            const { invitation } = await invitationsApi.create(workspaceSlug, input);
            return invitation;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: queryKeys.workspaces.invitations(workspaceSlug),
            });
        },
    });
}