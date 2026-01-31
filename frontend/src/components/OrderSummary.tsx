import type { CartItem } from "@/pages/DetailPage"
import type { Restaurant } from "@/types/types"
import { CardContent, CardHeader, CardTitle } from "./ui/card"
import { Badge } from "./ui/badge"
import { Separator } from "./ui/separator"

type Props = {
  restaurant: Restaurant
  cartItems: CartItem[]
  removeFromCart: (cartItem: CartItem) => void
}

const OrderSummary = ({ restaurant, cartItems, removeFromCart }: Props) => {
  const getTotalCost = () => {
    const totalInPence = cartItems.reduce((total, cartItem) => total + cartItem.price * cartItem.quantity, 0)
    const deliveryPrice = Number(restaurant.deliveryPrice)
    const totalDelivery = totalInPence + deliveryPrice
    return totalDelivery.toFixed(2)
  }

  return (
    <>
      <CardHeader>
        <CardTitle className="text-2xl font-bold tracking-tight flex justify-between">
          <span>Your Order</span>
          <span>${getTotalCost()}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        {cartItems.map((item, index) => (
          <div key={`item_${index}`} className="flex justify-between">
            <span>
              <Badge variant="outline" className="mr-2">
                {item.quantity}
              </Badge>
              {item.name}
            </span>
            <span className="flex items-center gap-1">
              <Trash2 className="cursor-pointer hover:text-amber-600" color="red" size={20} onClick={() => removeFromCart(item)} />
              ${(item.price * item.quantity).toFixed(2)}
            </span>
          </div>
        ))}
        <Separator />
        <div className="flex justify-between">
          <span>Delivery</span>
          <span>${Number(restaurant.deliveryPrice).toFixed(2)}</span>
        </div>
        <Separator />
      </CardContent>
    </>
  )
}

export default OrderSummary
