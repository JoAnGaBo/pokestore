import "reflect-metadata";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import "./config/OrmConfig";
import routes from "./routes";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api", routes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
