import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

const pool = new Pool({
  user: process.env.DB_USER || "postgres",
  host: process.env.DB_HOST || "localhost",
  database: process.env.DB_NAME || "pokemon_shop",
  password: process.env.DB_PASS || "1001",
  port: Number(process.env.DB_PORT) || 5432,
});

(async () => {
  try {
    const client = await pool.connect();
    console.log("Conectado a PostgreSQL");
    client.release(); 
  } catch (err) {
    console.error("Error en la conexión a PostgreSQL:", err);
  }
})();

export default pool;