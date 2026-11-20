import type { ActivityItemDto } from "@orbit/shared/types";
import { apiClient } from "../../../shared/lib/api-client";

export const activityApi = {
  list: (workspaceSlug: string, limit = 20) =>
    apiClient<{ activities: ActivityItemDto[] }>(
      `/workspaces/${encodeURIComponent(workspaceSlug)}/activity?limit=${limit}`,
    ),
};
