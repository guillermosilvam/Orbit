import { Router, type RequestHandler } from "express";
import { TaskController } from "./task.controller.ts";


export function createTaskRouter(
  controller: TaskController,
  requireWorkspaceMember: RequestHandler,
  requireProject: RequestHandler,
): Router {
  const router = Router({ mergeParams: true });

  router.use(requireWorkspaceMember);
  router.use(requireProject);

  router.post("/", controller.create);
  router.get("/", controller.list);
  router.get("/:taskNumber", controller.findOne);
  router.patch("/:taskNumber", controller.update);
  router.delete("/:taskNumber", controller.delete);

  return router;
}