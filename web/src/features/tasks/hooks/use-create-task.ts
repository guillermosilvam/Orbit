import { useMutation, useQueryClient } from "@tanstack/react-query";
import { tasksApi } from "../api/tasks.api";
import { queryKeys } from "../../../shared/lib/query-keys";
import type { CreateTaskInputDto } from "@orbit/shared/schemas/task.schema";


export function useCreateTask(workspaceSlug: string, projectKey: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateTaskInputDto) =>
      tasksApi.create(workspaceSlug, projectKey, input),
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