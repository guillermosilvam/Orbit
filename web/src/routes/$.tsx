import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";


export const Route = createFileRoute("/$")({
  component: NotFoundPage,
});

function NotFoundPage() {
  return (
    <main className="min-h-screen bg-dots flex items-center justify-center p-4">
      <div className="w-full max-w-md border border-border bg-card p-8 text-center">
        <svg
          className="mx-auto mb-6 text-primary"
          width="48"
          height="48"
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
          <circle cx="19" cy="8" r="1.5" fill="var(--status-in-progress)" />
        </svg>

        <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-2">
          Error 404
        </p>
        <h1 className="text-2xl font-semibold text-foreground">
          Fuera de órbita
        </h1>
        <p className="text-sm text-muted-foreground mt-2">
          La página que buscas no existe o fue movida.
        </p>

        <Link
          to="/"
          className="inline-flex items-center gap-1.5 mt-6 h-9 px-4 border border-border bg-card font-mono text-[11px] uppercase tracking-wider text-foreground hover:bg-accent hover:border-primary/40 transition-colors duration-150 ease-out"
        >
          <ArrowLeft className="size-3.5" />
          Volver al inicio
        </Link>
      </div>
    </main>
  );
}
