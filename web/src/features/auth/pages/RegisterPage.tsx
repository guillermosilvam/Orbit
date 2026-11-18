import { OrbitalCanvas } from "../components/OrbitalCanvas";
import { RegisterForm } from "../components/RegisterForm";
import { Link } from "@tanstack/react-router";

export function RegisterPage() {
  return (
    <main className="min-h-screen bg-dots flex items-center justify-center p-4">
      <div className="w-full max-w-5xl border border-border bg-card grid grid-cols-1 lg:grid-cols-12">
        {/* Panel izquierdo: igual que LoginPage */}
        <div className="hidden lg:flex lg:col-span-7 flex-col justify-between p-8 border-r border-border min-h-150">
          <OrbitalCanvas />

          <div className="border-t border-border pt-6">
            <h1 className="text-3xl font-semibold tracking-tight text-foreground">
              Empieza en órbita.
            </h1>
            <p className="text-sm text-muted-foreground mt-2 max-w-md">
              Workspaces, proyectos y tareas — organizados desde el día uno.
            </p>
          </div>
        </div>

        {/* Panel derecho */}
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
              Crear cuenta
            </h2>
            <p className="text-sm text-muted-foreground mt-1 mb-6">
              Configura tu perfil para empezar.
            </p>

            <RegisterForm />
          </div>

          <div className="border-t border-border pt-4 mt-8 flex items-center justify-between text-xs text-muted-foreground">
            <span>¿Ya tienes cuenta?</span>
            <Link
              to="/login"
              className="text-primary hover:underline font-medium"
            >
              Iniciar sesión
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
