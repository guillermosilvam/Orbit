import { createApp } from "./app.ts"

const port = Number(process.env.PORT ?? 3000)

const app = createApp()

const server = app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
})

const shutdown = (signal: string) => {
  console.log(`closing...`);
  server.close(() => process.exit(0));
};
process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));