import { useMutation, useQueryClient } from "@tanstack/react-query";
import { tasksApi } from "../api/tasks.api";
import { queryKeys } from "../../../shared/lib/query-keys";


export function useDeleteTask(workspaceSlug: string, projectKey: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (number: number) =>
      tasksApi.delete(workspaceSlug, projectKey, number),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.tasks.list(workspaceSlug, projectKey),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.projects.detail(workspaceSlug, projectKey),
      });
    },
  });
}