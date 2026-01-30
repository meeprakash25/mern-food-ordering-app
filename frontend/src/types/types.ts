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

type OrderSuccess = {
  url: string
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

export interface OrderSuccessResponse extends ApiResponse {
  data: OrderSuccess
}
