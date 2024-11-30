import { User } from "./User.ts";
import { GameClient } from "./GameClient.ts";
import { Device } from "./Device.ts";
import { Track } from "./Track.ts";
import { Op } from "sequelize";

// GameClient associations
GameClient.hasMany(Device, {
    foreignKey: "gameClientId",
    as: "devices",
    onDelete: "CASCADE",
});

GameClient.hasMany(Track, {
    foreignKey: "gameClientId",
    as: "tracks",
    onDelete: "CASCADE",
});

// User associations
User.hasMany(Device, {
    foreignKey: "userId",
    as: "devices",
});

User.hasMany(Track, {
    foreignKey: "userId",
    as: "tracks",
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

Device.hasMany(Track, {
    foreignKey: "deviceId",
    as: "tracks",
});

// Add active scope to Device
Device.addScope("active", {
    where: {
        lastActive: {
            [Op.gte]: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days
        },
    },
});

// Track associations
Track.belongsTo(GameClient, {
    foreignKey: "gameClientId",
    as: "gameClient",
});

Track.belongsTo(User, {
    foreignKey: "userId",
    as: "user",
});

Track.belongsTo(Device, {
    foreignKey: "deviceId",
    as: "device",
});

export { Device, GameClient, Track, User };
