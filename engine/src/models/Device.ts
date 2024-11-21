import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "@/config/database.ts";

interface DeviceAttributes {
    id: string;
    gameClientId: string;
    userId: string | null;
    machineId: string;
    lastActive: Date;
    createdAt: Date;
    updatedAt: Date;
}

interface DeviceCreationAttributes
    extends Optional<DeviceAttributes, "id" | "createdAt" | "updatedAt"> {}

export class Device extends Model<DeviceAttributes, DeviceCreationAttributes> {
    declare id: string;
    declare gameClientId: string;
    declare userId: string | null;
    declare machineId: string;
    declare lastActive: Date;
    declare readonly createdAt: Date;
    declare readonly updatedAt: Date;
}

Device.init(
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
        userId: {
            type: DataTypes.UUID,
            allowNull: true,
            references: {
                model: "users",
                key: "id",
            },
        },
        machineId: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        lastActive: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
    },
    {
        sequelize,
        tableName: "devices",
        timestamps: true,
        indexes: [
            {
                unique: true,
                fields: ["machine_id", "game_client_id"],
            },
        ],
    },
);
