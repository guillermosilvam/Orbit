import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  type Relation,
} from "typeorm";
import type { TaskStatus } from "@orbit/shared/schemas/task.schema";
import { User } from "./user.entity.ts";
import { Workspace } from "./workspace.entity.ts";

export type StoredActivityType =
  | "workspace_created"
  | "project_created"
  | "task_created"
  | "task_status_changed";

@Entity("activities")
@Index("IDX_activities_workspace_created_at", ["workspaceId", "createdAt"])
export class Activity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ name: "workspace_id", type: "uuid" })
  workspaceId!: string;

  @ManyToOne(() => Workspace, { onDelete: "CASCADE" })
  @JoinColumn({ name: "workspace_id" })
  workspace!: Relation<Workspace>;

  @Column({ name: "actor_id", type: "uuid", nullable: true })
  actorId!: string | null;

  @ManyToOne(() => User, { onDelete: "SET NULL", nullable: true })
  @JoinColumn({ name: "actor_id" })
  actor!: Relation<User> | null;

  @Column({ type: "varchar", length: 30 })
  type!: StoredActivityType;

  @Column({ name: "project_key", type: "varchar", length: 5, nullable: true })
  projectKey!: string | null;

  @Column({ name: "project_name", type: "varchar", length: 100, nullable: true })
  projectName!: string | null;

  @Column({
    name: "task_identifier",
    type: "varchar",
    length: 32,
    nullable: true,
  })
  taskIdentifier!: string | null;

  @Column({ name: "task_title", type: "varchar", length: 200, nullable: true })
  taskTitle!: string | null;

  @Column({
    name: "previous_status",
    type: "varchar",
    length: 20,
    nullable: true,
  })
  previousStatus!: TaskStatus | null;

  @Column({ name: "new_status", type: "varchar", length: 20, nullable: true })
  newStatus!: TaskStatus | null;

  @CreateDateColumn({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;
}
