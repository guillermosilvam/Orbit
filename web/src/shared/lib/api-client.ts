export class ApiError extends Error {
  public readonly code: string;
  public readonly status: number;
  public readonly details?: unknown;

  constructor(code: string, status: number, message: string, details?: unknown) {
    super(message);
    this.name = "ApiError";
    this.code = code;
    this.status = status;
    this.details = details;
  }
}

type RequestOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
};

/**
 * Cliente HTTP centralizado. Todos los features lo usan.
 *
 * - `credentials: "include"` → envía la cookie `session` en cada petición.
 *   Sin esto, el backend responde 401 en todo lo protegido.
 * - Prefija `/api` → Vite lo proxea a `http://localhost:3000` en dev.
 * - Parsea el error del backend y lo lanza como `ApiError`.
 * - En 204 (sin body), devuelve `null` para no romper `res.json()`.
 *
 * @example
 *   await apiClient<UserResponse>("/auth/me");
 *   await apiClient("/auth/login", { method: "POST", body: { email, password } });
 */
export async function apiClient<T = unknown>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const { body, headers, ...rest } = options;

  const response = await fetch(`/api${path}`, {
    ...rest,
    credentials: "include",
    headers: {
      ...(body !== undefined ? { "Content-Type": "application/json" } : {}),
      ...headers,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (response.status === 204) return null as T;

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const err = (data as { error?: { code: string; message: string; details?: unknown } }).error;
    throw new ApiError(
      err?.code ?? "INTERNAL_ERROR",
      response.status,
      err?.message ?? "Request failed",
      err?.details,
    );
  }

  return data as T;
}