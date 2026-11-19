import { useQuery } from "@tanstack/react-query";
import { projectQueryOptions } from "../api/tasks-queries";

export function useProject(workspaceSlug: string, projectKey: string) {
  return useQuery(projectQueryOptions(workspaceSlug, projectKey));
}