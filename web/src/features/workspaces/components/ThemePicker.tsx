import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme, type Theme } from "../../../shared/theme/theme-context";

/**
 * Selector de tema en formato segmentado. Tres botones pegados
 * con `gap-px bg-border`, igual que el resto del sistema hairline.
 *
 * El activo tiene fondo `accent` y texto `foreground`. El ícono cambia
 * por modo. Accesible con `aria-pressed`.
 */
export function ThemePicker() {
  const { theme, setTheme } = useTheme();

  const options: Array<{ value: Theme; label: string; Icon: typeof Sun }> = [
    { value: "light", label: "Claro", Icon: Sun },
    { value: "dark", label: "Oscuro", Icon: Moon },
    { value: "system", label: "Sistema", Icon: Monitor },
  ];

  return (
    <div
      className="grid grid-cols-3 gap-px bg-border border border-border"
      role="group"
      aria-label="Tema"
    >
      {options.map(({ value, label, Icon }) => {
        const isActive = theme === value;
        return (
          <button
            key={value}
            type="button"
            onClick={() => setTheme(value)}
            aria-pressed={isActive}
            aria-label={label}
            className={`flex items-center justify-center py-1.5 transition-colors ${
              isActive
                ? "bg-accent text-foreground"
                : "bg-card text-muted-foreground hover:text-foreground hover:bg-accent"
            }`}
          >
            <Icon className="size-3.5" />
          </button>
        );
      })}
    </div>
  );
}
