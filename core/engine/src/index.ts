import "reflect-metadata";
import { DataSource } from "typeorm";
import express from "express";
import { GameProject } from "./entity/GameProject";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

const AppDataSource = new DataSource({
  type: "postgres",
  host: "db",
  port: 5432,
  username: "user",
  password: "password",
  database: "osopags",
  synchronize: true,
  logging: false,
  entities: [GameProject],
  migrations: [],
  subscribers: [],
});

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
