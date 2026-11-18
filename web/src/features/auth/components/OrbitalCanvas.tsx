export function OrbitalCanvas() {
  return (
    <div className="relative w-full h-full flex items-center justify-center" aria-hidden>
      <div className="relative w-full max-w-105 aspect-square">
        {/* Ejes hairline */}
        <div className="absolute inset-x-0 top-1/2 h-px bg-border" />
        <div className="absolute inset-y-0 left-1/2 w-px bg-border" />

        <svg
          viewBox="0 0 340 340"
          fill="none"
          className="w-full h-full text-muted-foreground"
        >
          {/* Círculos concéntricos */}
          <circle cx="170" cy="170" r="150" stroke="var(--border)" strokeDasharray="2 4" />
          <circle cx="170" cy="170" r="118" stroke="var(--border)" />
          <circle cx="170" cy="170" r="82" stroke="var(--border)" />
          <circle cx="170" cy="170" r="46" stroke="var(--border)" strokeDasharray="1 3" />

          {/* Elipses inclinadas: trayectorias */}
          <ellipse cx="170" cy="170" rx="142" ry="68" stroke="var(--border)" transform="rotate(-28 170 170)" />
          <ellipse cx="170" cy="170" rx="120" ry="46" stroke="var(--border)" transform="rotate(38 170 170)" />

          {/* Arco de acento: punto de interés en la órbita */}
          <path d="M 170 50 A 120 120 0 0 1 274 110" stroke="var(--primary)" strokeWidth="1.5" strokeDasharray="4 2" />

          {/* Marcas de calibración */}
          <line x1="170" y1="20" x2="170" y2="28" stroke="var(--muted-foreground)" />
          <line x1="170" y1="312" x2="170" y2="320" stroke="var(--muted-foreground)" />
          <line x1="20" y1="170" x2="28" y2="170" stroke="var(--muted-foreground)" />
          <line x1="312" y1="170" x2="320" y2="170" stroke="var(--muted-foreground)" />

          {/* Sol central */}
          <circle cx="170" cy="170" r="11" fill="var(--card)" stroke="var(--foreground)" strokeWidth="1.5" />
          <circle cx="170" cy="170" r="4" fill="var(--primary)" />
          <circle cx="170" cy="170" r="18" stroke="var(--primary)" strokeDasharray="2 3" />
        </svg>

        {/* Nodos de tarea. Mono para los IDs, que es su uso canónico. */}
        <OrbitalNode
          className="top-20.5 right-22"
          color="bg-primary"
          label="WEB-1"
        />
        <OrbitalNode
          className="bottom-23 left-19.5"
          color="bg-status-in-progress"
          label="API-3"
        />
        <OrbitalNode
          className="top-45.5 left-8"
          color="bg-status-done"
          label="TASK-7"
        />
      </div>
    </div>
  );
}

function OrbitalNode({
  className,
  color,
  label,
}: {
  className: string;
  color: string;
  label: string;
}) {
  return (
    <div className={`absolute flex items-center gap-1.5 ${className}`}>
      <span className={`size-2.5 ${color}`} />
      <span className="font-mono text-[10px] tabular bg-card border border-border px-1 text-foreground">
        {label}
      </span>
    </div>
  );
}