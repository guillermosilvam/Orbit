import type { RequestHandler } from "express";
import { AppError } from "../errors/app-error.ts";
import type { WorkspaceService } from "../modules/workspaces/workspace.service.ts";
import type { WorkspaceRole } from "../entities/workspace-member.entity.ts";


export function requireWorkspaceRole(
  workspaceService: WorkspaceService,
  ...allowedRoles: WorkspaceRole[]
): RequestHandler {
  return async (req, _res, next) => {
    if (!req.user) return next(AppError.unauthorized());

    const slug = req.params.workspaceSlug;
    if (typeof slug !== "string") {
      return next(AppError.notFound("Workspace not found"));
    }

    const { workspace, member } = await workspaceService.resolveMembership(
      slug,
      req.user.id,
    );

    if (allowedRoles.length > 0 && !allowedRoles.includes(member.role)) {
      return next(
        AppError.forbidden("You do not have permission to perform this action in the workspace"),
      );
    }

    req.workspace = workspace;
    req.member = member;
    next();
  };
}