import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { projectsApi } from "../api/projects.api";
import { queryKeys } from "../../../shared/lib/query-keys";
import { useToast } from "../../../shared/ui/toast-context";

export function useDeleteProject(workspaceSlug: string, projectKey: string) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const toast = useToast();

  return useMutation({
    mutationFn: () => projectsApi.delete(workspaceSlug, projectKey),
    onSuccess: async () => {
      toast.success("Proyecto eliminado.");
      await queryClient.invalidateQueries({
        queryKey: queryKeys.projects.list(workspaceSlug),
      });
      queryClient.removeQueries({
        queryKey: queryKeys.projects.detail(workspaceSlug, projectKey),
      });
      queryClient.removeQueries({
        queryKey: queryKeys.tasks.list(workspaceSlug, projectKey),
      });
      await navigate({
        to: "/workspaces/$workspaceSlug",
        params: { workspaceSlug },
        search: { view: "projects" },
      });
    },
    onError: (error) =>
      toast.error(
        error instanceof Error
          ? `No se pudo eliminar el proyecto: ${error.message}`
          : "No se pudo eliminar el proyecto.",
      ),
  });
}
