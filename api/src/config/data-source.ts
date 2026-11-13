import "reflect-metadata";
import { DataSource } from "typeorm";
import { env } from "./env.ts";
import { User } from "../entities/user.entity.ts";
import { Session } from "../entities/session.entity.ts";


export const AppDataSource = new DataSource({
  type: "postgres",
  url: env.DATABASE_URL,
  entities: [User, Session],
  migrations: ["src/migrations/**/*.ts"],
  synchronize: false,
});