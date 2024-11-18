import express from "express";
import cors from "cors";

import Database from "./db.ts";

// routes
import acquisitionRoutes from "./routes/acquisitionRoutes.ts";
import eventRoutes from "./routes/eventRoutes.ts";
import projectRoutes from "./routes/projectRoutes.ts";

if (import.meta.main) {
    const app = express();
    const PORT = parseInt(Deno.env.get("ENGINE_PORT") || "3000");

    app.use(cors());
    app.use(express.json());

    Database.authenticate()
        .then(() => console.log("Database connected..."))
        .catch((err) => console.log("Error: " + err));
    Database.sync();

    app.get("/api", (_req: any, res: any) => {
        res.send("Engine Service is running");
    });

    app.use("/api/projects", projectRoutes);
    app.use("/api/acquisitions", acquisitionRoutes);
    app.use("/api/events", eventRoutes);

    app.listen(PORT, () => {
        console.log(`Engine Service is running on port ${PORT}`);
    });
}
