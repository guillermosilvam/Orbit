
function App() {
  return (
    <main className="min-h-screen bg-dots p-8">
      <div className="max-w-3xl mx-auto flex flex-col gap-px border border-border bg-border">
        {/* Fila 1: superficies */}
        <div className="grid grid-cols-3 gap-px">
          <div className="bg-background p-6">
            <p className="font-mono text-xs uppercase tracking-wider text-text-secondary">
              background
            </p>
            <p className="mt-2 text-sm text-text-primary">#f7f4ec / #14130f</p>
          </div>
          <div className="bg-surface p-6">
            <p className="font-mono text-xs uppercase tracking-wider text-text-secondary">
              surface
            </p>
            <p className="mt-2 text-sm text-text-primary">#fcfaf5 / #1b1a15</p>
          </div>
          <div className="bg-sidebar p-6">
            <p className="font-mono text-xs uppercase tracking-wider text-text-secondary">
              sidebar
            </p>
            <p className="mt-2 text-sm text-text-primary">#f1ede2 / #100f0c</p>
          </div>
        </div>

        {/* Fila 2: texto y acento */}
        <div className="bg-surface p-6 flex flex-col gap-3">
          <h1 className="text-2xl font-semibold text-text-primary">
            Hairline Collapsed Grid
          </h1>
          <p className="text-text-secondary">
            Warm editorial skin. Thin lines, no shadows.
          </p>
          <p className="font-mono text-sm text-text-primary">
            WEB-12 · WEB-13 · 2026-11-17
          </p>
          <div className="flex gap-2">
            <span className="bg-accent text-white px-3 py-1 text-sm">
              accent
            </span>
            <span className="border border-border px-3 py-1 text-sm">
              border
            </span>
            <span className="bg-status-todo text-white px-3 py-1 text-sm">
              todo
            </span>
            <span className="bg-status-in-progress text-white px-3 py-1 text-sm">
              in_progress
            </span>
            <span className="bg-status-done text-white px-3 py-1 text-sm">
              done
            </span>
            <span className="bg-danger text-white px-3 py-1 text-sm">
              danger
            </span>
          </div>
        </div>
      </div>

      <button
        type="button"
        className="fixed bottom-4 right-4 bg-accent text-white px-4 py-2 font-mono text-xs uppercase tracking-wider"
        onClick={() => document.documentElement.classList.toggle("dark")}
      >
        toggle theme
      </button>
    </main>
  );
}

export default App;
