import type { ErrorRequestHandler } from "express";
import { ZodError } from 'zod'
import { AppError } from "../errors/app-error";

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
    if (err instanceof AppError) {
        res.status(err.statusCode).json({
            error: { code: err.code, message: err.message, details: err.details }
        })
    }

    if (err instanceof ZodError) {
        res.status(400).json({
            error: {
                code: "VALIDATION_ERROR",
                message: "Invalid data",
                details: err.issues.map((i) => ({ path: i.path.join("."), message: i.message })),
            },
        });
        return;
    }

    console.error("Unhandled error:", err);
    res.status(500).json({
        error: { code: "INTERNAL_ERROR" },
    });
}
