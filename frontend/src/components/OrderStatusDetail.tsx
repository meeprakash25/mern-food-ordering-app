import type { Order } from "@/types/types"
import { Separator } from "./ui/separator"

type Props = {
  order: Order
}

const OrderStatusDetail = ({ order }: Props) => {
  return (
    <div className="space-y-5">
      <div className="flex flex-col">
        <span className="font-bold">Delivering to:</span>
        <span>{order.deliveryDetails.name}</span>
        <span>{order.deliveryDetails.addressLine}</span>
        <span>
          {order.deliveryDetails.city}, {order.deliveryDetails.country}
        </span>
      </div>
      <div className="flex flex-col">
        <div className="font-bold">
          <ul>
            {order.cartItems.map((item) => (
              <li>
                {item.name} X {item.quantity}
              </li>
            ))}
          </ul>
        </div>
        <Separator className="my-3" />
        <div className="flex flex-col">
          <span className="font-bold">Total:</span>
          <span>{order.totalAmount ? `$${order.totalAmount.toFixed(2)}` : "n/a"}</span>
        </div>
      </div>
    </div>
  )
}

export default OrderStatusDetail
