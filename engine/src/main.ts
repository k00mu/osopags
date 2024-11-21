import { ENV } from "@/config/env.ts";
import express from "express";
import { iamRouter } from "./modules/iam/iam.router.ts";
import { analyticsRouter } from "./modules/analytics/analytics.router.ts";
import { monitoringRouter } from "./modules/monitoring/monitoring.router.ts";
import { errorHandler } from "@/middleware/errorHandler.ts";
import { initDatabase } from "@/config/database.ts";

const app = express();

await initDatabase();

app.use(express.json());

app.use("/v1/iam", iamRouter);
app.use("/v1/analytics", analyticsRouter);
app.use("/v1/monitoring", monitoringRouter);

// Error handling
app.use(errorHandler);

app.listen(ENV.PORT, () => {
    console.log(`Server running at http://localhost:${ENV.PORT}`);
});
