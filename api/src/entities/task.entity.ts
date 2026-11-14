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
import { Project } from "./project.entity.ts";
import { User } from "./user.entity.ts";

export type TaskStatus = "todo" | "in_progress" | "done";
export type TaskPriority = "low" | "medium" | "high" | "urgent";


@Entity("tasks")
@Index(["projectId", "number"], { unique: true })
export class Task {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ name: "project_id", type: "uuid" })
  projectId!: string;

  @ManyToOne(() => Project, { onDelete: "CASCADE" })
  @JoinColumn({ name: "project_id" })
  project!: Relation<Project>;

  @Column({ type: "int" })
  number!: number;

  @Column({ type: "varchar", length: 200 })
  title!: string;

  @Column({ type: "text", nullable: true })
  description!: string | null;

  @Column({ type: "varchar", length: 20, default: "todo" })
  status!: TaskStatus;

  @Column({ type: "varchar", length: 20, default: "medium" })
  priority!: TaskPriority;

  /** Orden dentro de la columna del kanban. Gap de 1000. */
  @Column({ type: "numeric", precision: 20, scale: 10, default: 1000 })
  position!: string; // TypeORM devuelve numeric como string

  @Column({ name: "assignee_id", type: "uuid", nullable: true })
  assigneeId!: string | null;

  @ManyToOne(() => User, { onDelete: "SET NULL", nullable: true })
  @JoinColumn({ name: "assignee_id" })
  assignee!: Relation<User> | null;

  @Column({ name: "due_date", type: "timestamptz", nullable: true })
  dueDate!: Date | null;

  @CreateDateColumn({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamptz" })
  updatedAt!: Date;
}