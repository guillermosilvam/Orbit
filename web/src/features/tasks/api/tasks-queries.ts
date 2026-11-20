import { queryOptions } from "@tanstack/react-query";
import { tasksApi } from "./tasks.api";
import { queryKeys } from "../../../shared/lib/query-keys";

export const projectQueryOptions = (workspaceSlug: string, projectKey: string) =>
  queryOptions({
    queryKey: queryKeys.projects.detail(workspaceSlug, projectKey),
    queryFn: async () => {
      const { project } = await tasksApi.getProject(workspaceSlug, projectKey);
      return project;
    },
  });

export const tasksListQueryOptions = (workspaceSlug: string, projectKey: string) =>
  queryOptions({
    queryKey: queryKeys.tasks.list(workspaceSlug, projectKey),
    queryFn: async () => {
      const { tasks } = await tasksApi.list(workspaceSlug, projectKey);
      return tasks;
    },
  });

export const taskDetailQueryOptions = (
  workspaceSlug: string,
  projectKey: string,
  number: number,
) =>
  queryOptions({
    queryKey: queryKeys.tasks.detail(workspaceSlug, projectKey, number),
    queryFn: async () => {
      const { task } = await tasksApi.get(workspaceSlug, projectKey, number);
      return task;
    },
  });