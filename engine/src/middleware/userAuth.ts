import { ENV } from "@/config/env.ts";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

// Services
import { RedisService } from "../services/RedisService.ts";

// Types
import { UserTokenPayload } from "@/types/token.ts";

// Errors
import { AuthenticationError } from "../types/error.ts";

export const userAuthMiddleware = async (
    req: Request,
    _res: Response,
    next: NextFunction,
) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader?.startsWith("Bearer ")) {
            throw new AuthenticationError("No token provided");
        }

        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, ENV.JWT_SECRET) as UserTokenPayload;
        const cachedToken = await RedisService.getUserToken(decoded.id);

        if (!cachedToken || cachedToken !== token) {
            throw new AuthenticationError("Invalid or expired token");
        }

        req.userData = decoded;
        next();
    } catch (error) {
        next(error);
    }
};
