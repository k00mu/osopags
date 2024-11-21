import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

// Config
import { ENV } from "@/config/env.ts";

// Services
import { RedisService } from "@/services/RedisService.ts";

// Utils
import { verifyPassword } from "@/utils/crypto.ts";

// Models
import { User } from "@/models/User.ts";
import { GameClient } from "@/models/GameClient.ts";
import { Device } from "@/models/Device.ts";

// Contracts
import type {
    AuthDeviceRequestBody,
    AuthDeviceResponse,
    AuthUserRequestBody,
    AuthUserResponse,
    LinkDeviceToUserRequestBody,
    SuccessResponse,
} from "@/types/api.ts";
import { Op } from "sequelize";

// Errors
import {
    AuthenticationError,
    ConflictError,
    NotFoundError,
} from "@/types/error.ts";

export class AuthController {
    static async authUser(
        req: Request<Record<string, never>, any, AuthUserRequestBody>,
        res: Response<SuccessResponse<AuthUserResponse>>,
        next: NextFunction,
    ) {
        try {
            const { username, email, password } = req.body;

            const user = await User.findOne({
                where: {
                    [Op.or]: [
                        { username: username || "" },
                        { email: email || "" },
                    ],
                },
            });

            if (!user) {
                throw new AuthenticationError("Invalid user credentials");
            }

            const isValidPassword = await verifyPassword(
                password,
                user.password,
            );

            if (!isValidPassword) {
                throw new AuthenticationError("Invalid user credentials");
            }

            const userToken = jwt.sign(
                { id: user.id },
                ENV.JWT_SECRET,
                { expiresIn: ENV.JWT_USERSESSION_EXPIRY },
            );

            await RedisService.setUserToken(user.id, userToken);

            const response: SuccessResponse<AuthUserResponse> = {
                status: "success",
                data: {
                    userToken,
                },
            };

            res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    }

    static async authDevice(
        req: Request<Record<string, never>, any, AuthDeviceRequestBody>,
        res: Response<SuccessResponse<AuthDeviceResponse>>,
        next: NextFunction,
    ) {
        try {
            const { machine_id, client_id } = req.body;

            const gameClient = await GameClient.findOne({
                where: {
                    id: client_id,
                },
            });

            if (!gameClient) {
                throw new AuthenticationError("Invalid client credentials");
            }

            const [device] = await Device.upsert({
                gameClientId: client_id,
                machineId: machine_id,
                lastActive: new Date(),
            });

            const deviceToken = jwt.sign(
                {
                    id: device.id,
                },
                ENV.JWT_SECRET,
                { expiresIn: ENV.JWT_DEVICESESSION_EXPIRY },
            );

            await RedisService.setDeviceToken(device.id, deviceToken);

            const response: SuccessResponse<AuthDeviceResponse> = {
                status: "success",
                data: {
                    deviceToken,
                },
            };

            res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    }

    // FIXME: Think about it later
    static async linkDeviceToUser(
        req: Request<Record<string, never>, any, LinkDeviceToUserRequestBody>,
        res: Response,
        next: NextFunction,
    ) {
        try {
            const { deviceSessionId } = req.body;

            const userId = req.user?.userId;

            if (!userId) {
                throw new AuthenticationError("User ID not found in token");
            }

            const device = await Device.findOne({
                where: {
                    id: deviceSessionId,
                },
            });

            if (!device) {
                throw new NotFoundError("Device session not found");
            }

            if (device.userId) {
                throw new ConflictError("Device already linked to a user");
            }

            await device.update({
                userId,
            });

            const deviceToken = jwt.sign(
                {
                    deviceId: device.machineId,
                    gameClientId: device.gameClientId,
                    userId,
                    isAnonymous: false,
                },
                ENV.JWT_SECRET,
                { expiresIn: ENV.JWT_DEVICESESSION_EXPIRY },
            );

            await RedisService.setDeviceToken(deviceSessionId, deviceToken);

            const response: SuccessResponse<AuthDeviceResponse> = {
                status: "success",
                data: {
                    deviceToken,
                },
            };

            res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    }

    static async unauth(
        req: Request,
        res: Response,
        next: NextFunction,
    ) {
        try {
            const userSessionId = req.user?.userId;
            const deviceSessionId = req.user?.sessionId;

            if (userSessionId) {
                await RedisService.invalidateUserToken(userSessionId);
            }

            if (deviceSessionId) {
                await RedisService.invalidateDeviceToken(deviceSessionId);
            }

            const response: SuccessResponse<null> = {
                status: "success",
                data: null,
            };

            res.status(204).json(response);
        } catch (error) {
            next(error);
        }
    }
}
