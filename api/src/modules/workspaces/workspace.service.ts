import type { EntityManager, Repository } from "typeorm";
import { Workspace } from "../../entities/workspace.entity";
import { WorkspaceMember } from "../../entities/workspace-member.entity";
import type { DataSource } from "typeorm/browser";
import { 
    toWorkspaceResponseDto,
    toWorkspaceMemberResponseDto,
    type CreateWorkspaceInputDto, 
    type WorkspaceResponseDto, 
    type WorkspaceWithRoleDto,
    type UpdateMemberRoleInputDto,
    type WorkspaceMemberResponseDto
} from "./dto/workspace.dto";
import { AppError } from "../../errors/app-error";



export class WorkspaceService {
    private readonly workspaceRepo: Repository<Workspace>
    private readonly memberRepo: Repository<WorkspaceMember>

    constructor(private readonly dataSource: DataSource) {
        this.workspaceRepo = dataSource.getRepository(Workspace)
        this.memberRepo = dataSource.getRepository(WorkspaceMember)
    }

    async create(input: CreateWorkspaceInputDto, ownerId: string): Promise<WorkspaceResponseDto> {
        return this.dataSource.transaction(async (manager) => {
            const slug = await this.generateUniqueSlug(input.name, manager)

            const workspace = manager.create(Workspace, {
                name: input.name,
                slug,
                ownerId
            })
            await manager.save(workspace)

            const membership = manager.create(WorkspaceMember, {
                workspaceId: workspace.id,
                userId: ownerId,
                role: "owner"
            })
            await manager.save(membership);

            return toWorkspaceResponseDto(workspace)
        })
    }

    async findAllForUser(userId: string): Promise<WorkspaceWithRoleDto[]> {
        const memberships = await this.memberRepo.find({
            where: { userId },
            relations: { workspace: true },
            order: { createdAt: "ASC" }
        });

        return memberships.map((m) => ({
            ...toWorkspaceResponseDto(m.workspace),
            role: m.role
        }))
    }

    async findBySlugForUser(slug: string, userId: string): Promise<WorkspaceWithRoleDto> {
        const workspace = await this.workspaceRepo.findOne({ where: { slug } })
        if (!workspace) throw AppError.notFound("Workspace not found")

        const membership = await this.memberRepo.findOne({
            where: { workspaceId: workspace.id, userId }
        })
        if (!membership) throw AppError.notFound("Workspace not found")

        return { ...toWorkspaceResponseDto(workspace), role: membership.role }
    }

    async delete(workspaceId: string): Promise<void> {
        await this.workspaceRepo.delete({ id: workspaceId });
    }


    async resolveMembership(
        slug: string, userId: string
    ): Promise<{ workspace: Workspace; member: WorkspaceMember }> {
        const workspace = await this.workspaceRepo.findOne({ where: { slug } });
        if (!workspace) throw AppError.notFound("Workspace not found");

        const member = await this.memberRepo.findOne({
            where: { workspaceId: workspace.id, userId },
        });
        if (!member) throw AppError.notFound("Workspace not found");

        return { workspace, member };
    }


    // -- USER MANAGEMENT -------------------------------------------
    async listMembers(workspaceId: string): Promise<WorkspaceMemberResponseDto[]> {
        const members = await this.memberRepo.find({
            where: { workspaceId },
            relations: { user: true },
            order: { createdAt: "ASC" },
        });
        return members.map(toWorkspaceMemberResponseDto);
    }

    async removeMember(
        workspaceId: string,
        targetUserId: string,
        actorId: string,
    ): Promise<void> {
        const target = await this.memberRepo.findOne({
            where: { workspaceId, userId: targetUserId },
        });
        if (!target) throw AppError.notFound("Member not found");

        if (target.role === "owner") {
            throw AppError.forbidden("You cannot remove the workspace owner");
        }
        if (targetUserId === actorId) {
            throw AppError.forbidden("Use “Exit workspace” to leave it");
        }

        await this.memberRepo.delete({ id: target.id });
    }

    async leaveWorkspace(workspaceId: string, userId: string): Promise<void> {
        const member = await this.memberRepo.findOne({
            where: { workspaceId, userId },
        });
        if (!member) throw AppError.notFound("You are not a member of this workspace");

        if (member.role === "owner") {
            throw AppError.forbidden(
                "The owner cannot leave without transferring ownership of the workspace",
            );
        }

        await this.memberRepo.delete({ id: member.id });
    }

    async updateMemberRole(
        workspaceId: string,
        targetUserId: string,
        newRole: UpdateMemberRoleInputDto["role"],
        actorId: string,
    ): Promise<WorkspaceMemberResponseDto> {
        const target = await this.memberRepo.findOne({
            where: { workspaceId, userId: targetUserId },
            relations: { user: true },
        });
        if (!target) throw AppError.notFound("Member not found");

        if (target.role === "owner") {
            throw AppError.forbidden("You can not change the owner's role");
        }
        if (targetUserId === actorId) {
            throw AppError.forbidden("You can not change your own role");
        }

        target.role = newRole;
        await this.memberRepo.save(target);
        return toWorkspaceMemberResponseDto(target);
    }



    private async generateUniqueSlug(name: string, manager: EntityManager): Promise<string> {
        const base = slugify(name);
        let candidate = base;
        let counter = 2;

        while (await manager.exists(Workspace, { where: { slug: candidate } })) {
            candidate = `${base}-${counter}`
            counter++
        }
        return candidate
    }

}
function slugify(name: string): string {
    return name
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
}