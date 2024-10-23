import express from "express";
import acquisitionRoutes from "./routes/acquisitionRoutes.ts";
import eventRoutes from "./routes/eventRoutes.ts";
import Database from "./db.ts";

if (import.meta.main) {
    const app = express();
    const PORT = parseInt(Deno.env.get("SERVICE_ANALYTICS_PORT") || "3001");

    app.use(express.json());

    Database.authenticate()
        .then(() => console.log("Database connected..."))
        .catch((err) => console.log("Error: " + err));
    Database.sync();

    app.use("/acquisitions", acquisitionRoutes);
    app.use("/events", eventRoutes);

    app.listen(PORT, () => {
        console.log(`Analytics Service is running on port ${PORT}`);
    });
}
