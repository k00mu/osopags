import { NextFunction, Request, Response } from "express";
import { col, fn, Op } from "sequelize";

// Models
import { Track } from "../../../models/Track.ts";

// Contracts
import {
    CreateTrackRequest,
    CreateTrackResponse,
    SuccessResponse,
    TrackEventStats,
} from "@/types/api.ts";

// Errors
import { NotFoundError, ServiceUnavailableError } from "@/types/error.ts";
import { Device } from "@/models/Device.ts";

export class TrackController {
    /**
     * Creates a new track.
     * @route POST /tracks
     * @access Protected
     */
    static async create(
        req: Request<
            Record<string, never>,
            SuccessResponse<CreateTrackResponse>,
            CreateTrackRequest
        >,
        res: Response<SuccessResponse<CreateTrackResponse>>,
        next: NextFunction,
    ) {
        try {
            const { eventType, eventData, timestamp } = req.body;
            const { id } = req.deviceData!;

            const device = await Device.findByPk(id);

            if (!device) {
                throw new NotFoundError("Device not found");
            }

            const { gameClientId } = device;

            const event = await Track.create({
                deviceId: id,
                gameClientId,
                eventType,
                eventData,
                timestamp: timestamp ?? new Date(),
            });

            const response: SuccessResponse<CreateTrackResponse> = {
                status: "success",
                data: {
                    id: event.id,
                    deviceId: event.deviceId,
                    gameClientId: event.gameClientId,
                    eventType: event.eventType,
                    eventData: event.eventData ?? null,
                    timestamp: event.timestamp,
                },
                message: "Track event created successfully",
            };

            res.status(201).json(response);
        } catch (error) {
            next(error);
        }
    }

    /**
     * Retrieves tracks list based on query parameters.
     * @route GET /tracks
     * @access Protected
     */
    static async list(
        req: Request,
        res: Response<SuccessResponse<CreateTrackResponse[]>>,
        next: NextFunction,
    ) {
        try {
            res.status(200);
            // const { userId, gameClientId } = req.user!;
            const { type, from, to } = req.query;

            const whereClause: any = {
                // userId,
                // gameClientId,
            };

            if (type) {
                whereClause.eventType = type;
            }

            if (from || to) {
                whereClause.timestamp = {};
                if (from) {
                    whereClause.timestamp[Op.gte] = new Date(from as string);
                }
                if (to) {
                    whereClause.timestamp[Op.lte] = new Date(to as string);
                }
            }

            const events = await Track.findAll({
                where: whereClause,
                order: [["timestamp", "DESC"]],
                limit: 100,
            });

            const responseEvents: CreateTrackResponse[] = events.map(
                (event) => ({
                    id: event.id,
                    gameClientId: event.gameClientId,
                    deviceId: event.deviceId,
                    eventType: event.eventType,
                    eventData: event.eventData ?? null,
                    timestamp: event.timestamp,
                }),
            );

            const response: SuccessResponse<CreateTrackResponse[]> = {
                status: "success",
                data: responseEvents,
                message: "Track events retrieved successfully",
            };

            res.status(200).json(response);
        } catch (_error) {
            next(new ServiceUnavailableError("Failed to retrieve events"));
        }
    }

    /**
     * Retrieves track statistics.
     * @route GET /tracks/stats
     * @access Protected
     */
    static async getStats(
        req: Request,
        res: Response<SuccessResponse<TrackEventStats[]>>,
        next: NextFunction,
    ) {
        try {
            const { userId, gameClientId } = req.user!;
            const { from, to } = req.query;

            const whereClause: any = {
                userId,
                gameClientId,
            };

            if (from || to) {
                whereClause.timestamp = {};
                if (from) {
                    whereClause.timestamp[Op.gte] = new Date(from as string);
                }
                if (to) {
                    whereClause.timestamp[Op.lte] = new Date(to as string);
                }
            }

            const stats = await Track.findAll({
                where: whereClause,
                attributes: [
                    "eventType",
                    [fn("COUNT", col("id")), "count"],
                    [
                        fn("MIN", col("timestamp")),
                        "firstSeen",
                    ],
                    [
                        fn("MAX", col("timestamp")),
                        "lastSeen",
                    ],
                ],
                group: ["eventType"],
            });

            const responseStats: any = stats.map((stat) => ({
                eventType: stat.eventType,
                count: Number(stat.get("count")),
                firstSeen: stat.get("firstSeen"),
                lastSeen: stat.get("lastSeen"),
            }));

            const response: SuccessResponse<TrackEventStats[]> = {
                status: "success",
                data: responseStats,
                message: "Track statistics retrieved successfully",
            };

            res.status(200).json(response);
        } catch (_error) {
            next(
                new ServiceUnavailableError(
                    "Failed to retrieve track statistics",
                ),
            );
        }
    }
}
