import { ENV } from "@/config/env.ts";
import redisClient from "@/config/redis.ts";
import { parseExpiry } from "@/utils/time.ts";

export class RedisService {
    private static readonly USER_TOKEN_PREFIX = "user_token:";
    private static readonly DEVICE_TOKEN_PREFIX = "device_token:";
    private static readonly RATE_LIMIT_PREFIX = "rate_limit:";

    // User token management
    static async setUserToken(userId: string, token: string): Promise<void> {
        await redisClient.set(
            `${this.USER_TOKEN_PREFIX}${userId}`,
            token,
            {
                EX: parseExpiry(ENV.JWT_USERSESSION_EXPIRY),
            },
        );
    }

    static async getUserToken(userId: string): Promise<string | null> {
        return await redisClient.get(`${this.USER_TOKEN_PREFIX}${userId}`);
    }

    static async invalidateUserToken(userId: string): Promise<void> {
        await redisClient.del(`${this.USER_TOKEN_PREFIX}${userId}`);
    }

    // Device token management
    static async setDeviceToken(
        deviceId: string,
        token: string,
    ): Promise<void> {
        await redisClient.set(
            `${this.DEVICE_TOKEN_PREFIX}${deviceId}`,
            token,
            {
                EX: parseExpiry(ENV.JWT_DEVICESESSION_EXPIRY),
            },
        );
    }

    static async getDeviceToken(deviceId: string): Promise<string | null> {
        return await redisClient.get(`${this.DEVICE_TOKEN_PREFIX}${deviceId}`);
    }

    static async invalidateDeviceToken(deviceId: string): Promise<void> {
        await redisClient.del(`${this.DEVICE_TOKEN_PREFIX}${deviceId}`);
    }

    // Rate limiting
    static async checkRateLimit(ip: string): Promise<boolean> {
        const key = `${this.RATE_LIMIT_PREFIX}${ip}`;
        const requests = await redisClient.incr(key);

        // Set expiry for new keys
        if (requests === 1) {
            await redisClient.expire(key, 60); // 1 minute window
        }

        return requests <= ENV.RATE_LIMIT.MAX_REQUESTS;
    }

    static async getRateLimitInfo(ip: string) {
        const key = `${this.RATE_LIMIT_PREFIX}${ip}`;
        const [requests, ttl] = await Promise.all([
            redisClient.get(key),
            redisClient.ttl(key),
        ]);

        const currentRequests = parseInt(requests || "0");

        return {
            remaining: Math.max(
                0,
                ENV.RATE_LIMIT.MAX_REQUESTS - currentRequests,
            ),
            resetTime: ttl > 0 ? ttl : 0,
        };
    }
}
