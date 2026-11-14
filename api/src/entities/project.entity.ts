import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  type Relation,
} from "typeorm";
import { Workspace } from "./workspace.entity.ts";


@Entity("projects")
@Index(["workspaceId", "key"], { unique: true })
export class Project {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ name: "workspace_id", type: "uuid" })
  workspaceId!: string;

  @ManyToOne(() => Workspace, { onDelete: "CASCADE" })
  @JoinColumn({ name: "workspace_id" })
  workspace!: Relation<Workspace>;

  @Column({ type: "varchar", length: 100 })
  name!: string;

  @Column({ type: "varchar", length: 5 })
  key!: string;

  @Column({ type: "text", nullable: true })
  description!: string | null;

  @Column({ name: "task_counter", type: "int", default: 0 })
  taskCounter!: number;

  @CreateDateColumn({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamptz" })
  updatedAt!: Date;
}