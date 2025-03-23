import { Router } from "express";
import { UserController } from "../controllers/UserController";
import { verifyToken } from "../middleware/AuthMiddleware";

const router = Router();

router.post("/register", (req, res) => UserController.register(req, res));
router.post("/login", (req, res) => UserController.login(req, res));
router.get("/profile", verifyToken, (req, res) => UserController.getProfile(req, res));

export default router;
