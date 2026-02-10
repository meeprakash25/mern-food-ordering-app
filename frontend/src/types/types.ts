type User = {
  _id: string
  email: string
  name: string
  addressLine: string
  city: string
  country: string
}

export type MenuItem = { _id: string; name: string; price: number }

export type Restaurant = {
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

type Cities = string[]

type OrderSessionSuccess = {
  url: string
}

export type OrderStatus = "orderPlaced"|"inProgress"|"outForDelivery"|"delivered"|"cancelled"
export type PaymentType = "card"|"cod"
export type PaymentStatus = "paid"|"unpaid"|"stripeError"|"rejected"|"cancelled"|"refunded"

export type Order = {
  _id: string
  restaurant: Restaurant
  user: User
  cartItems: {
    menuItemId: string
    name: string
    quantity: string
  }[]
  deliveryDetails: {
    name: string
    email: string
    addressLine: string
    city: string
    country: string
  }
  totalAmount: number
  orderStatus: OrderStatus
  paymentType: PaymentType
  paymentStatus: PaymentStatus
  createdAt: string
  updatedAt: string
}

export type ApiResponse = {
  message: string
  data: Object
}


export interface CurrentUserResponse extends ApiResponse {
  data: User
}
export interface RestaurantResponse extends ApiResponse {
  data: Restaurant
}

export interface RestaurantSearchResponse extends ApiResponse {
  data: {
    restaurants: Restaurant[],
    pagination: {
      total: number,
      page: number,
      pages:number
    }
  }
}

export interface CitiesResponse extends ApiResponse {
  data: Cities
}

export interface OrderSessionSuccessResponse extends ApiResponse {
  data: OrderSessionSuccess
}

export interface OrderResponse extends Response {
  data: Order[]
}

export interface RestaurantOrdersResponse extends Response {
  data: Order[]
}
