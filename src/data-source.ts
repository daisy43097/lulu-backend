import "reflect-metadata"
import { DataSource } from "typeorm"
import { User } from "./entity/User"
import {Payment} from "./entity/Payment";
import {Order} from "./entity/Order";

export const AppDataSource = new DataSource({
    type: "mysql",
    host: "127.0.0.1",
    port: 3306,
    username: "root",
    password: "chengxin123",
    database: "lulu",
    synchronize: false,
    logging: false,
    // entities: ["src/entity/**/*.ts"],
    entities: [User, Payment, Order],
    migrations: ["src/migration/**/*.ts"],
    subscribers: ["src/subscriber/**/*.ts"],
})
