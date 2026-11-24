import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { TaskResponseDto } from "@orbit/shared/types/responses";
import type { WorkspaceMemberResponseDto } from "@orbit/shared/types/responses";
import { TaskPriorityBadge } from "./TaskPriorityBadge";
import { TaskAssigneeAvatar } from "./TaskAssigneeAvatar";
import { DueDateBadge } from "./DueDateBadge";

export function KanbanCard({
  task,
  isOverlay = false,
  onClick,
  members = [],
  onReopen,
}: {
  task: TaskResponseDto;
  isOverlay?: boolean;
  onClick?: () => void;
  members?: WorkspaceMemberResponseDto[];
  onReopen?: () => void;
}) {
  if (isOverlay) {
    return <CardBody task={task} members={members} />;
  }
  return (
    <SortableCard
      task={task}
      onClick={onClick}
      members={members}
      onReopen={onReopen}
    />
  );
}

function SortableCard({
  task,
  onClick,
  members,
  onReopen,
}: {
  task: TaskResponseDto;
  onClick?: () => void;
  members: WorkspaceMemberResponseDto[];
  onReopen?: () => void;
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
      className="group cursor-grab touch-pan-y active:cursor-grabbing"
    >
      <CardBody task={task} members={members} onReopen={onReopen} />
    </div>
  );
}

function CardBody({
  task,
  members,
  onReopen,
}: {
  task: TaskResponseDto;
  members: WorkspaceMemberResponseDto[];
  onReopen?: () => void;
}) {
  const member = members.find((item) => item.userId === task.assigneeId);

  return (
    <div className="flex flex-col gap-2 border border-border bg-card p-3 transition-all duration-150 ease-out motion-reduce:transition-none group-hover:border-primary/40 group-hover:shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <span className="font-mono text-[10px] text-muted-foreground tabular">
          {task.identifier}
        </span>
        <TaskPriorityBadge priority={task.priority} />
      </div>
      <p className="text-sm text-foreground line-clamp-2">{task.title}</p>
      <div className="flex min-h-6 items-center justify-between gap-2">
        <TaskAssigneeAvatar
          member={member}
          assigned={Boolean(task.assigneeId)}
          size="sm"
        />
        <div className="flex items-center gap-2">
          {onReopen && (
            <button
              type="button"
              onPointerDown={(event) => event.stopPropagation()}
              onClick={(event) => {
                event.stopPropagation();
                onReopen();
              }}
              className="text-[11px] font-medium text-muted-foreground hover:text-foreground"
            >
              Reabrir
            </button>
          )}
          <DueDateBadge dueDate={task.dueDate} status={task.status} compact />
        </div>
      </div>
    </div>
  );
}
