import type { ComponentProps } from "react";
import { cn } from "../lib/cn";


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