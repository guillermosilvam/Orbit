import type { EntityManager, Repository } from "typeorm";
import { Workspace } from "../../entities/workspace.entity";
import { WorkspaceMember } from "../../entities/workspace-member.entity";
import type { DataSource } from "typeorm/browser";
import { toWorkspaceResponseDto, type CreateWorkspaceInputDto, type WorkspaceResponseDto, type WorkspaceWithRoleDto } from "./dto/workspace.dto";
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