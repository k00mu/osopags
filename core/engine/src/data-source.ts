import { DataSource } from "typeorm";
import { GameProject } from "./entity/GameProject";

const AppDataSource = new DataSource({
    type: "postgres",
    host: "db",
    port: 5432,
    username: "user",
    password: "password",
    database: "osopags",
    synchronize: true,
    logging: false,
    entities: [GameProject],
    migrations: [],
    subscribers: [],
});

export default AppDataSource;
