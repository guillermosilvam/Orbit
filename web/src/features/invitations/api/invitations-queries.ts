import { queryOptions } from "@tanstack/react-query";
import { invitationsApi } from "./invitations.api";
import { queryKeys } from "../../../shared/lib/query-keys";

export const invitationsListQueryOptions = (workspaceSlug: string) =>
    queryOptions({
        queryKey: queryKeys.workspaces.invitations(workspaceSlug),
        queryFn: async () => {
            const { invitations } = await invitationsApi.list(workspaceSlug);
            return invitations;
        },
    });

export const invitationPreviewQueryOptions = (token: string) =>
    queryOptions({
        queryKey: ["invitations", "preview", token],
        queryFn: async () => {
            const { invitation } = await invitationsApi.preview(token);
            return invitation;
        },
        retry: false,
    });