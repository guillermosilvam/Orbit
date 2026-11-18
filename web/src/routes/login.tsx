// routes/login.tsx
import { createFileRoute, redirect } from "@tanstack/react-router";
import { LoginPage } from "../features/auth/pages/LoginPage";
import { meQueryOptions } from "../features/auth/api/me-query";

export const Route = createFileRoute("/login")({
  beforeLoad: async ({ context }) => {
    const user = await context.queryClient.query(meQueryOptions);
    if (user) throw redirect({ to: "/" });
  },
  component: LoginPage,
});
