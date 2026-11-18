import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combina clases Tailwind resolviendo conflictos.
 *
 * - `clsx` convierte inputs heterogéneos (strings, arrays, objetos) en un
 *   string de clases, descartando las condiciones falsas.
 * - `twMerge` recibe ese string y elimina clases Tailwind en conflicto,
 *   conservando la última. Ejemplo: `twMerge("bg-accent bg-danger")` → `"bg-danger"`.
 *
 * Se usa en todos los componentes que aceptan `className` externo.
 *
 * @example
 *   cn("p-4", isActive && "bg-accent", "bg-danger") // → "p-4 bg-danger"
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}