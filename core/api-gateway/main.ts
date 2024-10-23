import express from "express";
import { createProxyMiddleware } from "http-proxy-middleware";

if (import.meta.main) {
    const app = express();

    app.use(
        "/api/core",
        createProxyMiddleware({
            target: `http://localhost:${Deno.env.get("ENGINE_PORT")}`,
            changeOrigin: true,
        }),
    );
    app.use(
        "/api/analytics",
        createProxyMiddleware({
            target: `http://localhost:${
                Deno.env.get("SERVICE_ANALYTICS_PORT")
            }`,
            changeOrigin: true,
        }),
    );

    const PORT = parseInt(Deno.env.get("API_GATEWAY_PORT") || "8080");
    app.listen(PORT, () => {
        console.log(`API Gateway is running on port ${PORT}`);
    });
}
