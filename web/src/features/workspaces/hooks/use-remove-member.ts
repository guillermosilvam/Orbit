import { useMutation, useQueryClient } from "@tanstack/react-query";
import { workspacesApi } from "../api/workspaces.api";
import { queryKeys } from "../../../shared/lib/query-keys";

/**
 * Quita un miembro del workspace (solo owner/admin).
 * El backend rechaza si el target es owner o si es uno mismo.
 */
export function useRemoveMember(workspaceSlug: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (userId: string) =>
            workspacesApi.removeMember(workspaceSlug, userId),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: queryKeys.workspaces.members(workspaceSlug),
            });
        },
    });
}