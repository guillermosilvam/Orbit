import { useMutation, useQueryClient } from "@tanstack/react-query";
import { workspacesApi } from "../api/workspaces.api";
import { queryKeys } from "../../../shared/lib/query-keys";
import type { UpdateMemberRoleInputDto } from "@orbit/shared/schemas/workspace.schema";

/**
 * Cambia el rol de un miembro (solo owner/admin).
 * Roles permitidos: "admin" | "member" (owner no se cambia).
 */
export function useUpdateMemberRole(workspaceSlug: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            userId,
            input,
        }: {
            userId: string;
            input: UpdateMemberRoleInputDto;
        }) => workspacesApi.updateMemberRole(workspaceSlug, userId, input),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: queryKeys.workspaces.members(workspaceSlug),
            });
        },
    });
}