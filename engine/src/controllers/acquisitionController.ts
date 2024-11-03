import { Request, Response } from "express";
import Acquisition, { EventType } from "../models/Acquisition.ts";

export const createAcquisition = async (req: Request, res: Response) => {
    const { eventType, gameProjectId } = req.body;

    if (!Object.values(EventType).includes(eventType)) {
        return res.status(400).send({ message: "Invalid event type" });
    }

    // TODO: validate gameProjectId

    const userAcquisition = await Acquisition.create({
        eventType,
        gameProjectId,
        createdAt: new Date(),
    });

    res.status(201).send(userAcquisition);
};

export const getAcquisitions = async (_req: Request, res: Response) => {
    const acquisitions = await Acquisition.findAll();
    res.status(200).send(acquisitions);
};
