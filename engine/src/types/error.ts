export class AppError extends Error {
    constructor(
        public statusCode: number,
        public override message: string,
        public code: string,
        public details?: Record<string, unknown>,
    ) {
        super(message);
        this.name = "AppError";
        Object.setPrototypeOf(this, AppError.prototype);
    }
}

export class ValidationError extends AppError {
    constructor(message: string, details?: Record<string, unknown>) {
        super(400, message, "VALIDATION_ERROR", details);
        this.name = "ValidationError";
        Object.setPrototypeOf(this, ValidationError.prototype);
    }
}

export class AuthenticationError extends AppError {
    constructor(message: string = "Authentication failed") {
        super(401, message, "AUTHENTICATION_ERROR");
        this.name = "AuthenticationError";
        Object.setPrototypeOf(this, AuthenticationError.prototype);
    }
}

export class AuthorizationError extends AppError {
    constructor(message: string = "Permission denied") {
        super(403, message, "AUTHORIZATION_ERROR");
        this.name = "AuthorizationError";
        Object.setPrototypeOf(this, AuthorizationError.prototype);
    }
}

export class NotFoundError extends AppError {
    constructor(resource: string) {
        super(404, `${resource} not found`, "NOT_FOUND_ERROR");
        this.name = "NotFoundError";
        Object.setPrototypeOf(this, NotFoundError.prototype);
    }
}

export class ConflictError extends AppError {
    constructor(message: string) {
        super(409, message, "CONFLICT_ERROR");
        this.name = "ConflictError";
        Object.setPrototypeOf(this, ConflictError.prototype);
    }
}

export class RateLimitError extends AppError {
    constructor(message: string = "Too many requests") {
        super(429, message, "RATE_LIMIT_ERROR");
        this.name = "RateLimitError";
        Object.setPrototypeOf(this, RateLimitError.prototype);
    }
}

export class DatabaseError extends AppError {
    constructor(message: string, details?: Record<string, unknown>) {
        super(503, message, "DATABASE_ERROR", details);
        this.name = "DatabaseError";
        Object.setPrototypeOf(this, DatabaseError.prototype);
    }
}

export class ServiceUnavailableError extends AppError {
    constructor(service: string, details?: Record<string, unknown>) {
        super(
            503,
            `${service} service is currently unavailable`,
            "SERVICE_UNAVAILABLE",
            details,
        );
        this.name = "ServiceUnavailableError";
        Object.setPrototypeOf(this, ServiceUnavailableError.prototype);
    }
}

export class RequestTimeoutError extends AppError {
    constructor(message: string = "Request timed out") {
        super(408, message, "REQUEST_TIMEOUT");
        this.name = "RequestTimeoutError";
        Object.setPrototypeOf(this, RequestTimeoutError.prototype);
    }
}

export class PayloadTooLargeError extends AppError {
    constructor(message: string = "Payload too large") {
        super(413, message, "PAYLOAD_TOO_LARGE");
        this.name = "PayloadTooLargeError";
        Object.setPrototypeOf(this, PayloadTooLargeError.prototype);
    }
}

export class TooManyRequestsError extends AppError {
    constructor(
        message: string = "Too many requests",
        public retryAfter?: number,
    ) {
        super(429, message, "TOO_MANY_REQUESTS");
        this.name = "TooManyRequestsError";
        Object.setPrototypeOf(this, TooManyRequestsError.prototype);
    }
}

export class MaintenanceError extends AppError {
    constructor(message: string = "Service under maintenance") {
        super(503, message, "MAINTENANCE_MODE");
        this.name = "MaintenanceError";
        Object.setPrototypeOf(this, MaintenanceError.prototype);
    }
}

export class BadRequestError extends AppError {
    constructor(message: string) {
        super(400, message, "BAD_REQUEST");
        this.name = "BadRequestError";
        Object.setPrototypeOf(this, BadRequestError.prototype);
    }
}
