import { Request, Response, Router } from "express";
import { ErrorMonitor } from "./errorMonitor.controller.ts";

const router = Router();

router.get("/errors", (_req: Request, res: Response) => {
    const metrics = ErrorMonitor.getInstance().getMetrics();
    res.json(metrics);
});

router.post("/errors/reset", (_req: Request, res: Response) => {
    ErrorMonitor.getInstance().reset();
    res.json({ message: "Error metrics reset successfully" });
});

export { router as monitoringRouter };
