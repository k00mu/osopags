import { ENV } from "@/config/env.ts";
import { NextFunction, Request, Response } from "express";
import { RedisService } from "../services/RedisService.ts";
import { TooManyRequestsError } from "../types/error.ts";

export const rateLimit = (
    requestsPerMinute: number = ENV.RATE_LIMIT.MAX_REQUESTS,
) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const ip = req.ip;
            const isWithinLimit = await RedisService.checkRateLimit(ip);

            // Get rate limit info for headers
            const rateLimitInfo = await RedisService.getRateLimitInfo(ip);

            // Add rate limit headers
            res.setHeader('X-RateLimit-Limit', requestsPerMinute.toString());
            res.setHeader('X-RateLimit-Remaining', rateLimitInfo.remaining.toString());
            res.setHeader('X-RateLimit-Reset', rateLimitInfo.resetTime.toString());

            if (!isWithinLimit) {
                throw new TooManyRequestsError(
                    "Too many requests, please try again later",
                    rateLimitInfo.resetTime
                );
            }

            next();
        } catch (error) {
            next(error);
        }
    };
};
