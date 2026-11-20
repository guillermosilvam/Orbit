import { Router } from "express";
import type { ActivityController } from "./activity.controller.ts";

export function createActivityRouter(controller: ActivityController): Router {
  const router = Router();
  router.get("/", controller.list);
  return router;
}
