/**
 * Query keys centralizadas. Todas las queries y mutaciones del proyecto
 * las usan, no hay strings sueltos en el código.
 *
 * El patrón de arrays anidados permite invalidar por nivel:
 *   - `["auth"]` → invalida "me" y cualquier otra query de auth
 *   - `["auth", "me"]` → solo la query del user actual
 *   - `["workspaces", "acme"]` → solo el workspace "acme"
 */
export const queryKeys = {
  auth: {
    me: ["auth", "me"] as const,
  },
  workspaces: {
    all: ["workspaces"] as const,
    list: () => [...queryKeys.workspaces.all, "list"] as const,
    detail: (slug: string) => [...queryKeys.workspaces.all, "detail", slug] as const,
    members: (slug: string) => [...queryKeys.workspaces.all, "members", slug] as const,
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
      [...queryKeys.tasks.all, "detail", workspaceSlug, projectKey, number] as const,
  },
} as const;