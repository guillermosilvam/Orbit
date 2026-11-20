import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { workspacesApi } from "../api/workspaces.api";
import { queryKeys } from "../../../shared/lib/query-keys";


export function useCreateWorkspace() {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    return useMutation({
        mutationFn: workspacesApi.create,
        onSuccess: ({ workspace }) => {
            queryClient.invalidateQueries({ queryKey: queryKeys.workspaces.all });
            queryClient.invalidateQueries({ queryKey: queryKeys.activity.all });
            navigate({
                to: "/workspaces/$workspaceSlug",
                params: { workspaceSlug: workspace.slug },
            });
        },
    });
}