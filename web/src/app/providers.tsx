import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";

/**
 * Configuración del QueryClient. `staleTime` y `retry` son las dos opciones
 * que más afectan la experiencia.
 *
 * - `staleTime: 30_000` → los datos se consideran "frescos" durante 30s.
 *   En esa ventana, TanStack no refetchea aunque remontes el componente.
 *   Sin esto, cada navegación dispara un fetch, aunque los datos sean los
 *   mismos. 30s es un buen default para apps tipo Linear/Jira.
 * - `retry: 1` → reintenta una vez si la petición falla por red.
 *   No reintentamos errores 4xx (son del cliente, no se resuelven
 *   reintentando). Solo 5xx y errores de red.
 * - `refetchOnWindowFocus: false` → no refetchea al volver a la pestaña.
 *   Linear/Jira sí lo hacen; tú decides. Lo dejamos off para no marear
 *   en desarrollo.
 */
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: (failureCount, error) => {
        if (error instanceof Error && "status" in error) {
          const status = (error as { status: number }).status;
          if (status >= 400 && status < 500) return false;
        }
        return failureCount < 1;
      },
      refetchOnWindowFocus: false,
    },
  },
});

export function Providers({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}