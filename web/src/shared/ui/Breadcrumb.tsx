import { Link } from "@tanstack/react-router";
import { cn } from "../lib/cn";

type BreadcrumbItem = {
  label: string;
  /** Si se omite, el item es texto plano (último item). */
  to?: string;
  params?: Record<string, string>;
};

type BreadcrumbProps = {
  items: BreadcrumbItem[];
  className?: string;
};


export function Breadcrumb({ items, className }: BreadcrumbProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={cn("flex items-center gap-1.5 text-xs", className)}
    >
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <span key={index} className="inline-flex items-center gap-1.5">
            {!isLast && item.to ? (
              <Link
                to={item.to}
                params={item.params}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                {item.label}
              </Link>
            ) : (
              <span
                className={isLast ? "text-foreground" : "text-muted-foreground"}
              >
                {item.label}
              </span>
            )}
            {!isLast && (
              <span className="text-muted-foreground/50" aria-hidden>
                /
              </span>
            )}
          </span>
        );
      })}
    </nav>
  );
}
