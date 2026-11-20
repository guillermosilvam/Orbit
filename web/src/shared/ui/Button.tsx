import type { ComponentProps } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import { cn } from "../lib/cn";


const buttonVariants = cva(
  [
    "inline-flex items-center justify-center gap-2",
    "font-mono text-xs uppercase tracking-wider",
    "border transition-all duration-150 ease-out",
    "motion-reduce:transition-none",
    "active:scale-[0.98]",
    "disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100",
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
  ].join(" "),
  {
    variants: {
      variant: {
        primary:
          "bg-primary text-primary-foreground border-primary hover:bg-primary-hover",
        secondary: "bg-card text-foreground border-border hover:bg-accent",
        ghost:
          "bg-transparent text-foreground border-transparent hover:bg-accent",
        destructive:
          "bg-destructive text-destructive-foreground border-destructive hover:opacity-90",
      },
      size: {
        sm: "h-9 px-3 text-[11px]",
        md: "h-10 px-4",
        lg: "h-12 px-6 text-sm",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

export type ButtonProps = ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    loading?: boolean;
  };

export function Button({
  className,
  variant,
  size,
  loading = false,
  disabled,
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      className={cn(buttonVariants({ variant, size }), className)}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...rest}
    >
      {loading && <Loader2 className="size-4 animate-spin" aria-hidden />}
      {children}
    </button>
  );
}
