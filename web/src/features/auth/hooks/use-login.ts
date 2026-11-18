import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authApi } from "../api/auth.api";
import { queryKeys } from "../../../shared/lib/query-keys";
import type { LoginInputDto } from "@orbit/shared/schemas/auth.schema";
import type { AuthResponseDto } from "@orbit/shared/types/responses";

/**
 * Hook de login con `useMutation`.
 *
 * Por qué `useMutation` y no `useQuery`:
 *   - `useQuery`  → LEE datos, se ejecuta al montar.
 *   - `useMutation` → ESCRIBE datos, se ejecuta cuando llamas `mutate()`.
 * @example
 *   const login = useLogin();
 *   login.mutate({ email, password }, {
 *     onSuccess: () => navigate("/workspaces"),
 *     onError: (err) => toast.error(err.message),
 *   });
 */
export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation<AuthResponseDto, Error, LoginInputDto>({
    mutationFn: authApi.login,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.me });
    },
  });
}