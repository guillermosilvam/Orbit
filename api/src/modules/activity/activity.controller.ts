import type { Request, Response } from "express";
import { z } from "zod";
import { AppError } from "../../errors/app-error.ts";
import type { ActivityService } from "./activity.service.ts";

const limitSchema = z.coerce.number().int().min(1).max(50).default(20);

export class ActivityController {
  constructor(private readonly activityService: ActivityService) {}

  list = async (req: Request, res: Response): Promise<void> => {
    if (!req.workspace) throw AppError.unauthorized();
    const limit = limitSchema.parse(req.query.limit);
    const activities = await this.activityService.listForWorkspace(
      req.workspace.id,
      limit,
    );
    res.json({ activities });
  };
}
