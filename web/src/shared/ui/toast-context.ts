import { createContext, useContext } from "react";

export type ToastKind = "success" | "error";
export type ToastAction = {
  label: string;
  onClick: () => void;
};
export type ToastContextValue = {
  success: (message: string, action?: ToastAction) => void;
  error: (message: string) => void;
};

export const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast(): ToastContextValue {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return context;
}
