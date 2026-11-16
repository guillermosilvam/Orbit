import { Router, type RequestHandler } from "express";
import { InvitationController } from "./invitation.controller.ts";

export function createInvitationRouter(
    controller: InvitationController,
    requireWorkspaceAdmin: RequestHandler,
): Router {
    const router = Router({ mergeParams: true });
    router.use(requireWorkspaceAdmin);

    router.post("/", controller.create);
    router.get("/", controller.listPending);
    router.delete("/:invitationId", controller.revoke);
    return router;
}