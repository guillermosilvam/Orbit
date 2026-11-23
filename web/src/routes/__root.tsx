import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import type { QueryClient } from "@tanstack/react-query";
import type { UserResponseDto } from "@orbit/shared/types/responses";


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