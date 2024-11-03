import { Router } from "express";
import {
    createProject,
    deleteProject,
    getProject,
    getProjects,
    updateProject,
} from "../controllers/projectController.ts";

const router = Router();

router.post("/", createProject);
router.get("/", getProjects);
router.get("/:id", getProject);
router.put("/:id", updateProject);
router.delete("/:id", deleteProject);

export default router;
