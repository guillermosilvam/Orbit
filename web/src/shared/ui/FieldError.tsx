import type { ComponentProps } from "react";
import { cn } from "../lib/cn";

/**
 * Mensaje de error de campo. `role="alert"` hace que los lectores de
 * pantalla lo anuncien cuando aparece dinámicamente (por ejemplo, tras
 * un submit fallido).
 */
export function FieldError({
  className,
  children,
  ...rest
}: ComponentProps<"p">) {
  if (!children) return null;

  return (
    <p
      role="alert"
      className={cn("font-sans text-xs text-destructive", className)}
      {...rest}
    >
      {children}
    </p>
  );
}