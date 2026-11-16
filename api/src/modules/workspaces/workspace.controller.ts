import { AppError } from '../../errors/app-error';
import { createWorkspaceSchema, toWorkspaceResponseDto } from './dto/workspace.dto';
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
}