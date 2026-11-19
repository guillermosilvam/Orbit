import { Link, useSearch } from "@tanstack/react-router";
import { OrbitalCanvas } from "../components/OrbitalCanvas";
import { LoginForm } from "../components/LoginForm";

export function LoginPage() {
  const { redirect } = useSearch({ from: "/login" });

  return (
    <main className="min-h-screen bg-dots flex items-center justify-center p-4">
      <div className="w-full max-w-5xl border border-border bg-card grid grid-cols-1 lg:grid-cols-12">
        <div className="hidden lg:flex lg:col-span-7 flex-col justify-between p-8 border-r border-border min-h-150">
          <OrbitalCanvas />
          <div className="border-t border-border pt-6">
            <h1 className="text-3xl font-semibold tracking-tight text-foreground">
              Mantén cada proyecto en órbita.
            </h1>
            <p className="text-sm text-muted-foreground mt-2 max-w-md">
              Gestión de proyectos para equipos que aman tener todo en orden.
            </p>
          </div>
        </div>

        <div className="lg:col-span-5 flex flex-col justify-between p-8 min-h-150">
          <div>
            <div className="flex items-center gap-2 border-b border-border pb-4 mb-8">
              <svg
                className="text-primary"
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden
              >
                <circle
                  cx="12"
                  cy="12"
                  r="9"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeDasharray="2 2"
                />
                <circle cx="12" cy="12" r="3.5" fill="currentColor" />
                <circle
                  cx="19"
                  cy="8"
                  r="1.5"
                  fill="var(--status-in-progress)"
                />
              </svg>
              <span className="text-lg font-semibold tracking-tight text-foreground">
                Orbit
              </span>
            </div>

            <h2 className="text-2xl font-semibold tracking-tight text-foreground">
              Iniciar sesión
            </h2>
            <p className="text-sm text-muted-foreground mt-1 mb-6">
              Bienvenido de vuelta. Inicia sesión para continuar.
            </p>

            <LoginForm />
          </div>

          <div className="border-t border-border pt-4 mt-8 flex items-center justify-between text-xs text-muted-foreground">
            <span>¿No tienes cuenta?</span>
            <Link
              to="/register"
              search={{ redirect }}
              className="text-primary hover:underline font-medium"
            >
              Crear una
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
