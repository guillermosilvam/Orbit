import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authApi } from "../api/auth.api";
import { queryKeys } from "../../../shared/lib/query-keys";
import type { LoginInputDto } from "@orbit/shared/schemas/auth.schema";
import type { AuthResponseDto } from "@orbit/shared/types/responses";


export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation<AuthResponseDto, Error, LoginInputDto>({
    mutationFn: authApi.login,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.me });
    },
  });
}