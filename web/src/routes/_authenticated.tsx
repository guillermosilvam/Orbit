import { createFileRoute, redirect, Outlet } from "@tanstack/react-router";
import { meQueryOptions } from "../features/auth/api/me-query";

/**
 * Layout pathless que protege todas sus rutas hijas.
 *
 * `beforeLoad` corre ANTES de montar el componente hijo.
 * - `ensureQueryData` garantiza que la query del user está resuelta
 *   (desde cache fresca o refetcheando). Sin esto, si el usuario recarga
 *   la página, el beforeLoad corre antes de que `useMe` resuelva y
 *   redirige a /login aunque haya cookie válida.
 * - Si el user es null, `throw redirect({ to: "/login" })` cancela la
 *   navegación. El componente hijo nunca se monta.
 *
 * `redirect` se LANZA (`throw`), no se retorna. Es la API de TanStack Router.
 */
export const Route = createFileRoute("/_authenticated")({
  beforeLoad: async ({ context, location }) => {
    const user = await context.queryClient.query(meQueryOptions);
    if (!user) {
      // `redirect` guarda la ruta actual para volver después del login.
      throw redirect({ to: "/login", search: { redirect: location.href } });
    }
    // Inyecta el user en el contexto de las rutas hijas (sin prop drilling).
    return { auth: { user } };
  },
  component: () => <Outlet />,
});