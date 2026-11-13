import { Router, type RequestHandler } from "express";
import { AuthController } from "./auth.controller";

export function createAuthRouter(
    controller: AuthController,
    requireAuth: RequestHandler,
): Router {
    const router = Router();
    router.post("/register", controller.register);
    router.post("/login", controller.login);
    router.post("/logout", controller.logout);
    router.get("/me", requireAuth, controller.me)
    return router
}