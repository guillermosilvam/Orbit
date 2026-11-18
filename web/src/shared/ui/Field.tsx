import { cloneElement, isValidElement, useId, type ReactNode } from "react";
import { Label } from "./Label";
import { FieldError } from "./FieldError";

type FieldProps = {
  label: string;
  /** El input. Debe ser un componente que acepte `id` y `aria-*`. */
  children: ReactNode;
  error?: string;
  required?: boolean;
};

/**
 * Wrapper que une Label + campo + FieldError con accesibilidad correcta.
 *
 * - Genera un `id` único con `useId()` si no lo pasas.
 * - Conecta `label.htmlFor` con `input.id` (click en label enfoca el input).
 * - Conecta `input.aria-describedby` con el `id` del error (lo anuncia).
 * - Marca `aria-invalid` cuando hay error (input reacciona visualmente).
 *
 * El `children` debe aceptar `id`, `aria-invalid`, `aria-describedby`
 * y `aria-required`. `Input` ya lo hace (extiende `<input>`).
 *
 * @example
 *   <Field label="Email" error={errors.email?.message} required>
 *     <Input type="email" {...register("email")} />
 *   </Field>
 */
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
      {/* Clonamos el children para inyectar los aria-* sin que el consumidor
          tenga que hacerlo a mano. */}
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

/** Inyecta props al children sin forzar un tipo concreto. */
function cloneElementWithAria(
  children: ReactNode,
  props: Record<string, unknown>,
): ReactNode {
  if (!isValidElement(children)) return children;
  return cloneElement(children as React.ReactElement<Record<string, unknown>>, props);
}