import { apiClient } from "../../../shared/lib/api-client";
import type {
    CreateWorkspaceInputDto,
    UpdateMemberRoleInputDto,
} from "@orbit/shared/schemas/workspace.schema";
import type {
    WorkspaceResponseDto,
    WorkspaceWithRoleDto,
    WorkspaceMemberResponseDto,
} from "@orbit/shared/types/responses";


export const workspacesApi = {
    list: () =>
        apiClient<{ workspaces: WorkspaceWithRoleDto[] }>("/workspaces"),

    create: (input: CreateWorkspaceInputDto) =>
        apiClient<{ workspace: WorkspaceResponseDto }>("/workspaces", {
            method: "POST",
            body: input,
        }),

    listMembers: (workspaceSlug: string) =>
        apiClient<{ members: WorkspaceMemberResponseDto[] }>(
            `/workspaces/${workspaceSlug}/members`,
        ),

    removeMember: (workspaceSlug: string, userId: string) =>
        apiClient<null>(
            `/workspaces/${workspaceSlug}/members/${userId}`,
            { method: "DELETE" },
        ),

    updateMemberRole: (
        workspaceSlug: string,
        userId: string,
        input: UpdateMemberRoleInputDto,
    ) =>
        apiClient<{ member: WorkspaceMemberResponseDto }>(
            `/workspaces/${workspaceSlug}/members/${userId}`,
            { method: "PATCH", body: input },
        ),

    leave: (workspaceSlug: string) =>
        apiClient<null>(`/workspaces/${workspaceSlug}/leave`, { method: "POST" }),
};