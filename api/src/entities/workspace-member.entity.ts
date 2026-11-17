import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  type Relation
} from "typeorm";
import { Workspace } from "./workspace.entity";
import { User } from "./user.entity";
import type { WorkspaceRole } from "@orbit/shared/schemas/workspace.schema";
export type { WorkspaceRole };

@Entity("workspace_members")
@Index(["workspaceId", "userId"], { unique: true })
export class WorkspaceMember {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ name: "workspace_id", type: "uuid" })
  workspaceId!: string;

  @ManyToOne(() => Workspace, (w) => w.members, { onDelete: "CASCADE" })
  @JoinColumn({ name: "workspace_id" })
  workspace!: Relation<Workspace>;

  @Column({ name: "user_id", type: "uuid" })
  userId!: string;

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  @JoinColumn({ name: "user_id" })
  user!: User;

  @Column({ type: "varchar", length: 20 })
  role!: WorkspaceRole;

  @CreateDateColumn({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;
}