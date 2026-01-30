import type { OrderSuccessResponse } from "@/types/types"
import { useAuth0 } from "@auth0/auth0-react"
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

type CheckoutSessionRequest = {
  cartItems: {
    menuItemId: string
    name: string
    quantity: string
  }[]
  deliveryDetails: {
    name: string
    email?: string
    addressLine: string
    city: string
    country: string
  }
  restaurantId: string
}

export const useCreateCheckoutSession = () => {
  const { getAccessTokenSilently } = useAuth0()

  const createCheckoutSessionRequest = async (checkoutSessionRequest: CheckoutSessionRequest):Promise<OrderSuccessResponse> => {
    const accessToken = await getAccessTokenSilently()
    const response = await fetch(`${API_BASE_URL}/api/order/checkout/create-checkout-session`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(checkoutSessionRequest),
    })
    if (!response.ok) {
      throw new Error("Unable to create checkout session")
    }
    return response.json()
  }

  const {
    mutateAsync: createCheckoutSession,
    isPending,
    isSuccess,
    error,
    isError,
    reset,
  } = useMutation<OrderSuccessResponse, Error, CheckoutSessionRequest>({
    mutationKey: ["createCheckoutSession"],
    mutationFn: createCheckoutSessionRequest,
    onSuccess: (res) => {
      toast.success(res?.message || "Order placed successfully")
    },
    onError: (error) => {
      toast.error(error?.message || "Error placing the order")
    },
  })

  return {
    createCheckoutSession,
    isPending,
    isSuccess,
    isError,
    error,
    reset
  }
}
