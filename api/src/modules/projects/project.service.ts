import type { DataSource, Repository } from "typeorm";
import { Project } from "../../entities/project.entity";
import { toProjectResponseDto, type CreateProjectInputDto, type ProjectResponseDto, type UpdateProjectInputDto } from "./dto/project.dto";
import { AppError } from "../../errors/app-error";

export class ProjectService {
    private readonly projectRepo: Repository<Project>

    constructor(private readonly dataSource: DataSource) {
        this.projectRepo = dataSource.getRepository(Project)
    }

    async create(workspaceId: string, input: CreateProjectInputDto): Promise<ProjectResponseDto> {
        const existing = await this.projectRepo.findOne({
            where: { workspaceId, key: input.key },
        })

        if (existing) {
            throw AppError.conflict(`There is already a project with the key “${input.key}” in this workspace`)
        }

        const project = this.projectRepo.create({
            workspaceId,
            name: input.name,
            key: input.key,
            description: input.description ?? null
        })
        await this.projectRepo.save(project);
        return toProjectResponseDto(project)
    }

    async listByWorkspace(workspaceId: string): Promise<ProjectResponseDto[]> {
        const projects = await this.projectRepo.find({
            where: { workspaceId },
            order: { createdAt: "ASC" }
        })
        return projects.map(toProjectResponseDto)
    }

    async findByKey(workspaceId: string, key: string): Promise<ProjectResponseDto> {
        const project = await this.projectRepo.findOne({
            where: { workspaceId, key: key.toUpperCase() }
        })
        if (!project) throw AppError.notFound('Project not found')
        return toProjectResponseDto(project)
    }

    async update(
        workspaceId: string,
        key: string,
        input: UpdateProjectInputDto
    ): Promise<ProjectResponseDto> {
        const project = await this.projectRepo.findOne({
            where: { workspaceId, key: key.toUpperCase() },
        });
        if (!project) throw AppError.notFound("Project not found");

        if (input.name !== undefined) project.name = input.name;
        if (input.description !== undefined) project.description = input.description;

        await this.projectRepo.save(project);
        return toProjectResponseDto(project);
    }

    async delete(workspaceId: string, key: string): Promise<void> {
        const project = await this.projectRepo.findOne({
            where: { workspaceId, key: key.toUpperCase() },
        });
        if (!project) throw AppError.notFound("Project not found");

        await this.projectRepo.delete({ id: project.id });
    }

}