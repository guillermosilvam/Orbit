import { useQuery } from "@tanstack/react-query";
import { projectsListQueryOptions } from "../api/projects-queries";


export function useProjects(workspaceSlug: string | undefined) {
  return useQuery({
    ...projectsListQueryOptions(workspaceSlug ?? ""),
    enabled: Boolean(workspaceSlug),
  });
}