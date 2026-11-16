import type { DataSource, Repository } from "typeorm";
import { Invitation } from "../../entities/invitation.entity.ts";
import { Workspace } from "../../entities/workspace.entity.ts";
import { WorkspaceMember } from "../../entities/workspace-member.entity.ts";
import { AppError } from "../../errors/app-error.ts";
import type {
    CreateInvitationInputDto,
    CreatedInvitationDto,
    InvitationListItemDto,
    InvitationPreviewDto,
} from "./dto/invitation.dto.ts";
import { toInvitationListItemDto } from "./dto/invitation.dto.ts";
import { User } from "../../entities/user.entity.ts";

const DEFAULT_TTL_HOURS = 24 * 7;


export class InvitationService {
    private readonly inviteRepo: Repository<Invitation>;
    private readonly workspaceRepo: Repository<Workspace>;
    private readonly memberRepo: Repository<WorkspaceMember>;

    constructor(private readonly dataSource: DataSource) {
        this.inviteRepo = dataSource.getRepository(Invitation);
        this.workspaceRepo = dataSource.getRepository(Workspace);
        this.memberRepo = dataSource.getRepository(WorkspaceMember);
    }


    async create(
        workspaceId: string,
        createdById: string,
        input: CreateInvitationInputDto,
    ): Promise<CreatedInvitationDto> {

        if (input.email) {
            const existingUser = await this.dataSource.getRepository(User).findOne({
                where: { email: input.email },
            });
            if (existingUser) {
                const isMember = await this.memberRepo.findOne({
                    where: { workspaceId, userId: existingUser.id },
                });
                if (isMember) throw AppError.conflict("This email is already a member of the workspace");
            }
        }

        if (input.email) {
            await this.inviteRepo
                .createQueryBuilder()
                .delete()
                .from(Invitation)
                .where("workspace_id = :workspaceId", { workspaceId })
                .andWhere("email = :email", { email: input.email })
                .andWhere("accepted_at IS NULL")
                .execute();
        }

        const token = Bun.randomUUIDv7();
        const ttlHours = input.expiresInHours ?? DEFAULT_TTL_HOURS;
        const expiresAt = new Date(Date.now() + ttlHours * 60 * 60 * 1000);

        const invitation = this.inviteRepo.create({
            workspaceId,
            tokenHash: sha256(token),
            role: input.role,
            email: input.email ?? null,
            createdById,
            expiresAt,
        });
        await this.inviteRepo.save(invitation);

        return {
            id: invitation.id,
            url: `/invitations/${token}`, // el front compone la URL absoluta
            role: invitation.role,
            email: invitation.email,
            expiresAt: invitation.expiresAt.toISOString(),
        };
    }

    async preview(token: string): Promise<InvitationPreviewDto> {
        const invitation = await this.findValidByToken(token);
        const workspace = await this.workspaceRepo.findOneOrFail({
            where: { id: invitation.workspaceId },
        });

        return {
            workspaceName: workspace.name,
            workspaceSlug: workspace.slug,
            role: invitation.role,
            email: invitation.email,
            expiresAt: invitation.expiresAt.toISOString(),
        };
    }


    async accept(
        token: string,
        userId: string,
        userEmail: string,
    ): Promise<{ workspaceSlug: string }> {
        return this.dataSource.transaction(async (manager) => {
            const invitation = await manager.findOne(Invitation, {
                where: { tokenHash: sha256(token) },
                lock: { mode: "pessimistic_write" },
            });

            if (!invitation) throw AppError.notFound("Invitación inválida");
            if (invitation.acceptedAt) throw AppError.conflict("Invitación ya usada");
            if (invitation.expiresAt < new Date()) {
                throw AppError.conflict("Invitación expirada");
            }
            if (invitation.email && invitation.email !== userEmail) {
                throw AppError.forbidden("Esta invitación es para otro email");
            }

            const workspace = await manager.findOneOrFail(Workspace, {
                where: { id: invitation.workspaceId },
            });

            const existing = await manager.findOne(WorkspaceMember, {
                where: { workspaceId: invitation.workspaceId, userId },
            });
            if (!existing) {
                await manager.save(
                    manager.create(WorkspaceMember, {
                        workspaceId: invitation.workspaceId,
                        userId,
                        role: invitation.role,
                    }),
                );
            }

            invitation.acceptedAt = new Date();
            await manager.save(invitation);

            return { workspaceSlug: workspace.slug };
        });
    }

    async listPending(workspaceId: string): Promise<InvitationListItemDto[]> {
        const invitations = await this.inviteRepo
            .createQueryBuilder("i")
            .where("i.workspace_id = :workspaceId", { workspaceId })
            .andWhere("i.accepted_at IS NULL")
            .andWhere("i.expires_at > NOW()")
            .orderBy("i.created_at", "DESC")
            .getMany();

        return invitations.map(toInvitationListItemDto);
    }

    async revoke(workspaceId: string, invitationId: string): Promise<void> {
        const result = await this.inviteRepo.delete({
            id: invitationId,
            workspaceId,
        });
        if (!result.affected) throw AppError.notFound("Invitation not found");
    }

    private async findValidByToken(token: string): Promise<Invitation> {
        const invitation = await this.inviteRepo.findOne({
            where: { tokenHash: sha256(token) },
        });
        if (!invitation) throw AppError.notFound("Invalid invitation");
        if (invitation.acceptedAt) throw AppError.conflict("Invitation already used");
        if (invitation.expiresAt < new Date()) {
            throw AppError.conflict("Expired invitation");
        }
        return invitation;
    }
}

function sha256(value: string): string {
    const h = new Bun.CryptoHasher("sha256");
    h.update(value);
    return h.digest("hex");
}