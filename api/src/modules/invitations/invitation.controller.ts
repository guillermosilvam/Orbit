import type { Request, Response } from "express";
import type { InvitationService } from "./invitation.service.ts";
import { AppError } from "../../errors/app-error.ts";
import { createInvitationSchema } from "./dto/invitation.dto.ts";

export class InvitationController {
    constructor(private readonly invitationService: InvitationService) { }

    create = async (req: Request, res: Response): Promise<void> => {
        if (!req.workspace || !req.user) throw AppError.unauthorized();
        const input = createInvitationSchema.parse(req.body);
        const invitation = await this.invitationService.create(
            req.workspace.id,
            req.user.id,
            input,
        );
        res.status(201).json({ invitation });
    };

    listPending = async (req: Request, res: Response): Promise<void> => {
        if (!req.workspace) throw AppError.unauthorized();
        const invitations = await this.invitationService.listPending(req.workspace.id);
        res.json({ invitations });
    };

    revoke = async (req: Request, res: Response): Promise<void> => {
        if (!req.workspace) throw AppError.unauthorized();
        const id = req.params.invitationId;
        if (typeof id !== "string") throw AppError.notFound("Invitation not found");
        await this.invitationService.revoke(req.workspace.id, id);
        res.status(204).send();
    };
}