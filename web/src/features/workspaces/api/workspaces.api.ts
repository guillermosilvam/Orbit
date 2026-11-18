import { apiClient } from "../../../shared/lib/api-client";
import type { CreateWorkspaceInputDto } from "@orbit/shared/schemas/workspace.schema";
import type {
    WorkspaceResponseDto,
    WorkspaceWithRoleDto,
} from "@orbit/shared/types/responses";


export const workspacesApi = {
    list: () =>
        apiClient<{ workspaces: WorkspaceWithRoleDto[] }>("/workspaces"),

    create: (input: CreateWorkspaceInputDto) =>
        apiClient<{ workspace: WorkspaceResponseDto }>("/workspaces", {
            method: "POST",
            body: input,
        }),
};