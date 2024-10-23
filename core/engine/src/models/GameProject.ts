import { DataTypes, Model } from "sequelize";
import { default as sequelize } from "../db.ts";

class GameProject extends Model {}

GameProject.init({
    name: DataTypes.STRING,
    description: DataTypes.STRING,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
}, {
    sequelize,
    modelName: "GameProject",
});

export default GameProject;
