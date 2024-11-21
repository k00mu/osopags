import { NextFunction, Request, Response } from "express";
import { AnyZodObject, ZodError } from "zod";
import { ValidationError } from "../types/error.ts";

export const validateRequest = (schema: AnyZodObject) => {
    return async (req: Request, _res: Response, next: NextFunction) => {
        try {
            await schema.parseAsync({
                body: req.body,
                query: req.query,
                params: req.params,
            });
            next();
        } catch (error) {
            if (error instanceof ZodError) {
                next(
                    new ValidationError("Invalid request data", {
                        errors: error.errors.map((err) => ({
                            path: err.path.join("."),
                            message: err.message,
                        })),
                    }),
                );
            } else {
                next(error);
            }
        }
    };
};
