export type ErrorCode =
  | "VALIDATION_ERROR"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "CONFLICT"
  | "INTERNAL_ERROR";


export class AppError extends Error {
  constructor(
    public readonly code: ErrorCode,
    public readonly statusCode: number,
    message: string,
    public readonly details?: unknown,
  ) {
    super(message);
    this.name = "AppError";
  }

  static notFound(message = "Recurso no encontrado") {
    return new AppError("NOT_FOUND", 404, message);
  }
  static unauthorized(message = "No autenticado") {
    return new AppError("UNAUTHORIZED", 401, message);
  }
  static forbidden(message = "No autorizado") {
    return new AppError("FORBIDDEN", 403, message);
  }
  static conflict(message: string) {
    return new AppError("CONFLICT", 409, message);
  }
}