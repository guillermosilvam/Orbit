import { UserRound } from "lucide-react";
import type { WorkspaceMemberResponseDto } from "@orbit/shared/types/responses";

type Props = {
  member?: WorkspaceMemberResponseDto;
  assigned?: boolean;
  size?: "sm" | "md";
};

export function TaskAssigneeAvatar({
  member,
  assigned = false,
  size = "md",
}: Props) {
  const sizeClass = size === "sm" ? "size-6 text-[9px]" : "size-7 text-[10px]";

  if (!member) {
    const label = assigned ? "Persona asignada" : "Sin asignar";
    return (
      <span
        className={`inline-flex shrink-0 items-center justify-center border border-border bg-background text-muted-foreground ${sizeClass}`}
        title={label}
        aria-label={label}
      >
        <UserRound className="size-3.5" />
      </span>
    );
  }

  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center border border-primary/20 bg-primary/10 font-medium text-primary ${sizeClass}`}
      title={member.user.name}
      aria-label={`Asignada a ${member.user.name}`}
    >
      {getInitials(member.user.name)}
    </span>
  );
}

function getInitials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]!.toUpperCase())
    .join("");
}
