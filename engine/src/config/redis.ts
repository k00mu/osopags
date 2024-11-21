import { ENV } from "./env.ts";
import { createClient } from "redis";

const redisClient = createClient({
    url: ENV.REDIS.URL,
});

await redisClient.connect();

export default redisClient;
