export const queryKeys = {
  auth: {
    me: ["auth", "me"] as const,
  },
  activity: {
    all: ["activity"] as const,
    recent: (workspaceSlug: string, limit: number) =>
      [...queryKeys.activity.all, "recent", workspaceSlug, limit] as const,
  },
  workspaces: {
    all: ["workspaces"] as const,
    list: () => [...queryKeys.workspaces.all, "list"] as const,
    detail: (slug: string) =>
      [...queryKeys.workspaces.all, "detail", slug] as const,
    members: (slug: string) =>
      [...queryKeys.workspaces.all, "members", slug] as const,
    invitations: (slug: string) =>
      [...queryKeys.workspaces.all, "invitations", slug] as const,
  },
  projects: {
    all: ["projects"] as const,
    list: (workspaceSlug: string) =>
      [...queryKeys.projects.all, "list", workspaceSlug] as const,
    detail: (workspaceSlug: string, key: string) =>
      [...queryKeys.projects.all, "detail", workspaceSlug, key] as const,
  },
  tasks: {
    all: ["tasks"] as const,
    list: (workspaceSlug: string, projectKey: string) =>
      [...queryKeys.tasks.all, "list", workspaceSlug, projectKey] as const,
    detail: (workspaceSlug: string, projectKey: string, number: number) =>
      [
        ...queryKeys.tasks.all,
        "detail",
        workspaceSlug,
        projectKey,
        number,
      ] as const,
  },
} as const;