// routes/register.tsx
import { createFileRoute, redirect } from "@tanstack/react-router";
import { RegisterPage } from "../features/auth/pages/RegisterPage";
import { meQueryOptions } from "../features/auth/api/me-query";

export const Route = createFileRoute("/register")({
  beforeLoad: async ({ context }) => {
    const user = await context.queryClient.query(meQueryOptions);
    if (user) throw redirect({ to: "/" });
  },
  component: RegisterPage,
});
