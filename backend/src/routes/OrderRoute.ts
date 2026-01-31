import express from "express"
import { auth } from "../middleware/auth"
import OrderController from "../controllers/OrderController"

const router = express.Router()

router.post("/checkout/create-checkout-session",
  auth,
  OrderController.createCheckoutSession
)

router.post("/checkout/webhook", OrderController.stripeWebhookHandler)

export default router