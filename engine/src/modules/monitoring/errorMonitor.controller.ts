interface ErrorMetrics {
    count: number;
    lastOccurrence: Date;
    examples: Array<{
        message: string;
        stack?: string;
        timestamp: Date;
    }>;
}

export class ErrorMonitor {
    private static instance: ErrorMonitor;
    private metrics: Map<string, ErrorMetrics>;
    private readonly MAX_EXAMPLES = 5;

    private constructor() {
        this.metrics = new Map();
    }

    static getInstance(): ErrorMonitor {
        if (!ErrorMonitor.instance) {
            ErrorMonitor.instance = new ErrorMonitor();
        }
        return ErrorMonitor.instance;
    }

    trackError(error: Error): void {
        const errorType = error.name || "UnknownError";
        const current = this.metrics.get(errorType) || {
            count: 0,
            lastOccurrence: new Date(),
            examples: [],
        };

        current.count++;
        current.lastOccurrence = new Date();

        if (current.examples.length < this.MAX_EXAMPLES) {
            current.examples.push({
                message: error.message,
                stack: error.stack,
                timestamp: new Date(),
            });
        }

        this.metrics.set(errorType, current);
    }

    getMetrics(): Record<string, ErrorMetrics> {
        return Object.fromEntries(this.metrics);
    }

    reset(): void {
        this.metrics.clear();
    }
}
