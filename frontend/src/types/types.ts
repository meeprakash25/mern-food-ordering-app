type User = {
  _id: string
  email: string
  name: string
  addressLine: string
  city: string
  country: string
}

export type ApiResponse = {
  message: string
  data: Object
}

export interface CurrentUserResponse extends ApiResponse {
  data: User
}