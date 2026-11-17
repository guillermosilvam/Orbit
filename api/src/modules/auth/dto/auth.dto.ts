import { User } from '../../../entities/user.entity'
import { loginSchema, registerSchema } from "@orbit/shared/schemas/auth.schema";
import type { LoginInputDto, RegisterInputDto } from "@orbit/shared/schemas/auth.schema";
import type { AuthResponseDto, UserResponseDto } from "@orbit/shared/types";

export { loginSchema, registerSchema };
export type { AuthResponseDto, LoginInputDto, RegisterInputDto, UserResponseDto };


export function toUserResponseDto(user: User): UserResponseDto {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    createdAt: user.createdAt.toISOString(),
  };
}
