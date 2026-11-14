import type { RequestHandler } from "express";
import { AppError } from "../errors/app-error.ts";
import type { ProjectService } from "../modules/projects/project.service.ts";
import type { Project } from "../entities/project.entity.ts";


export function createRequireProject(projectService: ProjectService): RequestHandler {
  return async (req, _res, next) => {
    if (!req.workspace) return next(AppError.unauthorized());
    const key = req.params.projectKey;
    if (typeof key !== "string") return next(AppError.notFound("Project not found"));

    const project = await projectService.findEntityByKey(req.workspace.id, key);
    if (!project) return next(AppError.notFound("Project not found"));

    req.project = project;
    next();
  };
}