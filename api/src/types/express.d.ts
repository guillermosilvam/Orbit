import type { User } from "../entities/user.entity.ts";
import type { Workspace } from "../entities/workspace.entity.ts";
import type { WorkspaceMember } from "../entities/workspace-member.entity.ts";

declare global {
  namespace Express {
    interface Request {
      user?: User;
      workspace?: Workspace;
      member?: WorkspaceMember;
    }
  }
}

export {};