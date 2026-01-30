import type { MenuItem as MenuItemType } from "@/types/types"
import { Card, CardContent, CardHeader } from "./ui/card"

type Props = {
  menuItem: MenuItemType
  addToCart: () => void
}

const MenuItem = ({ menuItem, addToCart }: Props) => {
  return (
    <Card className="cursor-pointer" onClick={addToCart}>
      <CardHeader>{menuItem.name}</CardHeader>
      <CardContent className="font-bold">${menuItem.price.toFixed(2)}</CardContent>
    </Card>
  )
}

export default MenuItem
