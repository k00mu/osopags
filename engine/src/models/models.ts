import { User } from "./User.ts";
import { GameClient } from "./GameClient.ts";
import { Device } from "./Device.ts";
import { TelemetryEvent } from "./TelemetryEvent.ts";
import { Op } from "sequelize";

// GameClient associations
GameClient.hasMany(Device, {
    foreignKey: "gameClientId",
    as: "devices",
    onDelete: "CASCADE",
});

GameClient.hasMany(TelemetryEvent, {
    foreignKey: "gameClientId",
    as: "telemetryEvents",
    onDelete: "CASCADE",
});

// User associations
User.hasMany(Device, {
    foreignKey: "userId",
    as: "devices",
});

User.hasMany(TelemetryEvent, {
    foreignKey: "userId",
    as: "telemetryEvents",
});

// Device associations
Device.belongsTo(GameClient, {
    foreignKey: "gameClientId",
    as: "gameClient",
});

Device.belongsTo(User, {
    foreignKey: "userId",
    as: "user",
});

Device.hasMany(TelemetryEvent, {
    foreignKey: "deviceId",
    as: "telemetryEvents",
});

// Add active scope to Device
Device.addScope("active", {
    where: {
        lastActive: {
            [Op.gte]: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days
        },
    },
});

// TelemetryEvent associations
TelemetryEvent.belongsTo(GameClient, {
    foreignKey: "gameClientId",
    as: "gameClient",
});

TelemetryEvent.belongsTo(User, {
    foreignKey: "userId",
    as: "user",
});

TelemetryEvent.belongsTo(Device, {
    foreignKey: "deviceId",
    as: "device",
});

export { Device, GameClient, TelemetryEvent, User };
