import { NextFunction, Request, Response } from "express";
import { col, fn, Op } from "sequelize";

// Models
import { TelemetryEvent } from "@/models/TelemetryEvent.ts";

// Contracts
import {
    EventRequest,
    SuccessResponse,
    TelemetryEventResponse,
    TelemetryEventStats,
} from "@/types/api.ts";

// Errors
import { NotFoundError, ServiceUnavailableError } from "@/types/error.ts";
import { Device } from "@/models/Device.ts";

export class TelemetryController {
    /**
     * Creates a new telemetry event.
     * @route POST /telemetry
     * @access Protected
     */
    static async create(
        req: Request<
            Record<string, never>,
            SuccessResponse<TelemetryEventResponse>,
            EventRequest
        >,
        res: Response<SuccessResponse<TelemetryEventResponse>>,
        next: NextFunction,
    ) {
        try {
            const { eventType, eventData } = req.body;
            const { id } = req.deviceData!;

            const device = await Device.findByPk(id);

            if (!device) {
                throw new NotFoundError("Device not found");
            }

            const { gameClientId, userId } = device;

            const event = await TelemetryEvent.create({
                deviceId: id,
                gameClientId,
                userId: userId ?? null,
                eventType,
                eventData,
                timestamp: new Date(),
            });

            const response: SuccessResponse<TelemetryEventResponse> = {
                status: "success",
                data: {
                    id: event.id,
                    deviceId: event.deviceId,
                    gameClientId: event.gameClientId,
                    userId: event.userId,
                    eventType: event.eventType,
                    eventData: event.eventData,
                    timestamp: event.timestamp,
                },
                message: "Telemetry event created successfully",
            };

            res.status(201).json(response);
        } catch (error) {
            next(error);
        }
    }

    /**
     * Retrieves telemetry events based on query parameters.
     * @route GET /telemetry/events
     * @access Protected
     */
    static async getEvents(
        req: Request,
        res: Response<SuccessResponse<TelemetryEventResponse[]>>,
        next: NextFunction,
    ) {
        try {
            res.status(200);
            const { userId, gameClientId } = req.user!;
            const { type, from, to } = req.query;

            const whereClause: any = {
                userId,
                gameClientId,
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

            const events = await TelemetryEvent.findAll({
                where: whereClause,
                order: [["timestamp", "DESC"]],
                limit: 100,
            });

            const responseEvents: TelemetryEventResponse[] = events.map(
                (event) => ({
                    id: event.id,
                    gameClientId: event.gameClientId,
                    deviceId: event.deviceId,
                    userId: event.userId ?? null,
                    eventType: event.eventType,
                    eventData: event.eventData,
                    timestamp: event.timestamp,
                }),
            );

            const response: SuccessResponse<TelemetryEventResponse[]> = {
                status: "success",
                data: responseEvents,
                message: "Telemetry events retrieved successfully",
            };

            res.status(200).json(response);
        } catch (_error) {
            next(new ServiceUnavailableError("Failed to retrieve events"));
        }
    }

    /**
     * Retrieves telemetry event statistics.
     * @route GET /telemetry/stats
     * @access Protected
     */
    static async getEventStats(
        req: Request,
        res: Response<SuccessResponse<TelemetryEventStats[]>>,
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

            const stats = await TelemetryEvent.findAll({
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

            const response: SuccessResponse<TelemetryEventStats[]> = {
                status: "success",
                data: responseStats,
                message: "Telemetry event statistics retrieved successfully",
            };

            res.status(200).json(response);
        } catch (_error) {
            next(
                new ServiceUnavailableError(
                    "Failed to retrieve event statistics",
                ),
            );
        }
    }
}
