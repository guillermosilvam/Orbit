import { apiClient } from "../../../shared/lib/api-client";
import type { LoginInputDto, RegisterInputDto } from "@orbit/shared/schemas/auth.schema";
import type { AuthResponseDto, UserResponseDto } from "@orbit/shared/types/responses";


export const authApi = {
  login: (input: LoginInputDto) =>
    apiClient<AuthResponseDto>("/auth/login", {
      method: "POST",
      body: input,
    }),

  register: (input: RegisterInputDto) =>
    apiClient<AuthResponseDto>("/auth/register", {
      method: "POST",
      body: input,
    }),

  logout: () => apiClient<null>("/auth/logout", { method: "POST" }),

  me: () => apiClient<{ user: UserResponseDto }>("/auth/me"),
};