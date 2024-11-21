export const ENV = {
    // Server
    NODE_ENV: Deno.env.get("NODE_ENV") || "development",
    PORT: parseInt(Deno.env.get("ENGINE_PORT") || "3000"),

    // Authentication
    JWT_SECRET: Deno.env.get("JWT_SECRET") || "your-secret-key",
    JWT_USERSESSION_EXPIRY: "1h",
    JWT_DEVICESESSION_EXPIRY: "1h",
    BCRYPT_SALT_ROUNDS: 10,

    // Redis
    REDIS: {
        HOST: Deno.env.get("REDIS_HOST") || "redis",
        PORT: parseInt(Deno.env.get("REDIS_PORT") || "6379"),
        URL: `redis://${Deno.env.get("REDIS_HOST") || "redis"}:${
            Deno.env.get("REDIS_PORT") || "6379"
        }`,
    },

    // PostgreSQL
    POSTGRES: {
        USER: Deno.env.get("POSTGRES_USER") || "user",
        PASSWORD: Deno.env.get("POSTGRES_PASSWORD") || "password",
        HOST: Deno.env.get("POSTGRES_HOST") || "db",
        PORT: parseInt(Deno.env.get("POSTGRES_PORT") || "5432"),
        DB: Deno.env.get("POSTGRES_DB") || "osopags",
    },

    // Rate Limiting
    RATE_LIMIT: {
        WINDOW_MS: 60 * 1000, // 1 minute
        MAX_REQUESTS: 60,
    },

    // Timeouts
    TIMEOUTS: {
        REQUEST: 30, // seconds
        DB_QUERY: 10, // seconds
    },
};
