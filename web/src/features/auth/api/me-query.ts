import { queryOptions } from "@tanstack/react-query";
import { authApi } from "./auth.api";
import { queryKeys } from "../../../shared/lib/query-keys";
import { ApiError } from "../../../shared/lib/api-client";


export const meQueryOptions = queryOptions({
  queryKey: queryKeys.auth.me,
  queryFn: async () => {
    try {
      const { user } = await authApi.me();
      return user;
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) return null;
      throw err;
    }
  },
  retry: false,
  staleTime: 60_000,
});