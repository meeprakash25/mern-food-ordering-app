import { Request, Response } from "express"
import Stripe from "stripe"
import Restaurant, { MenuItemType } from "../models/Restaurant"
import Order, { OrderType } from "../models/Order"
import mongoose from "mongoose"

const STRIPE = new Stripe(process.env.STRIPE_SECRET_KEY as string)
const FRONTEND_URL = process.env.FRONTEND_URL
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET as string

type CheckoutSessionRequest = {
  cartItems: {
    menuItemId: string
    name: string
    quantity: string
  }[]
  deliveryDetails: {
    email: string
    name: string
    addressLine: string
    city: string
    country: string
  }
  restaurantId: string
}

const createCheckoutSession = async (req: Request, res: Response) => {
  try {
    const CheckoutSessionRequest: CheckoutSessionRequest = req.body

    const restaurant = await Restaurant.findById(CheckoutSessionRequest.restaurantId)

    if (!restaurant) {
      throw new Error("Restaurant not found")
    }

    const newOrder = new Order({
      restaurant: restaurant._id,
      user: new mongoose.Types.ObjectId(req.userId),
      orderStatus: "orderPlaced",
      paymentType: "card",
      paymentStatus: "unpaid",
      deliveryDetails: CheckoutSessionRequest.deliveryDetails,
      cartItems: CheckoutSessionRequest.cartItems,
    })

    const lineItems = createLineItems(CheckoutSessionRequest, restaurant.menuItems)

    const session = await createSession(
      lineItems,
      newOrder._id.toString(),
      parseInt(restaurant.deliveryPrice),
      restaurant._id.toString(),
    )
    if (!session.url) {
      newOrder.paymentStatus = "stripeError"
      await newOrder.save()
      return res.status(500).json({ message: "Error creating stripe session" })
    }

    await newOrder.save()

    return res.status(200).json({
      message: "Creating checkout session",
      data: {
        url: session.url,
      },
    })
  } catch (error: any) {
    console.log(error)
    return res.status(500).json({ message: error.raw.message })
  }
}

const createLineItems = (checkoutSessionRequest: CheckoutSessionRequest, menuItems: MenuItemType[]) => {
  const lineItems = checkoutSessionRequest.cartItems.map((cartItem) => {
    const menuItem = menuItems.find((item) => item._id.toString() === cartItem.menuItemId.toString())
    if (!menuItem) {
      throw new Error(`Menu item not found: ${cartItem.menuItemId}`)
    }
    const line_item: Stripe.Checkout.SessionCreateParams.LineItem = {
      price_data: {
        currency: "usd",
        unit_amount: menuItem.price*100,
        product_data: {
          name: menuItem.name,
        },
      },
      quantity: parseInt(cartItem.quantity),
    }
    return line_item
  })
  return lineItems
}

const createSession = async (
  lineItems: Stripe.Checkout.SessionCreateParams.LineItem[],
  orderId: string,
  deliveryPrice: number,
  restaurantId: string,
) => {
  const sessionData = await STRIPE.checkout.sessions.create({
    line_items: lineItems,
    shipping_options: [
      {
        shipping_rate_data: {
          display_name: "Delivery",
          type: "fixed_amount",
          fixed_amount: {
            amount: deliveryPrice*100,
            currency: "usd",
          },
        },
      },
    ],
    mode: "payment",
    metadata: {
      orderId,
      restaurantId,
    },
    success_url: `${FRONTEND_URL}/order-status?success=true`,
    cancel_url: `${FRONTEND_URL}/detail/${restaurantId}?cancelled=true`,
  })
  return sessionData
}

const stripeWebhookHandler = async (req: Request, res: Response) => {
  let event
  try {
    const sig = req.headers["stripe-signature"]
    event = STRIPE.webhooks.constructEvent(req.body, sig as string, STRIPE_WEBHOOK_SECRET)
  } catch (error: any) {
    console.log(error)
    return res.status(400).json({ message: `Webhook error: ${error.message}` })
  }

  // Type guards to ensure we have a Session object with metadata
  const session = event.data.object as Stripe.Checkout.Session
  const orderId = session.metadata && session.metadata.orderId ? session.metadata.orderId : undefined

  let order = undefined
  if (orderId) {
    order = await Order.findById(orderId)
  }

  // if (event.type === "checkout.session.completed") {

  // }

  if (event.type === "checkout.session.completed") {
    if (!order) {
      return res.status(404).json({ message: "Order not found" })
    }
    order.totalAmount = event.data.object.amount_total
    order.paymentStatus = "paid"

    await order.save()
  }
  return res.status(200).json({ message: `Webhook success` })
}


export default {
  createCheckoutSession,
  stripeWebhookHandler,
}