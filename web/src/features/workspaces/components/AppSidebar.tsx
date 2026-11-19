import { Link, useMatchRoute } from "@tanstack/react-router";
import { useWorkspaces } from "../hooks/use-workspaces";

export function AppSidebar() {
  const { data: workspaces = [] } = useWorkspaces();
  const match = useMatchRoute();
  const params = match({ to: "/workspaces/$workspaceSlug" });
  const currentSlug = params ? params.workspaceSlug : undefined;
  const current = currentSlug
    ? workspaces.find((w) => w.slug === currentSlug)
    : undefined;

  return (
    <aside className="w-60 bg-sidebar border-r border-border flex flex-col shrink-0">
      <div className="p-4 border-b border-border">
          <Link
            to="/"
            className="inline-flex items-center gap-2"
            aria-label="Ir al inicio"
          >
            <svg
              className="text-primary"
              width="20"
              height="20"
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
            <span className="text-lg font-semibold tracking-tight text-foreground">
              Orbit
            </span>
          </Link>
      </div>

      <div className="p-4 flex-1 overflow-auto">
        {current ? (
          <>
            <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-2">
              Workspace
            </p>
            <p className="text-sm font-medium text-foreground truncate">
              {current.name}
            </p>
            <p className="font-mono text-[11px] text-muted-foreground mt-0.5">
              /{current.slug}
            </p>
            <p className="text-xs text-muted-foreground mt-6">
              Proyectos — próximamente
            </p>
          </>
        ) : (
          <p className="text-xs text-muted-foreground">
            Selecciona un workspace para ver su contenido.
          </p>
        )}
      </div>
    </aside>
  );
}
