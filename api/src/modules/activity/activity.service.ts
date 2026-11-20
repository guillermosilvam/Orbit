import type { DataSource, EntityManager } from "typeorm";
import type { ActivityItemDto } from "@orbit/shared/types";
import { WorkspaceMember } from "../../entities/workspace-member.entity.ts";
import { Activity, type StoredActivityType } from "../../entities/activity.entity.ts";

type RecordActivityInput = {
  workspaceId: string;
  actorId: string;
  type: StoredActivityType;
  projectKey?: string | null;
  projectName?: string | null;
  taskIdentifier?: string | null;
  taskTitle?: string | null;
  previousStatus?: Activity["previousStatus"];
  newStatus?: Activity["newStatus"];
};

export async function recordActivity(
  manager: EntityManager,
  input: RecordActivityInput,
): Promise<void> {
  const activity = manager.create(Activity, {
    workspaceId: input.workspaceId,
    actorId: input.actorId,
    type: input.type,
    projectKey: input.projectKey ?? null,
    projectName: input.projectName ?? null,
    taskIdentifier: input.taskIdentifier ?? null,
    taskTitle: input.taskTitle ?? null,
    previousStatus: input.previousStatus ?? null,
    newStatus: input.newStatus ?? null,
  });
  await manager.save(activity);
}

export class ActivityService {
  constructor(private readonly dataSource: DataSource) {}

  async listForWorkspace(
    workspaceId: string,
    limit: number,
  ): Promise<ActivityItemDto[]> {
    const memberRepo = this.dataSource.getRepository(WorkspaceMember);
    const [storedActivities, joinedMemberships] = await Promise.all([
      this.dataSource.getRepository(Activity).find({
        where: { workspaceId },
        relations: { workspace: true, actor: true },
        order: { createdAt: "DESC" },
        take: limit,
      }),
      memberRepo
        .createQueryBuilder("membership")
        .leftJoinAndSelect("membership.user", "user")
        .leftJoinAndSelect("membership.workspace", "workspace")
        .where("membership.workspace_id = :workspaceId", { workspaceId })
        .andWhere("membership.user_id <> workspace.owner_id")
        .orderBy("membership.created_at", "DESC")
        .take(limit)
        .getMany(),
    ]);

    const activities: ActivityItemDto[] = [
      ...storedActivities.map((activity) => ({
        id: activity.id,
        type: activity.type,
        actorName: activity.actor?.name ?? "Alguien",
        workspaceSlug: activity.workspace.slug,
        workspaceName: activity.workspace.name,
        projectKey: activity.projectKey,
        projectName: activity.projectName,
        taskIdentifier: activity.taskIdentifier,
        taskTitle: activity.taskTitle,
        previousStatus: activity.previousStatus,
        newStatus: activity.newStatus,
        createdAt: activity.createdAt.toISOString(),
      })),
      ...joinedMemberships.map((membership) => ({
        id: `member-${membership.id}`,
        type: "member_joined" as const,
        actorName: membership.user.name,
        workspaceSlug: membership.workspace.slug,
        workspaceName: membership.workspace.name,
        projectKey: null,
        projectName: null,
        taskIdentifier: null,
        taskTitle: null,
        previousStatus: null,
        newStatus: null,
        createdAt: membership.createdAt.toISOString(),
      })),
    ];

    return activities
      .sort(
        (left, right) =>
          new Date(right.createdAt).getTime() -
          new Date(left.createdAt).getTime(),
      )
      .slice(0, limit);
  }
}
