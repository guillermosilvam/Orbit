import "reflect-metadata";
import { createApp } from "./app.ts"
import { env } from "./config/env.ts";
import { AppDataSource } from "./config/data-source.ts";


const main = async (): Promise<void> => {
  await AppDataSource.initialize();
  console.log("🟢 PostgreSQL connected");

  const app = createApp(AppDataSource);
  const server = app.listen(env.PORT, () => {
    console.log(`🚀 API on http://localhost:${env.PORT}`);
  });

  const shutdown = async (signal: string) => {
    console.log(`Closing...`);
    server.close();
    await AppDataSource.destroy();
    process.exit(0);
  };
  process.on("SIGINT", () => void shutdown("SIGINT"));
  process.on("SIGTERM", () => void shutdown("SIGTERM"));
};

main().catch((err) => {
  console.error("💥 Error:", err);
  process.exit(1);
});