import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import type { TaskResponseDto } from "@orbit/shared/types/responses";
import { useProject } from "../../features/tasks/hooks/use-project";
import { useTasks } from "../../features/tasks/hooks/use-tasks";
import { useWorkspaces } from "../../features/workspaces/hooks/use-workspaces";
import { TaskList } from "../../features/tasks/components/TaskList";
import { KanbanBoard } from "../../features/tasks/components/KanbanBoard";
import { CreateTaskDialog } from "../../features/tasks/components/CreateTaskDialog";
import { TaskDetailDrawer } from "../../features/tasks/components/TaskDetailDrawer";
import { Button } from "../../shared/ui/Button";
import { Breadcrumb } from "../../shared/ui/BreadCrumb";

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
  const { data: workspaces = [] } = useWorkspaces();
  const [createOpen, setCreateOpen] = useState(false);
  const [tab, setTab] = useState<Tab>("list");
  const [selectedTask, setSelectedTask] = useState<TaskResponseDto | null>(
    null,
  );

  const workspace = workspaces.find((w) => w.slug === workspaceSlug);

  if (project.isLoading) {
    return (
      <div className="p-8">
        <p className="text-sm text-muted-foreground">Cargando…</p>
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

  const taskList = tasks.data;

  return (
    <div className="p-8 max-w-300 mx-auto">
      <Breadcrumb
        className="mb-4"
        items={[
          {
            label: workspace?.name ?? workspaceSlug,
            to: "/workspaces/$workspaceSlug",
            params: { workspaceSlug },
          },
          { label: project.data.name },
        ]}
      />

      <header className="flex items-end justify-between mb-6 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-semibold text-foreground">
              {project.data.name}
            </h1>
            <span className="font-mono text-xs text-muted-foreground border border-border px-1.5 py-0.5">
              {project.data.key}
            </span>
          </div>
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
            <p className="text-sm text-muted-foreground">Cargando tareas…</p>
          )}
          {taskList && (
            <TaskList
              tasks={taskList}
              workspaceSlug={workspaceSlug}
              projectKey={projectKey}
              onSelectTask={setSelectedTask}
            />
          )}
        </>
      )}

      {tab === "board" && taskList && (
        <KanbanBoard
          tasks={taskList}
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
      className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors -mb-px ${
        active
          ? "border-primary text-foreground"
          : "border-transparent text-muted-foreground hover:text-foreground"
      }`}
    >
      {children}
    </button>
  );
}
