import mongoose, { InferSchemaType } from "mongoose"

const orderSchema = new mongoose.Schema(
  {
    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    deliveryDetails: {
      email: { type: String, required: true },
      name: { type: String, required: true },
      addressLine: { type: String, required: true },
      city: { type: String, required: true },
      country: { type: String, required: true },
    },
    cartItems: [
      {
        menuItemId: { type: mongoose.Schema.Types.ObjectId, required: true },
        quantity: { type: Number, required: true },
        name: { type: String, required: true },
      },
    ],
    totalAmount: Number,
    orderStatus: {
      type: String,
      enum: ["orderPlaced", "inProgress", "outForDelivery", "delivered","cancelled"],
      default: "orderPlaced",
    },
    paymentType: {
      type: String,
      enum: ["card", "cod"],
      default: "card",
    },
    paymentStatus: {
      type: String,
      enum: ["paid", "unpaid", "stripeError", "rejected", "refunded"],
      default: "unpaid",
    },
    stripePaymentIntent: String
  },
  {
    timestamps: true,
  },
)

export type OrderType = InferSchemaType<typeof orderSchema>

export default mongoose.model("Order", orderSchema)
