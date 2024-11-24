import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "@/config/database.ts";

interface GameClientAttributes {
    id: string;
    gameName: string;
    gameNamespace: string;
    createdAt: Date;
    updatedAt: Date;
}

interface GameClientCreationAttributes
    extends Optional<GameClientAttributes, "id" | "createdAt" | "updatedAt"> {}

export class GameClient
    extends Model<GameClientAttributes, GameClientCreationAttributes> {
    declare id: string;
    declare gameName: string;
    declare gameNamespace: string;
    declare readonly createdAt: Date;
    declare readonly updatedAt: Date;
}

GameClient.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        gameName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        gameNamespace: {
            type: DataTypes.STRING,
            allowNull: false,
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
        tableName: "game_clients",
        timestamps: true,
        paranoid: true,
    },
);
