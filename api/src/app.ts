import cookieParser from 'cookie-parser';
import express from 'express'
import type { DataSource } from 'typeorm';

import { errorHandler } from "./middlewares/error-handler.ts";
import { requestLogger } from './middlewares/request-logger.ts';
import { createRequireAuth } from './middlewares/require-auth.ts';

import { AuthService } from "./modules/auth/auth.service.ts";
import { AuthController } from "./modules/auth/auth.controller.ts";
import { createAuthRouter } from "./modules/auth/auth.routes.ts";

import { WorkspaceService } from "./modules/workspaces/workspace.service.ts";
import { WorkspaceController } from "./modules/workspaces/workspace.controller.ts";
import { createWorkspaceRouter } from "./modules/workspaces/workspace.routes.ts";

import { ProjectService } from "./modules/projects/project.service.ts";
import { ProjectController } from "./modules/projects/project.controller.ts";
import { createProjectRouter } from "./modules/projects/project.routes.ts";
import { requireWorkspaceRole } from "./middlewares/require-workspace-role.ts";

export const createApp = (dataSource: DataSource) => {
    const app = express()

    app.use(express.json());
    app.use(cookieParser());
    app.use(requestLogger);


    const workspaceService = new WorkspaceService(dataSource);

    // -- MIDDLEWARES ---------------------------------------
    const requireWorkspaceMember = requireWorkspaceRole(workspaceService);
    const requireWorkspaceAdmin = requireWorkspaceRole(workspaceService, "owner", "admin");
    const requireWorkspaceOwner = requireWorkspaceRole(workspaceService, "owner");

    // -- SHARED --------------------------------------------
    const authService = new AuthService(dataSource);
    const requireAuth = createRequireAuth(authService)


    // -- AUTH ----------------------------------------------
    const authController = new AuthController(authService);
    app.use("/auth", createAuthRouter(authController, requireAuth));


    // -- PROJECTS ------------------------------------------
    const projectService = new ProjectService(dataSource);
    const projectController = new ProjectController(projectService);
    app.use(
        "/workspaces/:workspaceSlug/projects",
        requireAuth,
        createProjectRouter(projectController, requireWorkspaceAdmin, requireWorkspaceMember),
    );

    // -- WORKSPACE -----------------------------------------
    const workspaceController = new WorkspaceController(workspaceService);
    app.use(
        "/workspaces",
        createWorkspaceRouter(
            workspaceController,
            requireAuth,
            requireWorkspaceMember,
            requireWorkspaceOwner,
        ),
    );


    app.use(errorHandler)

    return app
}


