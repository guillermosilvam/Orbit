import type { Request, Response } from "express";
import type { InvitationService } from "./invitation.service.ts";
import { AppError } from "../../errors/app-error.ts";

export class InvitationAcceptController {
    constructor(private readonly invitationService: InvitationService) { }

    preview = async (req: Request, res: Response): Promise<void> => {
        const token = req.params.token;
        if (typeof token !== "string") throw AppError.notFound("Invalid invitation");
        const preview = await this.invitationService.preview(token);
        res.json({ invitation: preview });
    };

    accept = async (req: Request, res: Response): Promise<void> => {
        if (!req.user) throw AppError.unauthorized();
        const token = req.params.token;
        if (typeof token !== "string") throw AppError.notFound("Invalid invitation");
        const result = await this.invitationService.accept(
            token,
            req.user.id,
            req.user.email,
        );
        res.json({ workspaceSlug: result.workspaceSlug });
    };
}