import { Router } from "express";
import { OrderController } from "../controllers/OrderController";
import { verifyToken } from "../middleware/AuthMiddleware";

const router = Router();

router.post("/", verifyToken, (req, res) => OrderController.createOrder(req, res));
router.get("/", verifyToken, (req, res) => OrderController.getOrders(req, res));

export default router;
