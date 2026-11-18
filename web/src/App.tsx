import { Plus, Trash2 } from "lucide-react";
import { Button } from "./shared/ui/Button";


function App() {
  return (
     <main className="min-h-screen bg-dots p-8">
      <div className="max-w-2xl mx-auto flex flex-col gap-px border border-border bg-border">
        <div className="bg-surface p-6 flex flex-col gap-4">
          <h1 className="text-xl font-semibold text-text-primary">Button variants</h1>

          {/* Fila de variantes, tamaño md (default) */}
          <div className="flex flex-wrap gap-2">
            <Button>Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="destructive">Danger</Button>
          </div>

          {/* Tamaños */}
          <div className="flex flex-wrap gap-2 items-center">
            <Button size="sm">Small</Button>
            <Button size="md">Medium</Button>
            <Button size="lg">Large</Button>
          </div>

          {/* Con iconos (Lucide) */}
          <div className="flex flex-wrap gap-2">
            <Button>
              <Plus className="size-4" /> New task
            </Button>
            <Button variant="destructive">
              <Trash2 className="size-4" /> Delete
            </Button>
          </div>

          {/* Estados */}
          <div className="flex flex-wrap gap-2">
            <Button disabled>Disabled</Button>
            <Button loading>Loading</Button>
          </div>

          {/* Override de clases por el consumidor */}
          <div className="flex flex-wrap gap-2">
            <Button className="bg-status-done border-status-done">
              Overridden to green
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}

export default App;
