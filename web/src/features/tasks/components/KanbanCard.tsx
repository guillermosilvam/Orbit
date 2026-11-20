import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { TaskResponseDto } from "@orbit/shared/types/responses";
import { TaskPriorityBadge } from "./TaskPriorityBadge";

export function KanbanCard({
  task,
  isOverlay = false,
  onClick,
}: {
  task: TaskResponseDto;
  isOverlay?: boolean;
  onClick?: () => void;
}) {
  if (isOverlay) {
    return <CardBody task={task} />;
  }
  return <SortableCard task={task} onClick={onClick} />;
}

function SortableCard({
  task,
  onClick,
}: {
  task: TaskResponseDto;
  onClick?: () => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.4 : 1,
      }}
      {...attributes}
      {...listeners}
      onClick={onClick}
      className="group cursor-grab active:cursor-grabbing touch-none"
    >
      <CardBody task={task} />
    </div>
  );
}

function CardBody({ task }: { task: TaskResponseDto }) {
  return (
    <div className="border border-border bg-card p-3 flex flex-col gap-2 transition-all duration-150 ease-out motion-reduce:transition-none group-hover:border-primary/40 group-hover:shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <span className="font-mono text-[10px] text-muted-foreground tabular">
          {task.identifier}
        </span>
        <TaskPriorityBadge priority={task.priority} />
      </div>
      <p className="text-sm text-foreground line-clamp-2">{task.title}</p>
    </div>
  );
}
