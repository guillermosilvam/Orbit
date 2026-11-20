import { useMutation, useQueryClient } from "@tanstack/react-query";
import { tasksApi } from "../api/tasks.api";
import { queryKeys } from "../../../shared/lib/query-keys";
import { useToast } from "../../../shared/ui/toast-context";


export function useDeleteTask(workspaceSlug: string, projectKey: string) {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: (number: number) =>
      tasksApi.delete(workspaceSlug, projectKey, number),
    onSuccess: (_data, number) => {
      toast.success("Tarea eliminada.");
      queryClient.removeQueries({
        queryKey: queryKeys.tasks.detail(workspaceSlug, projectKey, number),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.tasks.list(workspaceSlug, projectKey),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.projects.detail(workspaceSlug, projectKey),
      });
    },
    onError: (error) =>
      toast.error(
        error instanceof Error
          ? `No se pudo eliminar la tarea: ${error.message}`
          : "No se pudo eliminar la tarea.",
      ),
  });
}