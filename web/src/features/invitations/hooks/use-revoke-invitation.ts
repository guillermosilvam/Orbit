import { useMutation, useQueryClient } from "@tanstack/react-query";
import { invitationsApi } from "../api/invitations.api";
import { queryKeys } from "../../../shared/lib/query-keys";

export function useRevokeInvitation(workspaceSlug: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (invitationId: string) =>
            invitationsApi.revoke(workspaceSlug, invitationId),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: queryKeys.workspaces.invitations(workspaceSlug),
            });
        },
    });
}