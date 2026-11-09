import "reflect-metadata";
import { DataSource } from "typeorm";
import { env } from "./env.ts";
import { User } from "../entities/user.entity.ts";
import { AuthSession } from "../entities/auth-session.entity.ts";


export const AppDataSource = new DataSource({
  type: "postgres",
  url: env.DATABASE_URL,
  entities: [User, AuthSession],
  migrations: ["src/migrations/**/*.ts"],
  synchronize: false,
});