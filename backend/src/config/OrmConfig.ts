import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "../models/User";
import { Pokemon } from "../models/Pokemon";
import { CartItem } from "../models/CartItem";
import { Order } from "../models/Order";
import { OrderItem } from "../models/OrderItem";
import { UserPokemon } from "../models/UserPokemon";
import dotenv from "dotenv";

dotenv.config();

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  entities: [User, Pokemon, CartItem, Order, OrderItem, UserPokemon],
  synchronize: false,
  logging: true,
  migrations: ["src/migrations/*.ts"], 
});

AppDataSource.initialize()
  .then(() => console.log("Conectado a PostgreSQL con TypeORM"))
  .catch((err) => console.error("Error en la conexión a la BD", err));
