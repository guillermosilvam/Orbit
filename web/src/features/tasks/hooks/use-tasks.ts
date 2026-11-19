import { useQuery } from "@tanstack/react-query";
import { tasksListQueryOptions } from "../api/tasks-queries";

export function useTasks(workspaceSlug: string, projectKey: string) {
  return useQuery(tasksListQueryOptions(workspaceSlug, projectKey));
}