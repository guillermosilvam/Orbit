import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { Check, ChevronDown, Search } from "lucide-react";

export type SearchableSelectOption = {
  value: string;
  label: string;
  searchText?: string;
  leading?: ReactNode;
};

type Props = {
  value: string;
  options: SearchableSelectOption[];
  onChange: (value: string) => void;
  label: string;
  prefix?: string;
  placeholder?: string;
  searchPlaceholder?: string;
  disabled?: boolean;
  className?: string;
};

export function SearchableSelect({
  value,
  options,
  onChange,
  label,
  prefix,
  placeholder = "Seleccionar…",
  searchPlaceholder = "Buscar…",
  disabled = false,
  className = "",
}: Props) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const rootRef = useRef<HTMLDivElement>(null);
  const selected = options.find((option) => option.value === value);
  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
  }, []);
  const filteredOptions = options.filter((option) =>
    `${option.label} ${option.searchText ?? ""}`
      .toLocaleLowerCase("es")
      .includes(query.toLocaleLowerCase("es")),
  );

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) close();
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [close, open]);

  return (
    <div ref={rootRef} className={`relative min-w-0 ${className}`}>
      <button
        type="button"
        disabled={disabled}
        aria-label={label}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => {
          if (open) close();
          else {
            setQuery("");
            setOpen(true);
          }
        }}
        className="inline-flex h-9 max-w-full items-center gap-2 border border-border bg-card px-3 text-left text-xs text-foreground transition-colors hover:bg-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:cursor-not-allowed disabled:opacity-50"
      >
        {selected?.leading}
        {prefix && (
          <span className="shrink-0 text-muted-foreground">{prefix}:</span>
        )}
        <span className="truncate">{selected?.label ?? placeholder}</span>
        <ChevronDown className="size-3.5 shrink-0 text-muted-foreground" />
      </button>

      {open && (
        <div className="absolute left-0 top-full z-60 mt-1 w-64 max-w-[min(90vw,20rem)] border border-border bg-popover text-popover-foreground shadow-lg">
          <div className="flex items-center gap-2 border-b border-border px-3">
            <Search className="size-3.5 shrink-0 text-muted-foreground" />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={searchPlaceholder}
              aria-label={searchPlaceholder}
              autoFocus
              className="h-10 min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
          </div>
          <div role="listbox" aria-label={label} className="max-h-56 overflow-y-auto p-1">
            {filteredOptions.length ? (
              filteredOptions.map((option) => {
                const isSelected = option.value === value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => {
                      onChange(option.value);
                      close();
                    }}
                    className="flex w-full items-center gap-2 px-2 py-2 text-left text-sm text-foreground hover:bg-accent focus-visible:bg-accent focus-visible:outline-none"
                  >
                    {option.leading}
                    <span className="min-w-0 flex-1 truncate">
                      {option.label}
                    </span>
                    {isSelected && (
                      <Check className="size-3.5 shrink-0 text-primary" />
                    )}
                  </button>
                );
              })
            ) : (
              <p className="px-2 py-3 text-sm text-muted-foreground">
                No hay resultados.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
