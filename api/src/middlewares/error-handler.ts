import type { ErrorRequestHandler } from "express";
import { ZodError } from 'zod'
import { AppError } from "../errors/app-error";

export const errorHandler: ErrorRequestHandler = (err, _req, res, next) => {
    if (res.headersSent) return next(err)

    try {
        if (err instanceof AppError) {
            res.status(err.statusCode).json({
                error: { code: err.code, message: err.message, details: err.details }
            })
        } else if (err instanceof ZodError) {
            res.status(400).json({
                error: {
                    code: "VALIDATION_ERROR",
                    message: "Invalid data",
                    details: err.issues.map((i) => ({ path: i.path.join("."), message: i.message })),
                },
            });
        } else {
            console.error("Unhandled error:", err);
            res.status(500).json({
                error: { code: "INTERNAL_ERROR" },
            });
        }

    } catch (sendError) {
        console.error(sendError)
    }

}
