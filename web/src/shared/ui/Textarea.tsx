import type { ComponentProps } from "react";
import { cn } from "../lib/cn";


export function Textarea({
  className,
  ...rest
}: ComponentProps<"textarea">) {
  return (
    <textarea
      className={cn(
        "w-full border border-border bg-card px-3 py-2",
        "font-sans text-sm text-foreground placeholder:text-muted-foreground/60",
        "transition-colors min-h-25 resize-y",
        "focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-ring",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "aria-invalid:border-destructive aria-invalid:focus-visible:outline-destructive",
        className,
      )}
      {...rest}
    />
  );
}