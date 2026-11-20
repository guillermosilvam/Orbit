import { useMutation, useQueryClient } from "@tanstack/react-query";
import { tasksApi } from "../api/tasks.api";
import { queryKeys } from "../../../shared/lib/query-keys";
import type {
    TaskResponseDto,
} from "@orbit/shared/types/responses";
import type { TaskStatus } from "@orbit/shared/schemas/task.schema";

export type UpdateTaskOptimisticInput = {
    id: string;
    number: number;
    status: TaskStatus;
    position: number;
};

export function useUpdateTask(workspaceSlug: string, projectKey: string) {
    const queryClient = useQueryClient();
    const queryKey = queryKeys.tasks.list(workspaceSlug, projectKey);

    return useMutation({
        mutationFn: (input: UpdateTaskOptimisticInput) =>
            tasksApi.update(workspaceSlug, projectKey, input.number, {
                status: input.status,
                position: input.position,
            }),

        onMutate: (input) => {
            queryClient.cancelQueries({ queryKey });

            const previous = queryClient.getQueryData<TaskResponseDto[]>(queryKey);

            queryClient.setQueryData<TaskResponseDto[]>(queryKey, (old) =>
                old?.map((t) =>
                    t.id === input.id
                        ? { ...t, status: input.status, position: input.position }
                        : t,
                ),
            );

            return { previous };
        },

        onError: (_err, _input, ctx) => {
            if (ctx?.previous) queryClient.setQueryData(queryKey, ctx.previous);
        },

        onSuccess: ({ task }, input) => {
            queryClient.setQueryData(
                queryKeys.tasks.detail(workspaceSlug, projectKey, input.number),
                task,
            );
        },

        onSettled: () => {
            queryClient.invalidateQueries({ queryKey });
        },
    });
}