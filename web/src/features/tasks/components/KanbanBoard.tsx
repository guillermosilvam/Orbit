import { useState } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
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
import { KanbanColumn } from "./KanbanColumn";
import { KanbanCard } from "./KanbanCard";
import { useUpdateTask } from "../hooks/use-update-task";

const POSITION_GAP = 1000;

export function KanbanBoard({
  tasks,
  workspaceSlug,
  projectKey,
  onSelectTask,
}: {
  tasks: TaskResponseDto[];
  workspaceSlug: string;
  projectKey: string;
  onSelectTask: (task: TaskResponseDto) => void;
}) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const updateTask = useUpdateTask(workspaceSlug, projectKey);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
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

    const newPosition = calculatePosition(
      tasks,
      activeTask.id,
      targetStatus,
      over.id as string,
    );

    updateTask.mutate({
      id: activeTask.id,
      number: activeTask.number,
      status: targetStatus,
      position: newPosition,
    });

    setActiveId(null);
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <div className="grid grid-cols-3 gap-px bg-border border border-border">
        {TASK_STATUSES.map((status) => (
          <KanbanColumn
            key={status}
            status={status}
            tasks={tasks
              .filter((t) => t.status === status)
              .sort((a, b) => a.position - b.position)}
            onSelectTask={onSelectTask}
          />
        ))}
      </div>

      <DragOverlay>
        {activeTask ? <KanbanCard task={activeTask} isOverlay /> : null}
      </DragOverlay>
    </DndContext>
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
