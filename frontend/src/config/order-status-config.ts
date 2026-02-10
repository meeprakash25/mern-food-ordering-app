import type { OrderStatus, PaymentType, PaymentStatus } from "@/types/types"

type OrderStatusInfo = {
  label: string,
  value: OrderStatus,
  progress: number
}

type PaymentStatusInfo = {
  label: string,
  value: PaymentStatus
}

type PaymentTypeInfo = {
  label: string,
  value: PaymentType
}

export const ORDER_STATUS: OrderStatusInfo[] = [
  { label: "Order Placed", value: "orderPlaced", progress: 0 },
  { label: "Order in Progress", value: "inProgress", progress: 50 },
  { label: "Out for Delivery", value: "outForDelivery", progress: 75 },
  { label: "Order Delivered", value: "delivered", progress: 100 },
  { label: "Order Cancelled", value: "cancelled", progress: 0 },
]

export const PAYMENT_STATUS: PaymentStatusInfo[] = [
  { label: "Unpaid", value: "unpaid" },
  { label: "Paid", value: "paid" },
  { label: "Stripe Error", value: "stripeError" },
  { label: "Payment Rejected", value: "rejected" },
  { label: "Cancelled", value: "cancelled" },
  { label: "Refunded", value: "refunded" },
]

export const PAYMENT_TYPE: PaymentTypeInfo[] = [
  {label:"Card", value:"card"},
  {label:"Cash on Delivery", value:"cod"},
]