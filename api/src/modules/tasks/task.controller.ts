import type { Request, Response } from "express";
import type { TaskService } from "./task.service.ts";
import { AppError } from "../../errors/app-error.ts";
import { createTaskSchema, updateTaskSchema } from "./dto/task.dto.ts";
import type { TaskStatus } from "../../entities/task.entity.ts";

function parseTaskNumber(raw: string | string[] | undefined): number {
  if (typeof raw !== "string") throw AppError.notFound("Task not found");
  const n = Number(raw);
  if (!Number.isInteger(n) || n < 1) throw AppError.notFound("Task not found");
  return n;
}

export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  create = async (req: Request, res: Response): Promise<void> => {
    if (!req.project) throw AppError.unauthorized();
    const input = createTaskSchema.parse(req.body);
    const task = await this.taskService.create(req.project, input);
    res.status(201).json({ task });
  };

  list = async (req: Request, res: Response): Promise<void> => {
    if (!req.project) throw AppError.unauthorized();
    const status = req.query.status as TaskStatus | undefined;
    const tasks = await this.taskService.listByProject(
      req.project.id,
      req.project.key,
      status,
    );
    res.json({ tasks });
  };

  findOne = async (req: Request, res: Response): Promise<void> => {
    if (!req.project) throw AppError.unauthorized();
    const number = parseTaskNumber(req.params.taskNumber);
    const task = await this.taskService.findByNumber(
      req.project.id,
      req.project.key,
      number,
    );
    res.json({ task });
  };

  update = async (req: Request, res: Response): Promise<void> => {
    if (!req.project) throw AppError.unauthorized();
    const number = parseTaskNumber(req.params.taskNumber);
    const input = updateTaskSchema.parse(req.body);
    const task = await this.taskService.update(
      req.project.id,
      req.project.key,
      number,
      input,
    );
    res.json({ task });
  };

  delete = async (req: Request, res: Response): Promise<void> => {
    if (!req.project) throw AppError.unauthorized();
    const number = parseTaskNumber(req.params.taskNumber);
    await this.taskService.delete(req.project.id, number);
    res.status(204).send();
  };
}