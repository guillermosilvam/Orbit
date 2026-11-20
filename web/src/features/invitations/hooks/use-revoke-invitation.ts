import { useMutation, useQueryClient } from "@tanstack/react-query";
import { invitationsApi } from "../api/invitations.api";
import { queryKeys } from "../../../shared/lib/query-keys";
import { useToast } from "../../../shared/ui/toast-context";

export function useRevokeInvitation(workspaceSlug: string) {
    const queryClient = useQueryClient();
    const toast = useToast();

    return useMutation({
        mutationFn: (invitationId: string) =>
            invitationsApi.revoke(workspaceSlug, invitationId),
        onSuccess: () => {
            toast.success("Invitación revocada.");
            queryClient.invalidateQueries({
                queryKey: queryKeys.workspaces.invitations(workspaceSlug),
            });
        },
        onError: (error) =>
            toast.error(
                error instanceof Error
                    ? `No se pudo revocar la invitación: ${error.message}`
                    : "No se pudo revocar la invitación.",
            ),
    });
}