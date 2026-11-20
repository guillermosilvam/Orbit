import { queryOptions } from "@tanstack/react-query";
import { queryKeys } from "../../../shared/lib/query-keys";
import { activityApi } from "./activity.api";

export const recentActivityQueryOptions = (
  workspaceSlug: string,
  limit = 20,
) =>
  queryOptions({
    queryKey: queryKeys.activity.recent(workspaceSlug, limit),
    queryFn: async () => {
      const { activities } = await activityApi.list(workspaceSlug, limit);
      return activities;
    },
  });
