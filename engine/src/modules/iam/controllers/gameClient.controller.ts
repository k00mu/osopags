import { NextFunction, Request, Response } from "express";

// Models
import { GameClient } from "@/models/GameClient.ts";

// Contracts
import {
    GetGameClientRequestParams,
    GetGameClientResponse,
    SuccessResponse,
    UpsertGameClientRequestBody,
    UpsertGameClientResponse,
} from "@/types/api.ts";

// Errors
import { NotFoundError } from "@/types/error.ts";

export class GameClientController {
    static async create(
        req: Request<Record<string, never>, any, UpsertGameClientRequestBody>,
        res: Response<SuccessResponse<UpsertGameClientResponse>>,
        next: NextFunction,
    ) {
        try {
            const { gameName, gameNamespace } = req.body;

            const gameClient = await GameClient.create({
                gameName,
                gameNamespace,
            });

            const response: SuccessResponse<UpsertGameClientResponse> = {
                status: "success",
                data: {
                    id: gameClient.id,
                    gameName: gameClient.gameName,
                    gameNamespace: gameClient.gameNamespace,
                },
            };

            res.status(201).json(response);
        } catch (error) {
            next(error);
        }
    }

    static async list(
        _req: Request<Record<string, never>, any, Record<string, never>>,
        res: Response<SuccessResponse<GetGameClientResponse[]>>,
        next: NextFunction,
    ) {
        try {
            const gameClients = await GameClient.findAll({
                order: [["createdAt", "DESC"]],
            });

            const response: SuccessResponse<GetGameClientResponse[]> = {
                status: "success",
                data: gameClients.map((gameClient) => ({
                    id: gameClient.id,
                    gameName: gameClient.gameName,
                    gameNamespace: gameClient.gameNamespace,
                })),
            };

            res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    }

    static async get(
        req: Request<GetGameClientRequestParams, any, Record<string, never>>,
        res: Response<SuccessResponse<GetGameClientResponse>>,
        next: NextFunction,
    ) {
        try {
            const { id } = req.params;

            const gameClient = await GameClient.findByPk(id);

            if (!gameClient) {
                throw new NotFoundError("Game client not found");
            }

            const response: SuccessResponse<GetGameClientResponse> = {
                status: "success",
                data: {
                    id: gameClient.id,
                    gameName: gameClient.gameName,
                    gameNamespace: gameClient.gameNamespace,
                },
            };

            res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    }

    static async update(
        req: Request<
            GetGameClientRequestParams,
            any,
            UpsertGameClientRequestBody
        >,
        res: Response<SuccessResponse<UpsertGameClientResponse>>,
        next: NextFunction,
    ) {
        try {
            const { id } = req.params;
            const { gameName, gameNamespace } = req.body;

            const gameClient = await GameClient.findByPk(id);

            if (!gameClient) {
                throw new NotFoundError("Game client not found");
            }

            const updatedGameClient = await gameClient.update({
                gameName,
                gameNamespace,
            });

            const response: SuccessResponse<UpsertGameClientResponse> = {
                status: "success",
                data: {
                    id: updatedGameClient.id,
                    gameName: updatedGameClient.gameName,
                    gameNamespace: updatedGameClient.gameNamespace,
                },
            };

            res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    }

    static async delete(
        req: Request<GetGameClientRequestParams, any, Record<string, never>>,
        res: Response<SuccessResponse<Record<string, never>>>,
        next: NextFunction,
    ) {
        try {
            const { id } = req.params;

            const gameClient = await GameClient.findByPk(id);

            if (!gameClient) {
                throw new NotFoundError("Game client not found");
            }

            await gameClient.destroy();

            const response: SuccessResponse<Record<string, never>> = {
                status: "success",
                data: {},
            };

            res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    }
}
