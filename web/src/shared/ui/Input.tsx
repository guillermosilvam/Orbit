import type { ComponentProps } from "react";
import { cn } from "../lib/cn";


export function Input({
  className,
  type = "text",
  ...rest
}: ComponentProps<"input">) {
  return (
    <input
      type={type}
      className={cn(
        "h-10 w-full border border-border bg-card px-3",
        "font-sans text-sm text-foreground placeholder:text-muted-foreground/60",
        "transition-colors",
        "focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-ring",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "aria-invalid:border-destructive aria-invalid:focus-visible:outline-destructive",
        className,
      )}
      {...rest}
    />
  );
}