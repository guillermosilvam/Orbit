import type { ReactNode } from "react";
import { WorkspaceRail } from "../features/workspaces/components/WorkspaceRail";
import { AppSidebar } from "../features/workspaces/components/AppSideBar"


export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden">
      <WorkspaceRail />
      <AppSidebar />
      <main className="flex-1 overflow-auto bg-dots">{children}</main>
    </div>
  );
}