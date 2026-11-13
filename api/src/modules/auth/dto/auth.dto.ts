import { z } from 'zod'
import { User } from '../../../entities/user.entity'

export const registerSchema = z.object({
    email: z.email().transform((v) => v.toLowerCase()),
    password: z.string().min(8).max(100),
    name: z.string().trim().min(1).max(100)
})

export const loginSchema = z.object({
    email: z.email().transform((v) => v.toLowerCase()),
    password: z.string().min(1)
})

export type RegisterInputDto = z.infer<typeof registerSchema>
export type LoginInputDto = z.infer<typeof loginSchema>


// -- OUTPUT ---------------------------------------------------------------------------------------

export type UserResponseDto = {
    id: string;
    email: string;
    name: string;
    createdAt: string;
}

export type AuthResponseDto = {
  user: UserResponseDto;
};


export function toUserResponseDto(user: User): UserResponseDto {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    createdAt: user.createdAt.toISOString(),
  };
}
