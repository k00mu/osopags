import express from "express";
import { TelemetryController } from "./controllers/telemetry.controller.ts";
import { deviceAuthMiddleware } from "@/middleware/deviceAuth.ts";

const router = express.Router();

router.use(deviceAuthMiddleware); // Protect all analytics routes

router.post("/events", TelemetryController.create);

export { router as analyticsRouter };
