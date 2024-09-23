import "reflect-metadata";
import express from "express";
import AppDataSource from "./data-source";
import { GameProject } from "./entity/GameProject";

const app = express();
const PORT = process.env.ENGINE_PORT || 3000;

app.use(express.json());

AppDataSource.initialize()
  .then(async () => {
    const gameProjectRepository = AppDataSource.getRepository(GameProject);

    app.get("/", (req, res) => {
      res.send("Engine Service is running");
    });

    app.post("/projects", async (req, res) => {
      const { name, description } = req.body;
      const gameProject = new GameProject();
      gameProject.name = name;
      gameProject.description = description;
      gameProject.createdAt = new Date();
      gameProject.updatedAt = new Date();

      await gameProjectRepository.save(gameProject);
      res.status(201).send(gameProject);
    });

    app.get("/projects", async (req, res) => {
      const projects = await gameProjectRepository.find();
      res.status(200).send(projects);
    });

    app.get("/projects/:id", async (req, res) => {
      const project = await gameProjectRepository.findOneBy({
        id: parseInt(req.params.id),
      });
      if (!project) {
        return res.status(404).send({ message: "Project not found" });
      }
      res.status(200).send(project);
    });

    app.put("/projects/:id", async (req, res) => {
      const project = await gameProjectRepository.findOneBy({
        id: parseInt(req.params.id),
      });
      if (!project) {
        return res.status(404).send({ message: "Project not found" });
      }

      const { name, description } = req.body;
      project.name = name;
      project.description = description;
      project.updatedAt = new Date();

      await gameProjectRepository.save(project);
      res.status(200).send(project);
    });

    app.delete("/projects/:id", async (req, res) => {
      const project = await gameProjectRepository.findOneBy({
        id: parseInt(req.params.id),
      });
      if (!project) {
        return res.status(404).send({ message: "Project not found" });
      }

      await gameProjectRepository.remove(project);
      res.status(204).send();
    });

    app.listen(PORT, () => {
      console.log(`Engine Service is running on port ${PORT}`);
    });
  })
  .catch((error) => console.log(error));
