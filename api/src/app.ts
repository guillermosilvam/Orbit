import cookieParser from 'cookie-parser';
import express from 'express'
import type { DataSource } from 'typeorm';
import { AuthService } from "./modules/auth/auth.service.ts";
import { AuthController } from "./modules/auth/auth.controller.ts";
import { createAuthRouter } from "./modules/auth/auth.routes.ts";
import { errorHandler } from "./middlewares/error-handler.ts";

export const createApp = (dataSource: DataSource) => {
    const app = express()

    app.use(express.json());
    app.use(cookieParser())

    app.get("/health", (_req, res) => {
        res.json({ status: "ok", uptime: process.uptime() })
    })

    // ── Composición por feature ──
    const authService = new AuthService(dataSource);
    const authController = new AuthController(authService);
    app.use("/auth", createAuthRouter(authController));

    app.use(errorHandler)

    return app
}


