import "reflect-metadata";
import { DataSource } from "typeorm";
import { env } from "./env.ts";
import { User } from "../entities/user.entity.ts";
import { Session } from "../entities/session.entity.ts";
import { Workspace } from "../entities/workspace.entity.ts";
import { WorkspaceMember } from "../entities/workspace-member.entity.ts";


export const AppDataSource = new DataSource({
  type: "postgres",
  url: env.DATABASE_URL,
  entities: [User, Session, Workspace, WorkspaceMember],
  migrations: ["src/migrations/**/*.ts"],
  synchronize: false,
});