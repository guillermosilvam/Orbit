import { useQuery } from "@tanstack/react-query";
import { invitationPreviewQueryOptions } from "../api/invitations-queries";


export function useInvitationPreview(token: string) {
    return useQuery(invitationPreviewQueryOptions(token));
}