import type { Request, Response } from "express";
import type { AuthService } from "./auth.service.ts";
import { SESSION_COOKIE, SESSION_TTL_MS } from "./auth.constants.ts";
import { loginSchema, registerSchema, toUserResponseDto } from "./dto/auth.dto.ts";


const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: SESSION_TTL_MS,
};

export class AuthController {
    constructor(private readonly authService: AuthService) { }

    register = async (req: Request, res: Response): Promise<void> => {
        const input = registerSchema.parse(req.body)
        const { user, sessionToken } = await this.authService.register(input)
        res.cookie(SESSION_COOKIE, sessionToken, cookieOptions)
        res.status(201).json({ user })
    };

    login = async (req: Request, res: Response): Promise<void> => {
        const input = loginSchema.parse(req.body)
        const { user, sessionToken } = await this.authService.login(input)
        res.cookie(SESSION_COOKIE, sessionToken, cookieOptions);
        res.json({ user });
    };

    logout = async (req: Request, res: Response): Promise<void> => {
        const token = req.cookies[SESSION_COOKIE] as string | undefined;
        if (token) await this.authService.logout(token);
        res.clearCookie(SESSION_COOKIE, { ...cookieOptions, maxAge: undefined });
        res.status(204).send();
    };

    me = async (req: Request, res: Response): Promise<void> => {
        res.json({ user: toUserResponseDto(req.user!) })
    }
}