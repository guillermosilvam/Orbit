import { Router, type RequestHandler } from "express";
import type { WorkspaceController } from "./workspace.controller";

export function createWorkspaceRouter(
    controller: WorkspaceController,
    requireAuth: RequestHandler,
    requireWorkspaceMember: RequestHandler,
    requireWorkspaceOwner: RequestHandler,
): Router {
    const router = Router()

    router.use(requireAuth)
    router.post("/", controller.create);
    router.get("/", controller.findAll);
    router.get("/:workspaceSlug", requireWorkspaceMember, controller.findOne);
    router.delete("/:workspaceSlug", requireWorkspaceOwner, controller.delete);

    return router
}