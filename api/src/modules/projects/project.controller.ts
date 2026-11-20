import type { Request, Response } from "express";
import type { ProjectService } from "./project.service";
import { AppError } from "../../errors/app-error.ts";
import { createProjectSchema, updateProjectSchema } from "./dto/project.dto.ts";

export class ProjectController {
    constructor(private readonly projectService: ProjectService) { }

    create = async (req: Request, res: Response): Promise<void> => {
        if (!req.workspace || !req.user) throw AppError.unauthorized();
        const input = createProjectSchema.parse(req.body);
        const project = await this.projectService.create(
            req.workspace.id,
            req.user.id,
            input,
        );
        res.status(201).json({ project });
    }

    list = async (req: Request, res: Response): Promise<void> => {
        if (!req.workspace) throw AppError.unauthorized();
        const projects = await this.projectService.listByWorkspace(req.workspace.id);
        res.json({ projects });
    };

    findOne = async (req: Request, res: Response): Promise<void> => {
        if (!req.workspace) throw AppError.unauthorized();
        const key = req.params.key;
        if (typeof key !== "string") throw AppError.notFound("Project not found");
        const project = await this.projectService.findByKey(req.workspace.id, key);
        res.json({ project });
    };

    update = async (req: Request, res: Response): Promise<void> => {
        if (!req.workspace) throw AppError.unauthorized();
        const key = req.params.key;
        if (typeof key !== "string") throw AppError.notFound("Project not found");
        const input = updateProjectSchema.parse(req.body);
        const project = await this.projectService.update(req.workspace.id, key, input);
        res.json({ project });
    };

    delete = async (req: Request, res: Response): Promise<void> => {
        if (!req.workspace) throw AppError.unauthorized();
        const key = req.params.key;
        if (typeof key !== "string") throw AppError.notFound("Project not found");
        await this.projectService.delete(req.workspace.id, key);
        res.status(204).send();
    };
}