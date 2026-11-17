import { z } from 'zod'

export const createProjectSchema = z.object({
    name: z.string().trim().min(1).max(100),
    key: z
        .string()
        .trim()
        .regex(/^[A-Z0-9]{2,5}$/, "2-5 chars, uppercase letters and numbers only")
        .transform((v) => v.toUpperCase()),
    description: z.string().trim().max(2000).optional(),
})

export const updateProjectSchema = z.object({
    name: z.string().trim().min(1).max(100).optional(),
    description: z.string().trim().max(2000).nullable().optional(),
})

export type CreateProjectInputDto = z.infer<typeof createProjectSchema>;
export type UpdateProjectInputDto = z.infer<typeof updateProjectSchema>;