import { useQuery } from "@tanstack/react-query";
import { workspaceQueryOptions } from "../api/workspaces-queries";

export function useWorkspace(workspaceSlug: string | undefined) {
  return useQuery({
    ...workspaceQueryOptions(workspaceSlug ?? ""),
    enabled: Boolean(workspaceSlug),
  });
}
