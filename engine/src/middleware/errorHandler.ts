import { NextFunction, Request, Response } from "express";
import { AppError, TooManyRequestsError } from "../types/error.ts";
import { ErrorMonitor } from "../modules/monitoring/errorMonitor.controller.ts";

interface ErrorResponse {
    status: string;
    code: string;
    message: string;
    details?: Record<string, unknown>;
    stack?: string;
    retryAfter?: number;
}

export const errorHandler = (
    err: Error,
    req: Request,
    res: Response<ErrorResponse>,
    _next: NextFunction,
) => {
    ErrorMonitor.getInstance().trackError(err);

    // Log error details
    console.error("Error:", {
        name: err.name,
        message: err.message,
        stack: err.stack,
        path: req.path,
        method: req.method,
    });

    // Default error response
    const response: ErrorResponse = {
        status: "error",
        code: "INTERNAL_SERVER_ERROR",
        message: "An unexpected error occurred",
    };

    // Handle known errors
    if (err instanceof AppError) {
        response.status = "error";
        response.code = err.code;
        response.message = err.message;
        response.details = err.details;

        if (err instanceof TooManyRequestsError && err.retryAfter) {
            response.retryAfter = err.retryAfter;
            res.set("Retry-After", err.retryAfter.toString());
        }

        // Include stack trace in development
        if (Deno.env.get("ENV") === "development") {
            response.stack = err.stack;
        }

        return res.status(err.statusCode).json(response);
    }

    // Handle payload size errors
    if (err.name === "PayloadTooLargeError") {
        response.code = "PAYLOAD_TOO_LARGE";
        response.message = "Request payload is too large";
        return res.status(413).json(response);
    }

    // Handle syntax errors
    if (err instanceof SyntaxError) {
        response.code = "INVALID_JSON";
        response.message = "Invalid JSON payload";
        return res.status(400).json(response);
    }

    // Include stack trace in development
    if (Deno.env.get("ENV") === "development") {
        response.stack = err.stack;
    }

    // Send generic error response
    res.status(500).json(response);
};
