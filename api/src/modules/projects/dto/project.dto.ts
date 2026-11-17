import type { Project } from "../../../entities/project.entity";
import { createProjectSchema, updateProjectSchema } from "@orbit/shared/schemas/project.schema";
import type { CreateProjectInputDto, UpdateProjectInputDto } from "@orbit/shared/schemas/project.schema";
import type { ProjectResponseDto } from "@orbit/shared/types";

export { createProjectSchema, updateProjectSchema };
export type { CreateProjectInputDto, ProjectResponseDto, UpdateProjectInputDto };

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