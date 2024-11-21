import { z } from "zod";

// =======================================================================
// User
// =======================================================================
export const createUserSchema = z.object({
    body: z.object({
        username: z.string()
            .min(3, "Username must be at least 3 characters")
            .max(30, "Username must not exceed 30 characters")
            .regex(
                /^[a-zA-Z0-9_-]+$/,
                "Username can only contain letters, numbers, underscores, and hyphens",
            ),
        email: z.string().email("Invalid email address"),
        password: z.string()
            .min(8, "Password must be at least 8 characters")
            .regex(
                /[A-Z]/,
                "Password must contain at least one uppercase letter",
            )
            .regex(
                /[a-z]/,
                "Password must contain at least one lowercase letter",
            )
            .regex(/[0-9]/, "Password must contain at least one number"),
    }),
});

// =======================================================================
// Game Client
// =======================================================================
export const gameClientSchema = z.object({
    body: z.object({
        name: z.string().min(1, "Name is required"),
    }),
});

// =======================================================================
// Auth
// =======================================================================
export const authUserSchema = z.object({
    body: z.object({
        username: z.string().optional(),
        email: z.string().optional(),
        password: z.string(),
    }),
});

export const authDeviceSchema = z.object({
    body: z.object({
        device_id: z.string().min(1, "Device ID is required"),
        client_id: z.string().min(1, "Client ID is required"),
    }),
});

export const deviceLinkSchema = z.object({
    body: z.object({
        device_id: z.string().min(1, "Device ID is required"),
    }),
});
