import type { Order } from "@/types/types"
import { Progress } from "./ui/progress"
import { ORDER_STATUS, PAYMENT_STATUS } from "@/config/order-status-config"

type Props = {
  order: Order
}

const OrderStatusHeader = ({ order }: Props) => {
  const getExpectedDelivery = () => {
    const created = new Date(order.createdAt)
    created.setMinutes(created.getMinutes() + order.restaurant.estimatedDeliveryTime)
    const hours = created.getHours()
    const minutes = created.getMinutes()

    const paddedMinutes = minutes < 10 ? `0${minutes}` : minutes

    return `${hours}:${paddedMinutes}`
  }

  const getOrderInfo = () => ORDER_STATUS.find((o) => o.value === order.orderStatus) || ORDER_STATUS[0]
  const getPaymentInfo = () => PAYMENT_STATUS.find((o) => o.value === order.paymentStatus) || PAYMENT_STATUS[0]

  return (
    <>
      <h1 className="text-4xl font-bold tracking-tighter flex flex-col gap-5 md:flex-row md:justify-between">
        <span>Order Status: {getOrderInfo().label}</span>
        <span>Payment Status: {getPaymentInfo().label}</span>
        <span>Expected by: {getExpectedDelivery()}</span>
      </h1>
      <Progress className="animate-pulse" value={getOrderInfo().progress} />
    </>
  )
}

export default OrderStatusHeader
