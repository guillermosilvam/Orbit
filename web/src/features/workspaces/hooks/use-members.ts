import { useQuery } from "@tanstack/react-query";
import { membersQueryOptions } from "../api/workspaces-queries";

export function useMembers(workspaceSlug: string) {
    return useQuery(membersQueryOptions(workspaceSlug));
}