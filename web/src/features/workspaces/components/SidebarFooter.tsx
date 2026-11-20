import { LogOut } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import type { UserResponseDto } from "@orbit/shared/types/responses";
import { useLogout } from "../../auth/hooks/use-logout";

export function SidebarFooter({ user }: { user: UserResponseDto }) {
  const logout = useLogout();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout.mutateAsync();
    navigate({ to: "/login", search: { redirect: undefined } });
  };

  return (
    <div className="space-y-2 border-t border-border p-3">
      <div className="flex items-center gap-2 px-1 py-1">
        <div className="size-8 bg-card border border-border flex items-center justify-center font-semibold text-xs text-foreground shrink-0">
          {initials(user.name)}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-foreground truncate">
            {user.name}
          </p>
          <p className="text-[10px] text-muted-foreground truncate">
            {user.email}
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={handleLogout}
        disabled={logout.isPending}
        className="w-full flex items-center gap-2 px-2 py-1.5 text-xs text-muted-foreground hover:text-destructive hover:bg-destructive/5 transition-colors disabled:opacity-50"
      >
        <LogOut className="size-3.5" />
        <span>{logout.isPending ? "Cerrando sesión…" : "Cerrar sesión"}</span>
      </button>
    </div>
  );
}

function initials(name: string): string {
  return name
    .split(/\s+/)
    .map((s) => s.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase();
}
