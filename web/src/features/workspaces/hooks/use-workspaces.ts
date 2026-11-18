import { useQuery } from "@tanstack/react-query";
import { workspacesListQueryOptions } from "../api/workspaces-queries";


export function useWorkspaces() {
    return useQuery(workspacesListQueryOptions);
}