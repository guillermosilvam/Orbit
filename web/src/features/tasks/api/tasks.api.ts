import { apiClient } from "../../../shared/lib/api-client";
import type { CreateTaskInputDto } from "@orbit/shared/schemas/task.schema";
import type {
  ProjectResponseDto,
  TaskResponseDto,
} from "@orbit/shared/types/responses";


export const tasksApi = {
  getProject: (workspaceSlug: string, projectKey: string) =>
    apiClient<{ project: ProjectResponseDto }>(
      `/workspaces/${workspaceSlug}/projects/${projectKey}`,
    ),

  list: (workspaceSlug: string, projectKey: string) =>
    apiClient<{ tasks: TaskResponseDto[] }>(
      `/workspaces/${workspaceSlug}/projects/${projectKey}/tasks`,
    ),

  create: (
    workspaceSlug: string,
    projectKey: string,
    input: CreateTaskInputDto,
  ) =>
    apiClient<{ task: TaskResponseDto }>(
      `/workspaces/${workspaceSlug}/projects/${projectKey}/tasks`,
      { method: "POST", body: input },
    ),
};