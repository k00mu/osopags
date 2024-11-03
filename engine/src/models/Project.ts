import { DataTypes, Model } from "sequelize";
import { default as sequelize } from "../db.ts";

class Project extends Model {}

Project.init({
    name: DataTypes.STRING,
    description: DataTypes.STRING,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
}, {
    sequelize,
    modelName: "Project",
});

export default Project;
