import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export type Theme = "light" | "dark" | "system";

const STORAGE_KEY = "orbit-theme";

type ThemeContextValue = {
  /** Preferencia guardada del user. */
  theme: Theme;
  /** Tema efectivo después de resolver "system" contra el OS. */
  resolvedTheme: "light" | "dark";
  setTheme: (theme: Theme) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

function getStoredTheme(): Theme {
  if (typeof window === "undefined") return "system";
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === "light" || stored === "dark" || stored === "system") {
    return stored;
  }
  return "system";
}

function getSystemPrefersDark(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

function applyTheme(theme: Theme): "light" | "dark" {
  const isDark =
    theme === "dark" || (theme === "system" && getSystemPrefersDark());
  document.documentElement.classList.toggle("dark", isDark);
  return isDark ? "dark" : "light";
}

/**
 * Provider de tema. Resuelve "system" contra `prefers-color-scheme`,
 * aplica la clase `.dark` en `<html>` y guarda la preferencia en localStorage.
 *
 * Cuando `theme === "system"`, escucha cambios del OS en vivo: si el user
 * cambia su preferencia del sistema mientras la app está abierta, el tema
 * se actualiza sin recargar.
 *
 * El script anti-flash de `index.html` lee la misma clave de localStorage
 * para evitar el flash de tema claro en el primer paint.
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(getStoredTheme);
  const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">(() =>
    theme === "dark" || (theme === "system" && getSystemPrefersDark())
      ? "dark"
      : "light",
  );

  useEffect(() => {
    const applied = applyTheme(theme);
    setResolvedTheme(applied);
    localStorage.setItem(STORAGE_KEY, theme);

    if (theme !== "system") return;

    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => {
      const applied2 = applyTheme("system");
      setResolvedTheme(applied2);
    };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [theme]);

  return (
    <ThemeContext.Provider
      value={{ theme, resolvedTheme, setTheme: setThemeState }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme debe usarse dentro de ThemeProvider");
  return ctx;
}
