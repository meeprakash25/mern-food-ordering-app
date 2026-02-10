import express from "express"
import { auth } from "../middleware/auth"
import OrderController from "../controllers/OrderController"

const router = express.Router()

router.post("/checkout/create-checkout-session",
  auth,
  OrderController.createCheckoutSession
)

router.get("/", auth, OrderController.getMyOrders)

export default router