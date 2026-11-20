import { queryOptions } from "@tanstack/react-query";
import { workspacesApi } from "./workspaces.api";
import { queryKeys } from "../../../shared/lib/query-keys";

export const workspacesListQueryOptions = queryOptions({
    queryKey: queryKeys.workspaces.list(),
    queryFn: async () => {
        const { workspaces } = await workspacesApi.list();
        return workspaces;
    },
});

export const workspaceQueryOptions = (workspaceSlug: string) =>
    queryOptions({
        queryKey: queryKeys.workspaces.detail(workspaceSlug),
        queryFn: async () => {
            const { workspace } = await workspacesApi.get(workspaceSlug);
            return workspace;
        },
    });

export const membersQueryOptions = (workspaceSlug: string) =>
    queryOptions({
        queryKey: queryKeys.workspaces.members(workspaceSlug),
        queryFn: async () => {
            const { members } = await workspacesApi.listMembers(workspaceSlug);
            return members;
        },
    });