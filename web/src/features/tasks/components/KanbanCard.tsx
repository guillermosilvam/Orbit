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
  canMove = true,
  isMine = false,
  onReopen,
}: {
  task: TaskResponseDto;
  isOverlay?: boolean;
  onClick?: () => void;
  members?: WorkspaceMemberResponseDto[];
  canMove?: boolean;
  isMine?: boolean;
  onReopen?: () => void;
}) {
  if (isOverlay) {
    return <CardBody task={task} members={members} isMine={isMine} />;
  }
  return (
    <SortableCard
      task={task}
      onClick={onClick}
      members={members}
      canMove={canMove}
      isMine={isMine}
      onReopen={onReopen}
    />
  );
}

function SortableCard({
  task,
  onClick,
  members,
  canMove,
  isMine,
  onReopen,
}: {
  task: TaskResponseDto;
  onClick?: () => void;
  members: WorkspaceMemberResponseDto[];
  canMove: boolean;
  isMine: boolean;
  onReopen?: () => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id, disabled: !canMove });

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.4 : 1,
      }}
      {...(canMove ? attributes : {})}
      {...(canMove ? listeners : {})}
      onClick={onClick}
      className={`group touch-pan-y ${canMove ? "cursor-grab active:cursor-grabbing" : ""}`}
    >
      <CardBody
        task={task}
        members={members}
        isMine={isMine}
        onReopen={onReopen}
      />
    </div>
  );
}

function CardBody({
  task,
  members,
  isMine = false,
  onReopen,
}: {
  task: TaskResponseDto;
  members: WorkspaceMemberResponseDto[];
  isMine?: boolean;
  onReopen?: () => void;
}) {
  const member = members.find((item) => item.userId === task.assigneeId);

  return (
    <div
      className={`flex flex-col gap-2 border border-border bg-card p-3 transition-all duration-150 ease-out motion-reduce:transition-none group-hover:border-primary/40 group-hover:shadow-sm ${
        isMine ? "border-l-2 border-l-primary bg-primary/[0.04]" : ""
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2">
          <span className="font-mono text-[10px] text-muted-foreground tabular">
            {task.identifier}
          </span>
          {isMine && (
            <span className="border border-primary/30 bg-primary/10 px-1 py-0.5 font-mono text-[9px] leading-none tracking-wide text-primary">
              TUYA
            </span>
          )}
        </div>
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
