import { NextFunction, Request, Response } from "express";
import { Op } from "sequelize";

// Utils
import { hashPassword } from "@/utils/crypto.ts";

// Models
import { User } from "@/models/User.ts";

// Contracts
import type {
    GetUserRequestParams,
    GetUserResponse,
    SuccessResponse,
    UpsertUserRequestBody,
    UpsertUserResponse,
} from "@/types/api.ts";

// Errors
import {
    BadRequestError,
    ConflictError,
    NotFoundError,
} from "@/types/error.ts";

export class UserController {
    static async create(
        req: Request<Record<string, never>, any, UpsertUserRequestBody>,
        res: Response<SuccessResponse<UpsertUserResponse>>,
        next: NextFunction,
    ) {
        try {
            const { username, email, password } = req.body;

            if (!username && !email) {
                throw new BadRequestError("Username or email is required");
            }

            const existingUser = await User.findOne({
                where: {
                    [Op.or]: [{ username }, { email }],
                },
            });

            if (existingUser) {
                throw new ConflictError("Username or email already exists");
            }

            const hashedPassword = await hashPassword(password);

            const user = await User.create({
                username,
                email,
                password: hashedPassword,
            });

            console.log(user);

            const response: SuccessResponse<UpsertUserResponse> = {
                status: "success",
                data: {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                },
            };

            return res.status(201).json(response);
        } catch (error) {
            next(error);
        }
    }

    static async get(
        req: Request<GetUserRequestParams, any, Record<string, never>>,
        res: Response<SuccessResponse<GetUserResponse>>,
        next: NextFunction,
    ) {
        try {
            const { id } = req.params;

            const user = await User.findByPk(id);

            if (!user) {
                throw new NotFoundError("User not found");
            }

            const response: SuccessResponse<GetUserResponse> = {
                status: "success",
                data: {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                },
            };

            return res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    }

    static async update(
        req: Request<GetUserRequestParams, any, UpsertUserRequestBody>,
        res: Response<SuccessResponse<UpsertUserResponse>>,
        next: NextFunction,
    ) {
        try {
            const { id } = req.params;
            const { username, email, password } = req.body;

            const user = await User.findByPk(id);

            if (!user) {
                throw new NotFoundError("User not found");
            }

            const updatedUser = await user.update({
                username,
                email,
                password,
            });

            const response: SuccessResponse<UpsertUserResponse> = {
                status: "success",
                data: {
                    id: updatedUser.id,
                    username: updatedUser.username,
                    email: updatedUser.email,
                },
            };

            return res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    }

    static async delete(
        req: Request<GetUserRequestParams, any, Record<string, never>>,
        res: Response<SuccessResponse<Record<string, never>>>,
        next: NextFunction,
    ) {
        try {
            const { id } = req.params;

            const user = await User.findByPk(id);

            if (!user) {
                throw new NotFoundError("User not found");
            }

            await user.destroy();

            const response: SuccessResponse<Record<string, never>> = {
                status: "success",
                data: {},
            };

            return res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    }
}
