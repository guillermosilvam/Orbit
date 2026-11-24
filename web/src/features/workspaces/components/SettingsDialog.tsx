import { useEffect } from "react";
import { Bug, X } from "lucide-react";
import { ThemePicker } from "./ThemePicker";

type Props = {
  open: boolean;
  onClose: () => void;
};

const BUG_REPORT_URL =
  "https://github.com/guillermosilvam/Orbit/issues/new?labels=bug&title=%5BBug%5D%20&body=%23%23%20Descripci%C3%B3n%0A%0A%23%23%20Pasos%20para%20reproducir%0A1.%20%0A2.%20%0A3.%20%0A%0A%23%23%20Resultado%20esperado%0A%0A%23%23%20Resultado%20actual";
const CREATOR_PROFILE = "https://github.com/guillermosilvam";

export function SettingsDialog({ open, onClose }: Props) {
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-0 sm:items-center sm:p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="settings-title"
    >
      <section
        className="w-full max-w-md border border-border bg-card p-5 shadow-xl sm:p-6"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h2
              id="settings-title"
              className="text-lg font-semibold text-foreground"
            >
              Configuración
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Tema, ayuda y más sobre Orbit.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex size-8 shrink-0 items-center justify-center text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            aria-label="Cerrar configuración"
          >
            <X className="size-4" />
          </button>
        </header>

        <section className="mb-5">
          <h3 className="mb-2 text-sm font-medium text-foreground">Tema</h3>
          <ThemePicker />
        </section>

        <section className="mb-3 border border-border bg-background p-3">
          <div className="flex items-start gap-3">
            <Bug className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
            <div className="min-w-0">
              <h3 className="text-sm font-medium text-foreground">
                ¿Encontraste un problema?
              </h3>
              <p className="mt-1 text-xs text-muted-foreground">
                Reporta el problema directamente en GitHub.
              </p>
              <a
                href={BUG_REPORT_URL}
                target="_blank"
                rel="noreferrer"
                className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-primary underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              >
                Reportar un bug
                <span aria-hidden>↗</span>
              </a>
            </div>
          </div>
        </section>

        <a
          href={CREATOR_PROFILE}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-3 border border-border bg-background p-3 transition-colors hover:bg-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          <GitHubMark />
          <span className="min-w-0 flex-1">
            <span className="block text-sm font-medium text-foreground">
              Perfil del creador
            </span>
            <span className="block truncate text-xs text-muted-foreground">
              github.com/guillermosilvam
            </span>
          </span>
          <span aria-hidden className="text-muted-foreground">
            ↗
          </span>
        </a>
      </section>
    </div>
  );
}

function GitHubMark() {
  return (
    <svg
      className="size-5 shrink-0 text-foreground"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 .9a11.1 11.1 0 0 0-3.51 21.63c.56.1.76-.24.76-.54v-2.1c-3.1.67-3.76-1.32-3.76-1.32-.5-1.29-1.24-1.63-1.24-1.63-1.01-.69.08-.68.08-.68 1.12.08 1.7 1.15 1.7 1.15 1 1.7 2.61 1.21 3.25.92.1-.72.39-1.21.71-1.49-2.48-.28-5.09-1.24-5.09-5.52 0-1.22.44-2.22 1.15-3-.12-.28-.5-1.42.11-2.96 0 0 .94-.3 3.06 1.15a10.7 10.7 0 0 1 5.57 0c2.12-1.45 3.06-1.15 3.06-1.15.61 1.54.23 2.68.11 2.96.72.78 1.15 1.78 1.15 3 0 4.29-2.61 5.23-5.1 5.51.4.35.76 1.02.76 2.06v3.1c0 .3.2.65.77.54A11.1 11.1 0 0 0 12 .9Z" />
    </svg>
  );
}
