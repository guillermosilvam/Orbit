import { z } from "zod";
import type { Task, TaskPriority, TaskStatus } from "../../../entities/task.entity.ts";

export const TASK_STATUSES = ["todo", "in_progress", "done"] as const;
export const TASK_PRIORITIES = ["low", "medium", "high", "urgent"] as const;

const statusSchema = z.enum(TASK_STATUSES);
const prioritySchema = z.enum(TASK_PRIORITIES);

export const createTaskSchema = z.object({
  title: z.string().trim().min(1).max(200),
  description: z.string().trim().max(5000).optional(),
  status: statusSchema.optional(),
  priority: prioritySchema.optional(),
  assigneeId: z.uuid().nullable().optional(),
  dueDate: z.iso.datetime().nullable().optional(),
});

export const updateTaskSchema = z.object({
  title: z.string().trim().min(1).max(200).optional(),
  description: z.string().trim().max(5000).nullable().optional(),
  status: statusSchema.optional(),
  priority: prioritySchema.optional(),
  assigneeId: z.uuid().nullable().optional(),
  dueDate: z.iso.datetime().nullable().optional(),
  position: z.coerce.number().optional(),
});

export type CreateTaskInputDto = z.infer<typeof createTaskSchema>;
export type UpdateTaskInputDto = z.infer<typeof updateTaskSchema>;

export type TaskResponseDto = {
  id: string;
  identifier: string;
  number: number;
  projectId: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  position: number;
  assigneeId: string | null;
  dueDate: string | null;
  createdAt: string;
  updatedAt: string;
};

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