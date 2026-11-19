import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import type { TaskResponseDto } from "@orbit/shared/types/responses";
import type { TaskStatus } from "@orbit/shared/schemas/task.schema";
import { KanbanCard } from "./KanbanCard";
import { TaskStatusBadge } from "./TaskStatusBadge";


export function KanbanColumn({
  status,
  tasks,
}: {
  status: TaskStatus;
  tasks: TaskResponseDto[];
}) {
  const { setNodeRef, isOver } = useDroppable({ id: status });

  return (
    <div className="bg-card flex flex-col min-h-125">
      <header className="px-3 py-2 border-b border-border flex items-center justify-between">
        <TaskStatusBadge status={status} />
        <span className="font-mono text-[10px] text-muted-foreground">
          {tasks.length}
        </span>
      </header>

      <div
        ref={setNodeRef}
        className={`flex-1 p-2 flex flex-col gap-2 transition-colors ${
          isOver ? "bg-accent/40" : ""
        }`}
      >
        <SortableContext
          items={tasks.map((t) => t.id)}
          strategy={verticalListSortingStrategy}
        >
          {tasks.map((task) => (
            <KanbanCard key={task.id} task={task} />
          ))}
        </SortableContext>

        {tasks.length === 0 && (
          <p className="text-xs text-muted-foreground text-center py-8">
            Sin tareas
          </p>
        )}
      </div>
    </div>
  );
}
