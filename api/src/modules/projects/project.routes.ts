import { Router, type RequestHandler } from "express";
import { ProjectController } from "./project.controller.ts";


export function createProjectRouter(
  controller: ProjectController,
  requireWorkspaceAdmin: RequestHandler,
  requireWorkspaceMember: RequestHandler,
): Router {
  const router = Router({ mergeParams: true });

  router.post("/", requireWorkspaceAdmin, controller.create);
  router.get("/", requireWorkspaceMember, controller.list);
  router.get("/:key", requireWorkspaceMember, controller.findOne);
  router.patch("/:key", requireWorkspaceAdmin, controller.update);
  router.delete("/:key", requireWorkspaceAdmin, controller.delete);

  return router;
}