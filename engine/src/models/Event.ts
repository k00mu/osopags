import { DataTypes, Model } from "sequelize";
import { default as sequelize } from "../db.ts";

class Event extends Model {}

Event.init({
    eventName: DataTypes.STRING,
    eventData: DataTypes.JSONB,
    gameProjectId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
}, {
    sequelize,
    modelName: "Event",
});

export default Event;
