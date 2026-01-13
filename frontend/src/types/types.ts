type User = {
  _id: string
  email: string
  name: string
  addressLine: string
  city: string
  country: string
}

type MenuItem = { name: string; price: number }

type Restaurant = {
  _id: string
  restaurantName: string
  city: string
  country: string
  deliveryPrice: number
  estimatedDeliveryTime: number
  cuisines: string[]
  menuItems: MenuItem[]
  imageUrl: string
  lastUpdated: string
}

export type ApiResponse = {
  message: string
  data: Object
}

export interface CurrentUserResponse extends ApiResponse {
  data: User
}
export interface UserRestaurantResponse extends ApiResponse {
  data: Restaurant
}
