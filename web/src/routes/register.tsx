import { createFileRoute, redirect } from "@tanstack/react-router";
import { RegisterPage } from "../features/auth/pages/RegisterPage";
import { meQueryOptions } from "../features/auth/api/me-query";

export const Route = createFileRoute("/register")({
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
  component: RegisterPage,
});
