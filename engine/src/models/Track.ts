import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "@/config/database.ts";

interface TrackAttributes {
  id: string;
  gameClientId: string;
  deviceId: string;
  eventType: string;
  eventData: Record<string, unknown> | null;
  timestamp: Date;
}

interface TrackCreationAttributes
  extends Optional<TrackAttributes, "id" | "timestamp"> {}

export class Track extends Model<TrackAttributes, TrackCreationAttributes> {
  declare id: string;
  declare gameClientId: string;
  declare deviceId: string;
  declare eventType: string;
  declare eventData: Record<string, unknown> | null;
  declare timestamp: Date;
}

Track.init(
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
    eventType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    eventData: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    timestamp: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: "Track",
    tableName: "tracks",
    timestamps: false,
    hooks: {},
  },
);
