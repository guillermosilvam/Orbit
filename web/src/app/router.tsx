import { createRouter } from "@tanstack/react-router";
import { QueryClient } from "@tanstack/react-query";
import { routeTree } from "../routeTree.gen";
import type { RouterContext } from "../routes/__root";


const placeholderQueryClient = new QueryClient();

export const router = createRouter({
  routeTree,
  context: {
    queryClient: placeholderQueryClient,
    auth: { user: null },
  } satisfies RouterContext,
  defaultPreload: "intent",
  scrollRestoration: true,
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}