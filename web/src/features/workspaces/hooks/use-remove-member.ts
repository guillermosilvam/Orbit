import { useMutation, useQueryClient } from "@tanstack/react-query";
import { workspacesApi } from "../api/workspaces.api";
import { queryKeys } from "../../../shared/lib/query-keys";
import { useToast } from "../../../shared/ui/toast-context";

/**
 * Quita un miembro del workspace (solo owner/admin).
 * El backend rechaza si el target es owner o si es uno mismo.
 */
export function useRemoveMember(workspaceSlug: string) {
    const queryClient = useQueryClient();
    const toast = useToast();

    return useMutation({
        mutationFn: (userId: string) =>
            workspacesApi.removeMember(workspaceSlug, userId),
        onSuccess: () => {
            toast.success("Miembro eliminado del espacio.");
            queryClient.invalidateQueries({
                queryKey: queryKeys.workspaces.members(workspaceSlug),
            });
        },
        onError: (error) =>
            toast.error(
                error instanceof Error
                    ? `No se pudo quitar el miembro: ${error.message}`
                    : "No se pudo quitar el miembro.",
            ),
    });
}