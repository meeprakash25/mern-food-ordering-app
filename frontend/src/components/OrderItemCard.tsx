import type { Order, OrderStatus, PaymentStatus } from "@/types/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Separator } from "./ui/separator"
import { Badge } from "./ui/badge"
import { Label } from "./ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { ORDER_STATUS, PAYMENT_STATUS } from "@/config/order-status-config"
import { useUpdateUserRestaurantOrderStatus } from "@/api/UserRestaurantApi"
import { useEffect, useState } from "react"

type Props = {
  order: Order
}

const OrderItemCard = ({ order }: Props) => {
  const getTime = () => {
    const orderDateTime = new Date(order.createdAt)
    const hours = orderDateTime.getHours()
    const minutes = orderDateTime.getMinutes()

    const paddedMinutes = minutes < 10 ? `0${minutes}` : minutes

    return `${hours}:${paddedMinutes}`
  }

  const { updateUserRestarantOrderStatus, isPending } = useUpdateUserRestaurantOrderStatus()

  const [orderStatus, setOrderStatus] = useState<OrderStatus>(order.orderStatus)
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>(order.paymentStatus)

  useEffect(() => {
    setOrderStatus(order.orderStatus)
  }, [order.orderStatus])

  useEffect(() => {
    setPaymentStatus(order.paymentStatus)
  }, [order.paymentStatus])

  const handleStatusChange = async (newStatus: OrderStatus | PaymentStatus, statusType: "order" | "payment") => {
    updateUserRestarantOrderStatus({
      orderId: order._id as string,
      status: newStatus,
      type: statusType,
    })

    if (statusType === "order") {
      setOrderStatus(newStatus as OrderStatus)
    } else if (statusType === "payment") {
      setPaymentStatus(newStatus as PaymentStatus)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="grid md:grid-cols-4 gap-4 justify-between mb-3">
          <div>
            Customer Name:
            <span className="ml-2 font-normal">
              {order.deliveryDetails.addressLine}, {order.deliveryDetails.city}, {order.deliveryDetails.country}
            </span>
          </div>
          <div>
            Time:
            <span className="ml-2 font-normal">{getTime()}</span>
          </div>
          <div>
            Total Cost:
            <span className="ml-2 font-normal">{order.totalAmount ? `$${order.totalAmount.toFixed(2)}` : "n/a"}</span>
          </div>
        </CardTitle>
        <CardDescription></CardDescription>
        <Separator />
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          {order.cartItems.map((cartItem, index) => (
            <span key={`cartitem-${order._id}-${index}`}>
              <Badge variant="outline" className="mr-2">
                {cartItem.quantity}
              </Badge>
              {cartItem.name}
            </span>
          ))}
        </div>
        <div className="flex flex-col md:flex-row justify-between space-y-1.5">
          <div>
            <Label htmlFor="payment-status">What is the payment status?</Label>
            <Select
              value={paymentStatus}
              onValueChange={(value) => handleStatusChange(value as PaymentStatus, "payment")}
              disabled={isPending}>
              <SelectTrigger id="payment-status" className="w-50">
                <SelectValue placeholder="Payment Status" />
              </SelectTrigger>
              <SelectContent>
                {PAYMENT_STATUS.map((status) => (
                  <SelectItem key={`${order._id}-${status.value}`} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="order-status">What is the status of this order?</Label>
            <Select
              value={orderStatus}
              onValueChange={(value) => handleStatusChange(value as OrderStatus, "order")}
              disabled={isPending}>
              <SelectTrigger id="order-status" className="w-50">
                <SelectValue placeholder="Order Status" />
              </SelectTrigger>
              <SelectContent>
                {ORDER_STATUS.map((status) => (
                  <SelectItem key={`${order._id}-${status.value}`} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default OrderItemCard
