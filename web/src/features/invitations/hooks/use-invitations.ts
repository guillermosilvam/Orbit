import { useQuery } from "@tanstack/react-query";
import { invitationsListQueryOptions } from "../api/invitations-queries";

export function useInvitations(workspaceSlug: string) {
    return useQuery(invitationsListQueryOptions(workspaceSlug));
}