import express from "express";
import { TrackController } from "./controllers/track.controller.ts";
import { deviceAuthMiddleware } from "@/middleware/deviceAuth.ts";

const router = express.Router();

router.use(deviceAuthMiddleware);

router.post("/tracks", TrackController.create);
router.get("/tracks", TrackController.list);

export { router as analyticRouter };
