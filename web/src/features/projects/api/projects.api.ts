import { apiClient } from "../../../shared/lib/api-client";
import type { CreateProjectInputDto } from "@orbit/shared/schemas/project.schema";
import type { ProjectResponseDto } from "@orbit/shared/types/responses";


export const projectsApi = {
  list: (workspaceSlug: string) =>
    apiClient<{ projects: ProjectResponseDto[] }>(
      `/workspaces/${workspaceSlug}/projects`,
    ),

  create: (workspaceSlug: string, input: CreateProjectInputDto) =>
    apiClient<{ project: ProjectResponseDto }>(
      `/workspaces/${workspaceSlug}/projects`,
      { method: "POST", body: input },
    ),
};