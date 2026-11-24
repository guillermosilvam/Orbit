import type { DataSource, Repository } from "typeorm";
import { Task, type TaskStatus } from "../../entities/task.entity.ts";
import { Project } from "../../entities/project.entity.ts";
import { AppError } from "../../errors/app-error.ts";
import type {
  CreateTaskInputDto,
  TaskResponseDto,
  UpdateTaskInputDto,
} from "./dto/task.dto.ts";
import { toTaskResponseDto } from "./dto/task.dto.ts";
import { recordActivity } from "../activity/activity.service.ts";
import type { WorkspaceRole } from "../../entities/workspace-member.entity.ts";

const POSITION_GAP = 1000;

export class TaskService {
  private readonly taskRepo: Repository<Task>;

  constructor(private readonly dataSource: DataSource) {
    this.taskRepo = dataSource.getRepository(Task);
  }


  async create(
    project: Project,
    input: CreateTaskInputDto,
    actorId: string,
  ): Promise<TaskResponseDto> {
    return this.dataSource.transaction(async (manager) => {
      const result = await manager
        .createQueryBuilder()
        .update(Project)
        .set({ taskCounter: () => "task_counter + 1" })
        .where("id = :id", { id: project.id })
        .returning("task_counter")
        .execute();

      const raw = result.raw as Array<{ task_counter: number }>;
      const nextNumber = raw[0]?.task_counter;
      if (nextNumber === undefined) {
        throw AppError.notFound("Proyecto no encontrado");
      }

      const status = input.status ?? "todo";
      const position = await this.nextPosition(project.id, status, manager);

      const task = manager.create(Task, {
        projectId: project.id,
        number: nextNumber,
        title: input.title,
        description: input.description ?? null,
        status,
        priority: input.priority ?? "medium",
        position: String(position),
        assigneeId: input.assigneeId ?? null,
        dueDate: input.dueDate ? new Date(input.dueDate) : null,
      });
      await manager.save(task);
      await recordActivity(manager, {
        workspaceId: project.workspaceId,
        actorId,
        type: "task_created",
        projectKey: project.key,
        taskIdentifier: `${project.key}-${task.number}`,
        taskTitle: task.title,
      });

      return toTaskResponseDto(task, project.key);
    });
  }

  async listByProject(
    projectId: string,
    projectKey: string,
    status?: TaskStatus,
  ): Promise<TaskResponseDto[]> {
    const where = status ? { projectId, status } : { projectId };
    const tasks = await this.taskRepo.find({
      where,
      order: { status: "ASC", position: "ASC" },
    });
    return tasks.map((t) => toTaskResponseDto(t, projectKey));
  }

  async findByNumber(
    projectId: string,
    projectKey: string,
    number: number,
  ): Promise<TaskResponseDto> {
    const task = await this.taskRepo.findOne({ where: { projectId, number } });
    if (!task) throw AppError.notFound("Task not found");
    return toTaskResponseDto(task, projectKey);
  }

  async update(
    projectId: string,
    workspaceId: string,
    projectKey: string,
    number: number,
    input: UpdateTaskInputDto,
    actorId: string,
    actorRole: WorkspaceRole,
  ): Promise<TaskResponseDto> {
    return this.dataSource.transaction(async (manager) => {
      const task = await manager.findOne(Task, {
        where: { projectId, number },
        lock: { mode: "pessimistic_write" },
      });
      if (!task) throw AppError.notFound("Task not found");
      const previousStatus = task.status;
      const positionChanged =
        input.position !== undefined &&
        Number(task.position) !== input.position;
      const statusChanged =
        input.status !== undefined && input.status !== task.status;

      if (
        (statusChanged || positionChanged) &&
        actorRole !== "owner" &&
        actorRole !== "admin" &&
        task.assigneeId !== actorId
      ) {
        throw AppError.forbidden(
          "Solo la persona asignada o un administrador puede mover esta tarea",
        );
      }

      if (input.title !== undefined) task.title = input.title;
      if (input.description !== undefined) task.description = input.description;
      if (input.status !== undefined) task.status = input.status;
      if (input.priority !== undefined) task.priority = input.priority;
      if (input.assigneeId !== undefined) task.assigneeId = input.assigneeId;
      if (input.dueDate !== undefined) {
        task.dueDate = input.dueDate ? new Date(input.dueDate) : null;
      }
      if (input.position !== undefined) task.position = String(input.position);

      await manager.save(task);
      if (previousStatus !== task.status) {
        await recordActivity(manager, {
          workspaceId,
          actorId,
          type: "task_status_changed",
          projectKey,
          taskIdentifier: `${projectKey}-${task.number}`,
          taskTitle: task.title,
          previousStatus,
          newStatus: task.status,
        });
      }
      return toTaskResponseDto(task, projectKey);
    });
  }

  async delete(
    projectId: string,
    number: number,
  ): Promise<void> {
    const task = await this.taskRepo.findOne({ where: { projectId, number } });
    if (!task) throw AppError.notFound("Task not found");
    await this.taskRepo.delete({ id: task.id });
  }

  private async nextPosition(
    projectId: string,
    status: TaskStatus,
    manager: import("typeorm").EntityManager,
  ): Promise<number> {
    const result = await manager
      .createQueryBuilder(Task, "t")
      .select("COALESCE(MAX(t.position), 0)", "max")
      .where("t.projectId = :projectId", { projectId })
      .andWhere("t.status = :status", { status })
      .getRawOne<{ max: string }>();

    return Number(result?.max ?? 0) + POSITION_GAP;
  }
}