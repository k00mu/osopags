import { Router } from "express";
import { createEvent, getEvents } from "../controllers/eventController.ts";

const router = Router();

router.post("/", createEvent);
router.get("/", getEvents);

export default router;
