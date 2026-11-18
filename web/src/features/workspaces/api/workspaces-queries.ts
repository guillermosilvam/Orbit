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