import type { ComponentProps } from "react";
import { cn } from "../lib/cn";


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