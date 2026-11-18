import { createRouter } from "@tanstack/react-router";
import { routeTree } from "../routeTree.gen";
import type { RouterContext } from "../routes/__root";

/**
 * Instancia única del router. `routeTree` es el árbol generado por el plugin
 * a partir de los archivos en `src/routes/`.
 *
 * `context` se pasa como placeholder al crear el router. El valor real
 * (con el user) lo inyecta `App` vía `<RouterProvider context={...} />`.
 * `undefined!` es un cast temporal: en el primer render el user aún no se
 * conoce; el beforeLoad lo lee después de que `useMe` resuelva.
 *
 * `defaultPreload: 'intent'` → al pasar el ratón sobre un `<Link>`, el router
 * precarga la ruta antes de que el usuario haga click. Navegación instantánea.
 */
export const router = createRouter({
  routeTree,
  context: {
    auth: { user: null },
  } satisfies RouterContext as RouterContext,
  defaultPreload: "intent",
  scrollRestoration: true,
});

/**
 * Registro del router para tipado global. Con esto, `<Link to="...">`
 * autocompleta las rutas válidas y `useNavigate` sabe a dónde puede ir.
 * Si añades una ruta nueva, TypeScript lo sabe sin tocar este archivo.
 */
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}