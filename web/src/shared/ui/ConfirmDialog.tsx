import { useEffect, useState, type FormEvent } from "react";
import { Button } from "./Button";
import { Field } from "./Field";
import { Input } from "./Input";

type Props = {
  title: string;
  description: string;
  confirmLabel: string;
  onClose: () => void;
  onConfirm: () => void;
  requiredText?: string;
};

export function ConfirmDialog({
  title,
  description,
  confirmLabel,
  onClose,
  onConfirm,
  requiredText,
}: Props) {
  const [typedText, setTypedText] = useState("");
  const canConfirm = requiredText === undefined || typedText === requiredText;

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canConfirm) return;
    onConfirm();
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-70 flex items-center justify-center bg-black/50 p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-description"
        className="w-full max-w-md border border-border bg-card p-5 shadow-xl sm:p-6"
      >
        <h2
          id="confirm-dialog-title"
          className="text-lg font-semibold text-foreground"
        >
          {title}
        </h2>
        <p
          id="confirm-dialog-description"
          className="mt-2 text-sm text-muted-foreground"
        >
          {description}
        </p>

        <form onSubmit={submit} className="mt-5">
          {requiredText !== undefined && (
            <Field label={`Escribe “${requiredText}” para continuar`}>
              <Input
                autoFocus
                value={typedText}
                onChange={(event) => setTypedText(event.target.value)}
                autoComplete="off"
                spellCheck={false}
              />
            </Field>
          )}

          <div className="mt-5 flex flex-col-reverse justify-end gap-2 sm:flex-row">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              autoFocus={requiredText === undefined}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="destructive"
              disabled={!canConfirm}
            >
              {confirmLabel}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
