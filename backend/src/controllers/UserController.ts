import { Request, Response } from "express";
import { AppDataSource } from "../config/OrmConfig";
import { User } from "../models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const userRepository = AppDataSource.getRepository(User);

export class UserController {
  static async register(req: Request, res: Response): Promise<void> {
    try {
      const { username, email, password } = req.body;

      const existingUser = await userRepository.findOne({ where: { email } });
      if (existingUser) {
        res.status(400).json({ message: "El usuario ya existe" });
        return;
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = userRepository.create({ username, email, password: hashedPassword });
      await userRepository.save(newUser);

      res.status(201).json({ message: "Usuario registrado exitosamente" });
    } catch (error) {
      res.status(500).json({ message: "Error en el servidor", error });
    }
  }

  static async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      const user = await userRepository.findOne({ where: { email } });

      if (!user) {
        res.status(400).json({ message: "Usuario no encontrado" });
        return;
      }

      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        res.status(400).json({ message: "Contraseña incorrecta" });
        return;
      }

      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || "secret", { expiresIn: "7d" });

      res.json({ token, user: { id: user.id, username: user.username, balance: user.balance } });
    } catch (error) {
      res.status(500).json({ message: "Error en el servidor", error });
    }
  }

  static async getProfile(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).userId;
      const user = await userRepository.findOne({ where: { id: userId }, select: ["id", "username", "email", "balance"] });

      if (!user) {
        res.status(404).json({ message: "Usuario no encontrado" });
        return;
      }

      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Error en el servidor", error });
    }
  }
}

