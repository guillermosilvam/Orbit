import type { ComponentProps } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/cn";


const iconButtonVariants = cva(
  [
    "inline-flex items-center justify-center",
    "transition-all duration-150 ease-out",
    "motion-reduce:transition-none",
    "active:scale-95 disabled:active:scale-100",
    "disabled:opacity-50 disabled:cursor-not-allowed",
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
  ].join(" "),
  {
    variants: {
      variant: {
        default: "text-muted-foreground hover:text-foreground hover:bg-accent",
        danger:
          "text-muted-foreground hover:text-destructive hover:bg-destructive/10",
        primary: "text-primary hover:text-primary-hover hover:bg-accent",
      },
      size: {
        sm: "size-7",
        md: "size-8",
        lg: "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  },
);

export type IconButtonProps = Omit<ComponentProps<"button">, "aria-label"> &
  VariantProps<typeof iconButtonVariants> & {
    "aria-label": string;
  };

export function IconButton({
  className,
  variant,
  size,
  ...rest
}: IconButtonProps) {
  return (
    <button
      type="button"
      className={cn(iconButtonVariants({ variant, size }), className)}
      {...rest}
    />
  );
}
