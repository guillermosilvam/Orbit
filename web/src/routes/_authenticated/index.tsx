import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useLogout } from "../../features/auth/hooks/use-logout";
import { Button } from "../../shared/ui/Button";

/**
 * Ruta `/`. Provisional: muestra "Bienvenido, <email>" y un botón de logout.
 * Después será el dashboard de workspaces.
 *
 * `Route.useRouteContext()` lee el user del context del router, que
 * `_authenticated` inyectó en su beforeLoad. Sin query extra, sin prop drilling.
 */
export const Route = createFileRoute("/_authenticated/")({
  component: HomePage,
});

function HomePage() {
  const { auth } = Route.useRouteContext();
  const logout = useLogout();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout.mutateAsync();
    navigate({ to: "/login" });
  };

  return (
    <main className="min-h-screen bg-dots p-8">
      <div className="max-w-2xl mx-auto border border-border bg-card p-6">
        <h1 className="text-2xl font-semibold text-foreground">Bienvenido</h1>
        <p className="text-muted-foreground mt-1">
          Sesión activa como{" "}
          <strong className="text-foreground">{auth.user.email}</strong>
        </p>
        <div className="mt-6 flex gap-2">
          <Button
            variant="secondary"
            onClick={() => document.documentElement.classList.toggle("dark")}
          >
            Cambiar tema
          </Button>
          <Button
            variant="ghost"
            onClick={handleLogout}
            loading={logout.isPending}
          >
            Cerrar sesión
          </Button>
        </div>
      </div>
    </main>
  );
}
