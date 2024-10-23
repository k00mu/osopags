import { Router } from "express";
import { createAcquisition, getAcquisitions } from "../controllers/acquisitionController.ts";

const router = Router();

router.post("/", createAcquisition);
router.get("/", getAcquisitions);

export default router;
