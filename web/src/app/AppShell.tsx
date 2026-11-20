import type { ReactNode } from "react";
import { useRouteContext } from "@tanstack/react-router";
import { WorkspaceRail } from "../features/workspaces/components/WorkspaceRail";
import { AppSidebar } from "../features/workspaces/components/AppSidebar";

export function AppShell({ children }: { children: ReactNode }) {
  const { auth } = useRouteContext({ from: "/_authenticated" });

  if (!auth.user) return null;

  return (
    <div className="flex h-screen overflow-hidden">
      <WorkspaceRail />
      <AppSidebar user={auth.user} />
      <main className="flex-1 overflow-auto bg-dots">{children}</main>
    </div>
  );
}
