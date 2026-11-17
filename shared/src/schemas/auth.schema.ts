import { z } from 'zod'

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