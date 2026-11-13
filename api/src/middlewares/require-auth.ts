import type { RequestHandler } from "express";
import { AuthService } from "../modules/auth/auth.service"
import { SESSION_COOKIE } from "../modules/auth/auth.constants";
import { AppError } from "../errors/app-error";

export function createRequireAuth(authService: AuthService): RequestHandler {
    return async (req, _parse, next) => {
        const token = req.cookies?.[SESSION_COOKIE] as string | undefined;
        if (!token) return next(AppError.unauthorized("Not authenticated"))

        const user = await authService.validateSession(token);
        if (!user) return next(AppError.unauthorized("Session expired or invalid"))

        req.user = user;
        next()
    }
}