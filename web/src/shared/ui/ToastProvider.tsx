import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { CircleAlert, CircleCheck, X } from "lucide-react";
import {
  ToastContext,
  type ToastContextValue,
  type ToastKind,
} from "./toast-context";
import type { ToastAction } from "./toast-context";

type ToastItem = { id: number; kind: ToastKind; message: string; action?: ToastAction };

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const nextId = useRef(0);

  const notify = useCallback((kind: ToastKind, message: string, action?: ToastAction) => {
    const id = ++nextId.current;
    setToasts((current) => [...current.slice(-2), { id, kind, message, action }]);
  }, []);
  const dismiss = useCallback((id: number) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);
  const value = useMemo<ToastContextValue>(
    () => ({
      success: (message, action) => notify("success", message, action),
      error: (message) => notify("error", message),
    }),
    [notify],
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed bottom-4 right-4 z-100 flex w-[min(22rem,calc(100vw-2rem))] flex-col gap-2">
        {toasts.map((toast) => (
          <ToastCard key={toast.id} toast={toast} onDismiss={dismiss} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function ToastCard({
  toast,
  onDismiss,
}: {
  toast: ToastItem;
  onDismiss: (id: number) => void;
}) {
  const dismiss = useCallback(
    () => onDismiss(toast.id),
    [onDismiss, toast.id],
  );

  useEffect(() => {
    const timeout = window.setTimeout(dismiss, 5000);
    return () => window.clearTimeout(timeout);
  }, [dismiss]);

  const Icon = toast.kind === "success" ? CircleCheck : CircleAlert;

  return (
    <div
      role={toast.kind === "success" ? "status" : "alert"}
      className="flex items-start gap-3 border border-border bg-card p-3 text-sm text-foreground shadow-lg"
    >
      <Icon
        className={`mt-0.5 size-4 shrink-0 ${
          toast.kind === "success" ? "text-status-done" : "text-destructive"
        }`}
        aria-hidden
      />
      <p className="min-w-0 flex-1">{toast.message}</p>
      {toast.action && (
        <button
          type="button"
          onClick={() => {
            toast.action?.onClick();
            dismiss();
          }}
          className="shrink-0 text-xs font-medium text-primary underline-offset-4 hover:underline"
        >
          {toast.action.label}
        </button>
      )}
      <button
        type="button"
        onClick={dismiss}
        aria-label="Cerrar notificación"
        className="inline-flex size-5 shrink-0 items-center justify-center text-muted-foreground hover:text-foreground"
      >
        <X className="size-3.5" />
      </button>
    </div>
  );
}
