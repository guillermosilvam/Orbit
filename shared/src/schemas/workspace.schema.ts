import { z } from "zod";

export const workspaceRoleSchema = z.enum(["owner", "admin", "member"]);
export type WorkspaceRole = z.infer<typeof workspaceRoleSchema>;

export const createWorkspaceSchema = z.object({
  name: z.string().trim().min(1).max(100),
});

export const updateMemberRoleSchema = z.object({
  role: z.enum(["admin", "member"]),
});

export const createInvitationSchema = z.object({
  role: z.enum(["admin", "member"]),
  email: z.email().transform((v) => v.toLowerCase()).optional(),
  expiresInHours: z.coerce.number().int().min(1).max(24 * 30).optional(),
});

export type CreateWorkspaceInputDto = z.infer<typeof createWorkspaceSchema>;
export type UpdateMemberRoleInputDto = z.infer<typeof updateMemberRoleSchema>;
export type CreateInvitationInputDto = z.infer<typeof createInvitationSchema>;