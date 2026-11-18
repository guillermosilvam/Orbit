import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import type { UserResponseDto } from "@orbit/shared/types/responses";

export type RouterContext = {
  auth: {
    user: UserResponseDto | null;
  };
};

/**
 * Layout raíz. Envuelve TODAS las rutas.
 * `<Outlet />` es donde se renderiza la ruta activa.
 * `TanStackRouterDevtools` solo aparece en desarrollo.
 */
export const Route = createRootRouteWithContext<RouterContext>()({
  component: () => (
    <>
      <Outlet />
      <TanStackRouterDevtools position="bottom-right" />
    </>
  ),
});