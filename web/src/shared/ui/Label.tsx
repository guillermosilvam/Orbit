import type { ComponentProps } from "react";
import { cn } from "../lib/cn";

/**
 * Label accesible. Enlazado al input mediante `htmlFor` (que apunta al `id`
 * del input). Sin esto, clicar el label no enfoca el input, y los lectores
 * de pantalla no anuncian qué campo están leyendo.
 *
 * Estilo: mono, uppercase, tracking amplio. Coherente con las etiquetas
 * del sistema hairline (como los IDs de tarea).
 */
export function Label({
  className,
  children,
  ...rest
}: ComponentProps<"label">) {
  return (
    <label
      className={cn(
        "font-mono text-[11px] uppercase tracking-wider text-muted-foreground",
        className,
      )}
      {...rest}
    >
      {children}
    </label>
  );
}