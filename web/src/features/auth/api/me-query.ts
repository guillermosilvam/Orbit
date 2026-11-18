import { queryOptions } from "@tanstack/react-query";
import { authApi } from "./auth.api";
import { queryKeys } from "../../../shared/lib/query-keys";
import { ApiError } from "../../../shared/lib/api-client";

/**
 * Definición compartida de la query del user actual.
 *
 * ¿Por qué `queryOptions` y no el objeto inline en `useMe`?
 * - `useMe` la usa con `useQuery(meQueryOptions)`.
 * - `beforeLoad` la usa con `queryClient.ensureQueryData(meQueryOptions)`.
 * Una sola fuente de verdad: queryKey, queryFn, staleTime, retry.
 * Si cambias la lógica, cambia en todos los consumidores.
 *
 * `401 → null`: no es error, es "no hay sesión".
 * `retry: false`: un 401 no se arregla reintentando.
 * `staleTime: 60s`: el user no cambia tan seguido.
 */
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