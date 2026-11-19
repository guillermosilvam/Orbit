import { queryOptions } from "@tanstack/react-query";
import { projectsApi } from "./projects.api";
import { queryKeys } from "../../../shared/lib/query-keys";


export const projectsListQueryOptions = (workspaceSlug: string) =>
  queryOptions({
    queryKey: queryKeys.projects.list(workspaceSlug),
    queryFn: async () => {
      const { projects } = await projectsApi.list(workspaceSlug);
      return projects;
    },
  });