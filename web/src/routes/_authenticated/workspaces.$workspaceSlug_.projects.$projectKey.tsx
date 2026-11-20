import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import type { TaskResponseDto } from "@orbit/shared/types/responses";
import { useProject } from "../../features/tasks/hooks/use-project";
import { useTasks } from "../../features/tasks/hooks/use-tasks";
import { TaskList } from "../../features/tasks/components/TaskList";
import { KanbanBoard } from "../../features/tasks/components/KanbanBoard";
import { CreateTaskDialog } from "../../features/tasks/components/CreateTaskDialog";
import { TaskDetailDrawer } from "../../features/tasks/components/TaskDetailDrawer";
import { Button } from "../../shared/ui/Button";
import { BackButton } from "../../shared/ui/BackButton";
import { Plus } from "lucide-react";

export const Route = createFileRoute(
  "/_authenticated/workspaces/$workspaceSlug_/projects/$projectKey",
)({
  component: ProjectDetailPage,
});

type Tab = "list" | "board";

function ProjectDetailPage() {
  const { workspaceSlug, projectKey } = Route.useParams();
  const project = useProject(workspaceSlug, projectKey);
  const tasks = useTasks(workspaceSlug, projectKey);
  const [createOpen, setCreateOpen] = useState(false);
  const [tab, setTab] = useState<Tab>("list");
  const [selectedTask, setSelectedTask] = useState<TaskResponseDto | null>(
    null,
  );

  if (project.isLoading) {
    return (
      <div className="p-8">
        <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
          Cargando…
        </p>
      </div>
    );
  }

  if (!project.data) {
    return (
      <div className="p-8 max-w-3xl mx-auto">
        <h1 className="text-2xl font-semibold text-foreground">
          Proyecto no encontrado
        </h1>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <BackButton
        to="/workspaces/$workspaceSlug"
        params={{ workspaceSlug }}
        label="Volver al workspace"
        className="mb-4"
      />
      <header className="flex items-end justify-between mb-6 gap-4">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-1">
            {workspaceSlug} · {project.data.key}
          </p>
          <h1 className="text-2xl font-semibold text-foreground">
            {project.data.name}
          </h1>
          {project.data.description && (
            <p className="text-sm text-muted-foreground mt-1">
              {project.data.description}
            </p>
          )}
        </div>
        <Button onClick={() => setCreateOpen(true)}>
          <Plus className="size-4" />
          Nueva tarea
        </Button>
      </header>

      {/* Tabs */}
      <div className="border-b border-border mb-4 flex gap-0">
        <TabButton active={tab === "list"} onClick={() => setTab("list")}>
          Lista
        </TabButton>
        <TabButton active={tab === "board"} onClick={() => setTab("board")}>
          Tablero
        </TabButton>
      </div>

      {tab === "list" && (
        <>
          {tasks.isLoading && (
            <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
              Cargando tareas…
            </p>
          )}
          {tasks.data && (
            <TaskList
              tasks={tasks.data}
              workspaceSlug={workspaceSlug}
              projectKey={projectKey}
              onSelectTask={setSelectedTask}
            />
          )}
        </>
      )}

      {tab === "board" && tasks.data && (
        <KanbanBoard
          tasks={tasks.data}
          workspaceSlug={workspaceSlug}
          projectKey={projectKey}
          onSelectTask={setSelectedTask}
        />
      )}

      <CreateTaskDialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        workspaceSlug={workspaceSlug}
        projectKey={projectKey}
      />
      <TaskDetailDrawer
        task={selectedTask}
        onClose={() => setSelectedTask(null)}
        workspaceSlug={workspaceSlug}
        projectKey={projectKey}
      />
    </div>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-4 py-2 font-mono text-[11px] uppercase tracking-wider border-b-2 transition-colors -mb-px ${
        active
          ? "border-primary text-foreground"
          : "border-transparent text-muted-foreground hover:text-foreground"
      }`}
    >
      {children}
    </button>
  );
}
