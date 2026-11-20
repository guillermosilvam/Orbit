import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { cn } from "../lib/cn";

type BackButtonProps = {
  to: string;
  params?: Record<string, string>;
  label: string;
  className?: string;
};

/**
 * Back button tipo pill. Más prominente que un link de texto plano:
 * - Borde 1px + fondo `card` lo separa del fondo.
 * - Hover tinta el borde de índigo y el fondo de `accent`.
 * - La flecha se desplaza 2px al hover (micro-feedback).
 * - `label` es el DESTINO ("Acme Corp"), no la acción ("Volver"),
 *   para que el usuario sepa a dónde va sin leer el contexto.
 *
 * Reemplaza al link de texto plano anterior, que se perdía en el layout.
 */
export function BackButton({ to, params, label, className }: BackButtonProps) {
  return (
    <Link
      to={to}
      params={params}
      className={cn(
        "group inline-flex items-center gap-2 h-8 px-3 border border-border bg-card",
        "font-mono text-[11px] uppercase tracking-wider text-muted-foreground",
        "hover:text-foreground hover:border-primary/40 hover:bg-accent",
        "transition-colors duration-150 ease-out motion-reduce:transition-none",
        className,
      )}
    >
      <ArrowLeft className="size-3.5 transition-transform duration-150 ease-out group-hover:-translate-x-0.5 motion-reduce:transition-none" />
      <span className="truncate max-w-50">{label}</span>
    </Link>
  );
}
