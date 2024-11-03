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

    app.get("/", (_req: any, res: any) => {
        res.send("Engine Service is running");
    });

    app.use("/projects", projectRoutes);
    app.use("/acquisitions", acquisitionRoutes);
    app.use("/events", eventRoutes);

    app.listen(PORT, () => {
        console.log(`Engine Service is running on port ${PORT}`);
    });
}
