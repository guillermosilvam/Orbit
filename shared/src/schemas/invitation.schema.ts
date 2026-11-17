import { z } from 'zod'

export const createInvitationSchema = z.object({
    role: z.enum(["admin", "member"]),
    email: z.email().transform((v) => v.toLowerCase()).optional(),
    expiresInHours: z.coerce.number().int().min(1).max(24 * 30).optional(),
});

export type CreateInvitationInputDto = z.infer<typeof createInvitationSchema>;