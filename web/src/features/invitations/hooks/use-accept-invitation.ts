import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { invitationsApi } from "../api/invitations.api";
import { queryKeys } from "../../../shared/lib/query-keys";


export function useAcceptInvitation(token: string) {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    return useMutation({
        mutationFn: () => invitationsApi.accept(token),
        onSuccess: ({ workspaceSlug }) => {
            queryClient.invalidateQueries({ queryKey: queryKeys.workspaces.all });
            navigate({
                to: "/workspaces/$workspaceSlug",
                params: { workspaceSlug },
            });
        },
    });
}