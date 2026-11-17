import { AppError } from '../../errors/app-error';
import { createWorkspaceSchema, toWorkspaceResponseDto, updateMemberRoleSchema } from './dto/workspace.dto';
import type { WorkspaceService } from './workspace.service';
import type { Request, Response } from 'express'

export class WorkspaceController {
    constructor(private readonly workspaceService: WorkspaceService) { }

    create = async (req: Request, res: Response): Promise<void> => {
        if (!req.user) throw AppError.unauthorized();
        const input = createWorkspaceSchema.parse(req.body)
        const workspace = await this.workspaceService.create(input, req.user.id)
        res.status(201).json({ workspace })
    }

    findAll = async (req: Request, res: Response): Promise<void> => {
        if (!req.user) throw AppError.unauthorized()
        const workspaces = await this.workspaceService.findAllForUser(req.user.id)
        res.json({ workspaces })
    }

    findOne = async (req: Request, res: Response): Promise<void> => {
        if (!req.workspace || !req.member) throw AppError.unauthorized()
        res.json({
            workspace: {
                ...toWorkspaceResponseDto(req.workspace),
                role: req.member.role,
            },
        });
    }

    delete = async (req: Request, res: Response): Promise<void> => {
        if (!req.workspace) throw AppError.unauthorized();
        await this.workspaceService.delete(req.workspace.id);
        res.status(204).send();
    };

    // -- USER MANAGEMENT ----------------------------------------------------
    listMembers = async (req: Request, res: Response): Promise<void> => {
        if (!req.workspace) throw AppError.unauthorized();
        const members = await this.workspaceService.listMembers(req.workspace.id);
        res.json({ members });
    };

    removeMember = async (req: Request, res: Response): Promise<void> => {
        if (!req.workspace || !req.member) throw AppError.unauthorized();
        const { userId } = req.params;
        if (typeof userId !== "string") throw AppError.notFound("Member not found");
        await this.workspaceService.removeMember(
            req.workspace.id,
            userId,
            req.member.userId,
        );
        res.status(204).send();
    };

    leave = async (req: Request, res: Response): Promise<void> => {
        if (!req.workspace || !req.member) throw AppError.unauthorized();
        await this.workspaceService.leaveWorkspace(req.workspace.id, req.member.userId);
        res.status(204).send();
    };

    updateMemberRole = async (req: Request, res: Response): Promise<void> => {
        if (!req.workspace || !req.member) throw AppError.unauthorized();
        const { userId } = req.params;
        if (typeof userId !== "string") throw AppError.notFound("Member not found");
        const input = updateMemberRoleSchema.parse(req.body);
        const member = await this.workspaceService.updateMemberRole(
            req.workspace.id,
            userId,
            input.role,
            req.member.userId,
        );
        res.json({ member });
    };
}