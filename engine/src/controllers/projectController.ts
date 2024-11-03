import { Request, Response } from "express";
import Project from "../models/Project.ts";

export const createProject = async (req: Request, res: Response) => {
    const { name, description } = req.body;
    const gameProject = await Project.create({
        name,
        description,
        createdAt: new Date(),
        updatedAt: new Date(),
    });
    res.status(201).send(gameProject);
};

export const getProjects = async (_req: Request, res: Response) => {
    const projects = await Project.findAll();
    res.status(200).send(projects);
};

export const getProject = async (req: Request, res: Response) => {
    const project = await Project.findByPk(req.params.id);
    if (!project) {
        return res.status(404).send({ message: "Project not found" });
    }
    res.status(200).send(project);
};

export const updateProject = async (req: Request, res: Response) => {
    const { name, description } = req.body;
    const [updated] = await Project.update(
        { name, description, updatedAt: new Date() },
        { where: { id: req.params.id } },
    );

    if (!updated) {
        return res.status(404).send({ message: "Project not found" });
    }

    const updatedProject = await Project.findByPk(req.params.id);
    res.status(200).send(updatedProject);
};

export const deleteProject = async (req: Request, res: Response) => {
    const project = await Project.findByPk(req.params.id);
    if (!project) {
        return res.status(404).send({ message: "Project not found" });
    }

    await project.destroy();
    res.status(204).send();
};
