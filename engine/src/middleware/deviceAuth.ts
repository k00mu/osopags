import { ENV } from "@/config/env.ts";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

// Services
import { RedisService } from "@/services/RedisService.ts";

// Models
import { Device } from "@/models/Device.ts";

// Types
import { DeviceTokenPayload } from "@/types/token.ts";

// Errors
import { AuthenticationError } from "@/types/error.ts";

export const deviceAuthMiddleware = async (
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
        const decoded = jwt.verify(token, ENV.JWT_SECRET) as DeviceTokenPayload;
        const cachedToken = await RedisService.getDeviceToken(
            decoded.id,
        );
        if (!cachedToken || cachedToken !== token) {
            throw new AuthenticationError("Invalid or expired token");
        }

        await Device.update(
            { lastActive: new Date() },
            { where: { id: decoded.id } },
        );

        req.deviceData = decoded;
        next();
    } catch (_error) {
        next(new AuthenticationError("Invalid token"));
    }
};
