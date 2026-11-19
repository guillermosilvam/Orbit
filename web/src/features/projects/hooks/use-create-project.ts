import { useMutation, useQueryClient } from "@tanstack/react-query";
import { projectsApi } from "../api/projects.api";
import { queryKeys } from "../../../shared/lib/query-keys";
import type { CreateProjectInputDto } from "@orbit/shared/schemas/project.schema";


export function useCreateProject(workspaceSlug: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateProjectInputDto) =>
      projectsApi.create(workspaceSlug, input),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.projects.list(workspaceSlug),
      });
    },
  });
}