import { createFileRoute, redirect, Outlet } from "@tanstack/react-router";
import { meQueryOptions } from "../features/auth/api/me-query";
import { AppShell } from "../app/AppShell";

export const Route = createFileRoute("/_authenticated")({
  beforeLoad: async ({ context, location }) => {
    const user = await context.queryClient.query(meQueryOptions);
    if (!user) {
      throw redirect({
        to: "/login",
        search: { redirect: location.href },
      });
    }
    return { auth: { user } };
  },
  component: () => (
    <AppShell>
      <Outlet />
    </AppShell>
  ),
});
