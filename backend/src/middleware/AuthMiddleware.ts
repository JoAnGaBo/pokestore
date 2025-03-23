import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const verifyToken = (req: Request, res: Response, next: NextFunction): void => {
  const token = req.headers["authorization"];
  if (!token) {
    res.status(403).json({ message: "No token provided" });
    return;
  }

  jwt.verify(token.split(" ")[1], process.env.JWT_SECRET || "secret", (err, decoded: any) => {
    if (err) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }
    (req as any).userId = decoded.id;
    next();
  });
};


