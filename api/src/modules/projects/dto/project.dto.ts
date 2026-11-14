import z from "zod";
import type { Project } from "../../../entities/project.entity";

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


export type ProjectResponseDto = {
  id: string;
  workspaceId: string;
  name: string;
  key: string;
  description: string | null;
  taskCounter: number;
  createdAt: string;
  updatedAt: string;
};

export function toProjectResponseDto(p: Project): ProjectResponseDto {
  return {
    id: p.id,
    workspaceId: p.workspaceId,
    name: p.name,
    key: p.key,
    description: p.description,
    taskCounter: p.taskCounter,
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
  };
}