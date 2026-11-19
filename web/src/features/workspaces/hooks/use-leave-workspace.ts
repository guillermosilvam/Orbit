import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { workspacesApi } from "../api/workspaces.api";
import { queryKeys } from "../../../shared/lib/query-keys";

/**
 * Abandona el workspace (cualquier miembro excepto el owner).
 * Al salir:
 * 1. Invalida la lista de workspaces (el user ya no pertenece a este).
 * 2. Navega al dashboard ("/").
 *
 * `auth.me` no se invalida: el user sigue existiendo, solo pierde acceso.
 */
export function useLeaveWorkspace(workspaceSlug: string) {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    return useMutation({
        mutationFn: () => workspacesApi.leave(workspaceSlug),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.workspaces.all });
            navigate({ to: "/" });
        },
    });
}