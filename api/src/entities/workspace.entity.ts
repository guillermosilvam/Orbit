import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { User } from "./user.entity.ts";
import { WorkspaceMember } from "./workspace-member.entity.ts"


@Entity("workspaces")
export class Workspace {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "varchar", length: 100 })
  name!: string;

  @Index({ unique: true })
  @Column({ type: "varchar", length: 100 })
  slug!: string;

  @Column({ name: "owner_id", type: "uuid" })
  ownerId!: string;

  @ManyToOne(() => User, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "owner_id" })
  owner!: User;

  @OneToMany(() => WorkspaceMember, (m) => m.workspace)
  members!: WorkspaceMember[];

  @CreateDateColumn({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamptz" })
  updatedAt!: Date;
}