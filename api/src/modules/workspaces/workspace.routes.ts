import { Router, type RequestHandler } from "express";
import type { WorkspaceController } from "./workspace.controller";

export function createWorkspaceRouter(
    controller: WorkspaceController,
    requireAuth: RequestHandler
): Router {
    const router = Router()

    router.use(requireAuth)
    router.post("/", controller.create);
    router.get("/", controller.findAll);
    router.get(":slug", controller.findOne);

    return router
}