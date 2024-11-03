import { Request, Response } from "express";
import Event from "../models/Event.ts";

export const createEvent = async (req: Request, res: Response) => {
    const { eventName, eventData, gameProjectId } = req.body;

    // TODO: validate gameProjectId with the engine service if necessary

    const customEvent = await Event.create({
        eventName,
        eventData,
        gameProjectId,
        createdAt: new Date(),
        updatedAt: new Date(),
    });

    res.status(201).send(customEvent);
};

export const getEvents = async (_req: Request, res: Response) => {
    const events = await Event.findAll();
    res.status(200).send(events);
};
