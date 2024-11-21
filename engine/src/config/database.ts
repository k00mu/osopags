import { ENV } from "./env.ts";
import { Sequelize } from "sequelize";

export const sequelize = new Sequelize({
    dialect: "postgres",
    host: ENV.POSTGRES.HOST,
    port: ENV.POSTGRES.PORT,
    username: ENV.POSTGRES.USER,
    password: ENV.POSTGRES.PASSWORD,
    database: ENV.POSTGRES.DB,
    logging: ENV.NODE_ENV === "development" ? console.log : false,
    define: {
        timestamps: true,
        underscored: true,
    },
});

export const initDatabase = async () => {
    try {
        await sequelize.authenticate();
        console.log("Database connection established successfully.");

        // Import models in correct order
        (await import("@/models/GameClient.ts")).GameClient;
        (await import("@/models/User.ts")).User;
        (await import("@/models/Device.ts")).Device;
        (await import("@/models/TelemetryEvent.ts")).TelemetryEvent;

        // Import associations
        await import("@/models/models.ts");

        console.log("Database synchronized successfully.");
    } catch (error) {
        console.error("Unable to connect to the database:", error);
        throw error;
    }
};
