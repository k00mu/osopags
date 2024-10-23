import express from "express";
import Database from "./db.ts";
import GameProject from "./models/GameProject.ts";

if (import.meta.main) {
    const app = express();
    const PORT = parseInt(Deno.env.get("ENGINE_PORT") || "3000");

    app.use(express.json());

    Database.authenticate()
        .then(() => console.log("Database connected..."))
        .catch((err) => console.log("Error: " + err));
    Database.sync();

    app.get("/", (_req: any, res: any) => {
        res.send("Engine Service is running");
    });

    app.post("/projects", async (req: any, res: any) => {
        const { name, description } = req.body;
        const gameProject = await GameProject.create({
            name,
            description,
            createdAt: new Date(),
            updatedAt: new Date(),
        });
        res.status(201).send(gameProject);
    });

    app.get("/projects", async (_req: any, res: any) => {
        const projects = await GameProject.findAll();
        res.status(200).send(projects);
    });

    app.get("/projects/:id", async (req: any, res: any) => {
        const project = await GameProject.findByPk(req.params.id);
        if (!project) {
            return res.status(404).send({ message: "Project not found" });
        }
        res.status(200).send(project);
    });

    app.put("/projects/:id", async (req: any, res: any) => {
        const { name, description } = req.body;
        const [updated] = await GameProject.update(
            { name, description, updatedAt: new Date() },
            { where: { id: req.params.id } },
        );

        if (!updated) {
            return res.status(404).send({ message: "Project not found" });
        }

        const updatedProject = await GameProject.findByPk(req.params.id);
        res.status(200).send(updatedProject);
    });

    app.delete("/projects/:id", async (req: any, res: any) => {
        const project = await GameProject.findByPk(req.params.id);
        if (!project) {
            return res.status(404).send({ message: "Project not found" });
        }

        await project.destroy();
        res.status(204).send();
    });

    app.listen(PORT, () => {
        console.log(`Engine Service is running on port ${PORT}`);
    });
}
