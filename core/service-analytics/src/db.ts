import { Sequelize } from "sequelize";

const Database = new Sequelize(
    Deno.env.get("POSTGRES_DB") ?? "osopags",
    Deno.env.get("POSTGRES_USER") ?? "user",
    Deno.env.get("POSTGRES_PASSWORD") ?? "password",
    {
        host: "db",
        dialect: "postgres",
    },
);

export default Database;
