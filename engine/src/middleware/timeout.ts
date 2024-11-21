import { NextFunction, Request, Response } from "express";
import { RequestTimeoutError } from "../types/error.ts";

export const timeout = (seconds: number) => {
    return (_req: Request, res: Response, next: NextFunction) => {
        const timeoutId = setTimeout(() => {
            next(new RequestTimeoutError());
        }, seconds * 1000);

        res.on("finish", () => {
            clearTimeout(timeoutId);
        });

        next();
    };
};
