import { useMutation, useQueryClient } from "@tanstack/react-query";
import { tasksApi } from "../api/tasks.api";
import { queryKeys } from "../../../shared/lib/query-keys";
import type { UpdateTaskInputDto } from "@orbit/shared/schemas/task.schema";


export function useUpdateTaskFields(workspaceSlug: string, projectKey: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      number,
      input,
    }: {
      number: number;
      input: UpdateTaskInputDto;
    }) => tasksApi.update(workspaceSlug, projectKey, number, input),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.tasks.list(workspaceSlug, projectKey),
      });
    },
  });
}