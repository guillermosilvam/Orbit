import { useEffect, useState, type ReactNode } from "react";
import { Link, useRouteContext } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { WorkspaceRail } from "../features/workspaces/components/WorkspaceRail";
import { AppSidebar } from "../features/workspaces/components/AppSidebar";
import { SettingsDialog } from "../features/workspaces/components/SettingsDialog";

export function AppShell({ children }: { children: ReactNode }) {
  const { auth } = useRouteContext({ from: "/_authenticated" });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const openSettings = () => {
    setMobileMenuOpen(false);
    setSettingsOpen(true);
  };

  useEffect(() => {
    if (!mobileMenuOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMobileMenuOpen(false);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [mobileMenuOpen]);

  if (!auth.user) return null;

  return (
    <div className="min-h-screen md:flex md:h-screen md:overflow-hidden">
      <WorkspaceRail
        className="hidden md:flex"
        onOpenSettings={openSettings}
      />
      <AppSidebar user={auth.user} className="hidden md:flex" />
      <main className="min-w-0 flex-1 overflow-auto bg-dots">
        <div className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-border bg-background/95 px-4 backdrop-blur md:hidden">
          <Link
            to="/"
            className="inline-flex items-center gap-2 font-semibold tracking-tight text-foreground"
          >
            <OrbitMark />
            Orbit
          </Link>
          <button
            type="button"
            className="inline-flex size-10 items-center justify-center text-foreground hover:bg-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            aria-label={mobileMenuOpen ? "Cerrar navegación" : "Abrir navegación"}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation"
            onClick={() => setMobileMenuOpen((open) => !open)}
          >
            {mobileMenuOpen ? (
              <X className="size-5" />
            ) : (
              <Menu className="size-5" />
            )}
          </button>
        </div>
        {mobileMenuOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/35 md:hidden"
            onClick={() => setMobileMenuOpen(false)}
          >
            <div
              id="mobile-navigation"
              role="dialog"
              aria-modal="true"
              aria-label="Navegación"
              className="relative flex h-full w-[min(92vw,19rem)] bg-sidebar shadow-xl"
              onClick={(event) => event.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="absolute right-2 top-2 z-10 inline-flex size-9 items-center justify-center bg-sidebar text-muted-foreground hover:bg-accent hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                aria-label="Cerrar navegación"
              >
                <X className="size-4" />
              </button>
              <WorkspaceRail
                className="flex"
                onNavigate={() => setMobileMenuOpen(false)}
                onOpenSettings={openSettings}
              />
              <AppSidebar
                user={auth.user}
                className="flex min-w-0 flex-1"
                onNavigate={() => setMobileMenuOpen(false)}
              />
            </div>
          </div>
        )}
        {children}
      </main>
      <SettingsDialog
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
      />
    </div>
  );
}

function OrbitMark() {
  return (
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
    </svg>
  );
}
