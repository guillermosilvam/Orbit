import { useQuery } from "@tanstack/react-query";
import { authApi } from "../api/auth.api";
import { queryKeys } from "../../../shared/lib/query-keys";
import { ApiError } from "../../../shared/lib/api-client";

/**
 * Hook que devuelve el user autenticado (o null si no hay sesión).
 *
 * `isLoading` es true solo la primera vez (cuando no hay datos en caché).
 * En navegaciones posteriores, si los datos están frescos (staleTime),
 * `isLoading` es false y `data` está disponible inmediatamente.
 */
export function useMe() {
  return useQuery({
    queryKey: queryKeys.auth.me,
    queryFn: async () => {
      try {
        const { user } = await authApi.me();
        return user ?? null;
      } catch (err) {
        if (err instanceof ApiError && err.status === 401) return null;
        throw err;
      }
    },
    retry: false,
    staleTime: 60_000,
  });
}