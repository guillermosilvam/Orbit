import type { Task } from "../../../entities/task.entity.ts";
import {
  TASK_PRIORITIES,
  TASK_STATUSES,
  createTaskSchema,
  updateTaskSchema,
} from "@orbit/shared/schemas/task.schema";
import type { CreateTaskInputDto, UpdateTaskInputDto } from "@orbit/shared/schemas/task.schema";
import type { TaskResponseDto } from "@orbit/shared/types";

export { TASK_PRIORITIES, TASK_STATUSES, createTaskSchema, updateTaskSchema };
export type { CreateTaskInputDto, TaskResponseDto, UpdateTaskInputDto };

export function toTaskResponseDto(t: Task, projectKey: string): TaskResponseDto {
  return {
    id: t.id,
    identifier: `${projectKey}-${t.number}`,
    number: t.number,
    projectId: t.projectId,
    title: t.title,
    description: t.description,
    status: t.status,
    priority: t.priority,
    position: Number(t.position),
    assigneeId: t.assigneeId,
    dueDate: t.dueDate ? t.dueDate.toISOString() : null,
    createdAt: t.createdAt.toISOString(),
    updatedAt: t.updatedAt.toISOString(),
  };
}