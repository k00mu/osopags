import { Router } from "express";
import {
    createProject,
    deleteProject,
    getProject,
    getProjects,
    updateProject,
    updateApiKey,
} from "../controllers/projectController.ts";

const router = Router();

router.post("/", createProject);
router.get("/", getProjects);
router.get("/:id", getProject);
router.put("/:id", updateProject);
router.delete("/:id", deleteProject);
router.patch("/:id/apiKey", updateApiKey);

export default router;
