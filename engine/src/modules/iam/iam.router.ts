import express from "express";

// Middleware

// Schemas
// import {
//     authDeviceSchema,
//     authUserSchema,
//     createUserSchema,
//     gameClientSchema,
// } from "@/types/schema.ts";

// Controllers
import { AuthController } from "./controllers/auth.controller.ts";
import { GameClientController } from "./controllers/gameClient.controller.ts";
import { UserController } from "@/modules/iam/controllers/user.controller.ts";

const router = express.Router();

// Game Client management routes
router.post("/clients", GameClientController.create);
router.get("/clients", GameClientController.list);
router.get("/clients/:id", GameClientController.get);
router.patch("/clients/:id", GameClientController.update);
router.delete("/clients/:id", GameClientController.delete);

// User management routes
router.post("/users", UserController.create);
router.get("/users/:id", UserController.get);
router.patch("/users/:id", UserController.update);
router.delete("/users/:id", UserController.delete);

// Authentication routes
router.post("/auth/user", AuthController.authUser);
router.post("/auth/device", AuthController.authDevice);
router.post("/auth/device/link", AuthController.linkDeviceToUser);

export { router as iamRouter };
