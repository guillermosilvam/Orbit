import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authApi } from "../api/auth.api";
import { queryKeys } from "../../../shared/lib/query-keys";
import type { RegisterInputDto } from "@orbit/shared/schemas/auth.schema";
import type { AuthResponseDto } from "@orbit/shared/types/responses";

/**
 * Hook de registro. Mismo patrón que `useLogin`:
 * - Mutación para POST.
 * - Invalidar `/auth/me` en éxito (el user cambió).
 */
export function useRegister() {
  const queryClient = useQueryClient();

  return useMutation<AuthResponseDto, Error, RegisterInputDto>({
    mutationFn: authApi.register,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.me });
    },
  });
}