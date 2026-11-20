import { useMutation, useQueryClient } from "@tanstack/react-query";
import { projectsApi } from "../api/projects.api";
import { queryKeys } from "../../../shared/lib/query-keys";
import type { UpdateProjectInputDto } from "@orbit/shared/schemas/project.schema";

export function useUpdateProject(workspaceSlug: string, projectKey: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdateProjectInputDto) =>
      projectsApi.update(workspaceSlug, projectKey, input),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.projects.list(workspaceSlug),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.projects.detail(workspaceSlug, projectKey),
      });
    },
  });
}
