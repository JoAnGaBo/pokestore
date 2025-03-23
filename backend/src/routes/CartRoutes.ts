import { Router } from "express";
import { CartController } from "../controllers/CartController";
import { verifyToken } from "../middleware/AuthMiddleware";

const router = Router();

router.post("/add", verifyToken, (req, res) => CartController.addToCart(req, res));
router.get("/", verifyToken, (req, res) => CartController.getCart(req, res));
router.delete("/:pokemonId", verifyToken, (req, res) => CartController.removeFromCart(req, res));

export default router;
