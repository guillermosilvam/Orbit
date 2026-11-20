import { useQuery } from "@tanstack/react-query";
import { recentActivityQueryOptions } from "../api/activity-queries";

export function useRecentActivity(workspaceSlug: string, limit = 20) {
  return useQuery(recentActivityQueryOptions(workspaceSlug, limit));
}
