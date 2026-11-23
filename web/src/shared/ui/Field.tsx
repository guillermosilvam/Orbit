import { cloneElement, isValidElement, useId, type ReactNode } from "react";
import { Label } from "./Label";
import { FieldError } from "./FieldError";

type FieldProps = {
  label: string;
  
  children: ReactNode;
  error?: string;
  required?: boolean;
};


export function Field({ label, children, error, required }: FieldProps) {
  const generatedId = useId();
  const inputId = `field-${generatedId}`;
  const errorId = `${inputId}-error`;
  const hasError = Boolean(error);

  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={inputId}>
        {label}
        {required && (
          <span className="text-destructive ml-0.5" aria-hidden>
            *
          </span>
        )}
      </Label>
      {}
      {cloneElementWithAria(children, {
        id: inputId,
        "aria-invalid": hasError || undefined,
        "aria-describedby": hasError ? errorId : undefined,
        "aria-required": required || undefined,
      })}
      <FieldError id={errorId}>{error}</FieldError>
    </div>
  );
}


function cloneElementWithAria(
  children: ReactNode,
  props: Record<string, unknown>,
): ReactNode {
  if (!isValidElement(children)) return children;
  return cloneElement(children as React.ReactElement<Record<string, unknown>>, props);
}