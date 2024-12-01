import express from "express";
import { TrackController } from "./controllers/track.controller.ts";
import { deviceAuthMiddleware } from "@/middleware/deviceAuth.ts";

const router = express.Router();

router.post("/tracks", deviceAuthMiddleware, TrackController.create);
router.get("/tracks", TrackController.list);
router.get("/tracks/stream", TrackController.streamList);

export { router as analyticRouter };
