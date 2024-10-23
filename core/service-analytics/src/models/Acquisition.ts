import { DataTypes, Model } from "sequelize";
import { default as sequelize } from "../db.ts";

enum EventType {
    INSTALL = 'install',
    UNINSTALL = 'uninstall',
}

class Acquisition extends Model {}

Acquisition.init({
    eventType: {
        type: DataTypes.ENUM,
        values: [EventType.INSTALL, EventType.UNINSTALL],
        allowNull: false,
    },
    gameProjectId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    createdAt: DataTypes.DATE,
}, {
    sequelize,
    modelName: "Acquisition",
});

export { EventType };
export default Acquisition;