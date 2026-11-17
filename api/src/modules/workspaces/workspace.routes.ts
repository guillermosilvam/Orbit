import { Router, type RequestHandler } from "express";
import type { WorkspaceController } from "./workspace.controller";

export function createWorkspaceRouter(
    controller: WorkspaceController,
    requireAuth: RequestHandler,
    requireWorkspaceMember: RequestHandler,
    requireWorkspaceAdmin: RequestHandler,
    requireWorkspaceOwner: RequestHandler,
): Router {
    const router = Router()

    router.use(requireAuth)
    router.post("/", controller.create);
    router.get("/", controller.findAll);
    // -- USER MANAGEMENT IN WORKSPACES -----------------------------------------
    router.get("/:workspaceSlug/members", requireWorkspaceMember, controller.listMembers);
    router.delete("/:workspaceSlug/members/:userId", requireWorkspaceAdmin, controller.removeMember);
    router.patch("/:workspaceSlug/members/:userId", requireWorkspaceAdmin, controller.updateMemberRole);
    router.post("/:workspaceSlug/leave", requireWorkspaceMember, controller.leave);
    // --------------------------------------------------------------------------
    router.get("/:workspaceSlug", requireWorkspaceMember, controller.findOne);
    router.delete("/:workspaceSlug", requireWorkspaceOwner, controller.delete);

    return router
}