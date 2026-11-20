import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { workspacesApi } from "../api/workspaces.api";
import { queryKeys } from "../../../shared/lib/query-keys";
import { useToast } from "../../../shared/ui/toast-context";

export function useDeleteWorkspace(workspaceSlug: string) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const toast = useToast();

  return useMutation({
    mutationFn: () => workspacesApi.delete(workspaceSlug),
    onSuccess: async () => {
      toast.success("Espacio de trabajo eliminado.");
      await queryClient.invalidateQueries({
        queryKey: queryKeys.workspaces.list(),
      });
      queryClient.removeQueries({
        queryKey: queryKeys.workspaces.detail(workspaceSlug),
      });
      await navigate({ to: "/" });
    },
    onError: (error) =>
      toast.error(
        error instanceof Error
          ? `No se pudo eliminar el espacio: ${error.message}`
          : "No se pudo eliminar el espacio de trabajo.",
      ),
  });
}
