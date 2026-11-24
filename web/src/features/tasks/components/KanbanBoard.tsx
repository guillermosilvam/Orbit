import { useState } from "react";
import {
  DndContext,
  DragOverlay,
  MouseSensor,
  TouchSensor,
  closestCorners,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import {
  TASK_STATUSES,
  type TaskStatus,
} from "@orbit/shared/schemas/task.schema";
import type { TaskResponseDto } from "@orbit/shared/types/responses";
import type { WorkspaceMemberResponseDto } from "@orbit/shared/types/responses";
import { KanbanColumn } from "./KanbanColumn";
import { KanbanCard } from "./KanbanCard";
import { useUpdateTask } from "../hooks/use-update-task";
import { ConfirmDialog } from "../../../shared/ui/ConfirmDialog";
import { useToast } from "../../../shared/ui/toast-context";

const POSITION_GAP = 1000;

export function KanbanBoard({
  tasks,
  workspaceSlug,
  projectKey,
  onSelectTask,
  members = [],
}: {
  tasks: TaskResponseDto[];
  workspaceSlug: string;
  projectKey: string;
  onSelectTask: (task: TaskResponseDto) => void;
  members?: WorkspaceMemberResponseDto[];
}) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [pendingDone, setPendingDone] = useState<{
    task: TaskResponseDto;
    position: number;
  } | null>(null);
  const [pendingReopen, setPendingReopen] = useState<TaskResponseDto | null>(null);
  const updateTask = useUpdateTask(workspaceSlug, projectKey);
  const toast = useToast();

  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 200, tolerance: 8 },
    }),
  );

  const activeTask = activeId ? tasks.find((t) => t.id === activeId) : null;

  const handleDragStart = (e: DragStartEvent) => {
    setActiveId(e.active.id as string);
  };

  const handleDragCancel = () => {
    setActiveId(null);
  };

  const handleDragEnd = (e: DragEndEvent) => {
    const { active, over } = e;

    if (!over || active.id === over.id) {
      setActiveId(null);
      return;
    }

    const activeTask = tasks.find((t) => t.id === active.id);
    if (!activeTask) {
      setActiveId(null);
      return;
    }

    const targetStatus = getTargetStatus(over.id as string, tasks);
    if (!targetStatus) {
      setActiveId(null);
      return;
    }

    if (targetStatus === activeTask.status && over.id === active.id) {
      setActiveId(null);
      return;
    }

    if (activeTask.status === "done" && targetStatus !== "done") {
      setActiveId(null);
      return;
    }

    const newPosition = calculatePosition(
      tasks,
      activeTask.id,
      targetStatus,
      over.id as string,
    );

    if (targetStatus === "done") {
      setPendingDone({ task: activeTask, position: newPosition });
    } else {
      updateTask.mutate({
        id: activeTask.id,
        number: activeTask.number,
        status: targetStatus,
        position: newPosition,
      });
    }

    setActiveId(null);
  };

  const confirmDone = () => {
    if (!pendingDone) return;
    const { task, position } = pendingDone;
    updateTask.mutate(
      {
        id: task.id,
        number: task.number,
        status: "done",
        position,
      },
      {
        onSuccess: () => {
          toast.success("Tarea marcada como hecha.", {
            label: "Deshacer",
            onClick: () => {
              updateTask.mutate({
                id: task.id,
                number: task.number,
                status: "in_progress",
                position: task.position,
              });
            },
          });
        },
      },
    );
  };

  const confirmReopen = () => {
    if (!pendingReopen) return;
    const task = pendingReopen;
    updateTask.mutate({
      id: task.id,
      number: task.number,
      status: "in_progress",
      position: task.position,
    });
  };

  return (
    <>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
      >
        <div
          className="grid min-w-0 grid-cols-1 gap-px border border-border bg-border sm:grid-cols-3"
          role="region"
          aria-label="Tablero de tareas"
          tabIndex={0}
        >
          {TASK_STATUSES.map((status) => (
            <KanbanColumn
              key={status}
              status={status}
              tasks={tasks
                .filter((t) => t.status === status)
                .sort((a, b) => a.position - b.position)}
              onSelectTask={onSelectTask}
              members={members}
              onReopen={setPendingReopen}
            />
          ))}
        </div>

        <DragOverlay>
          {activeTask ? (
            <KanbanCard task={activeTask} isOverlay members={members} />
          ) : null}
        </DragOverlay>
      </DndContext>
      {pendingDone && (
        <ConfirmDialog
          title={`Marcar ${pendingDone.task.identifier} como hecha`}
          description="Confirma que esta tarea ya está terminada."
          confirmLabel="Marcar como hecha"
          onClose={() => setPendingDone(null)}
          onConfirm={confirmDone}
        />
      )}
      {pendingReopen && (
        <ConfirmDialog
          title={`Reabrir ${pendingReopen.identifier}`}
          description="La tarea volverá al estado En progreso."
          confirmLabel="Reabrir tarea"
          onClose={() => setPendingReopen(null)}
          onConfirm={confirmReopen}
        />
      )}
    </>
  );
}

function getTargetStatus(
  overId: string,
  tasks: TaskResponseDto[],
): TaskStatus | null {
  if ((TASK_STATUSES as readonly string[]).includes(overId)) {
    return overId as TaskStatus;
  }
  const task = tasks.find((t) => t.id === overId);
  return task?.status ?? null;
}

function calculatePosition(
  tasks: TaskResponseDto[],
  activeId: string,
  targetStatus: TaskStatus,
  overId: string,
): number {
  const columnTasks = tasks
    .filter((t) => t.status === targetStatus && t.id !== activeId)
    .sort((a, b) => a.position - b.position);

  if (columnTasks.length === 0) return POSITION_GAP;

  const overIndex = columnTasks.findIndex((t) => t.id === overId);

  if (overIndex === -1) {
    const last = columnTasks[columnTasks.length - 1];
    return last ? last.position + POSITION_GAP : POSITION_GAP;
  }

  const before = overIndex > 0 ? columnTasks[overIndex - 1] : null;
  const after = columnTasks[overIndex];

  if (!before) return after!.position / 2;
  return (before.position + after!.position) / 2;
}
