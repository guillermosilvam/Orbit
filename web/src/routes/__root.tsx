import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import type { QueryClient } from "@tanstack/react-query";
import type { UserResponseDto } from "@orbit/shared/types/responses";

/**
 * Contexto del router. `queryClient` permite a `beforeLoad` resolver
 * queries antes de decidir si redirigir o no. `auth.user` se mantiene
 * para componentes que lo necesitan sin re-leer la query.
 */
export type RouterContext = {
  queryClient: QueryClient;
  auth: {
    user: UserResponseDto | null;
  };
};

export const Route = createRootRouteWithContext<RouterContext>()({
  component: () => (
    <>
      <Outlet />
    </>
  ),
});