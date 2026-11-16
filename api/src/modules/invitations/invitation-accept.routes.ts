import { Router, type RequestHandler } from "express";
import { InvitationAcceptController } from "./invitation-accept.controller.ts";

export function createInvitationAcceptRouter(
    controller: InvitationAcceptController,
    requireAuth: RequestHandler,
): Router {
    const router = Router();
    router.use(requireAuth);
    router.get("/:token", controller.preview);
    router.post("/:token/accept", controller.accept);
    return router;
}