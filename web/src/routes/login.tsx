import { createFileRoute, redirect } from "@tanstack/react-router";
import { LoginPage } from "../features/auth/pages/LoginPage";
import { meQueryOptions } from "../features/auth/api/me-query";

export const Route = createFileRoute("/login")({
  validateSearch: (search: Record<string, unknown>) => ({
    redirect: typeof search.redirect === "string" ? search.redirect : undefined,
  }),
  beforeLoad: async ({ context, search }) => {
    const user = await context.queryClient.query(meQueryOptions);
    if (user) {
      if (search.redirect) {
        window.location.href = search.redirect;
        return;
      }
      throw redirect({ to: "/" });
    }
  },
  component: LoginPage,
});
