import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "@/config/database.ts";

interface TelemetryEventAttributes {
    id: string;
    gameClientId: string;
    deviceId: string;
    userId: string | null;
    eventType: string;
    eventData: Record<string, unknown>;
    timestamp: Date;
}

interface TelemetryEventCreationAttributes
    extends Optional<TelemetryEventAttributes, "id" | "timestamp"> {}

export class TelemetryEvent
    extends Model<TelemetryEventAttributes, TelemetryEventCreationAttributes> {
    declare id: string;
    declare gameClientId: string;
    declare deviceId: string;
    declare userId: string | null;
    declare eventType: string;
    declare eventData: Record<string, unknown>;
    declare timestamp: Date;
}

TelemetryEvent.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        gameClientId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: "game_clients",
                key: "id",
            },
        },
        deviceId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: "devices",
                key: "id",
            },
        },
        userId: {
            type: DataTypes.UUID,
            allowNull: true,
            references: {
                model: "users",
                key: "id",
            },
        },
        eventType: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        eventData: {
            type: DataTypes.JSONB,
            allowNull: false,
        },
        timestamp: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
    },
    {
        sequelize,
        tableName: "telemetry_events",
        timestamps: false,
    },
);
