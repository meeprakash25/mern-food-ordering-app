import type { OrderSessionSuccessResponse, OrderResponse } from "@/types/types"
import { useAuth0Token, CONSENT_REDIRECT } from "@/auth/useAuth0Token"
import { useMutation, useQuery } from "@tanstack/react-query"
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
  const getToken = useAuth0Token()

  const createCheckoutSessionRequest = async (checkoutSessionRequest: CheckoutSessionRequest):Promise<OrderSessionSuccessResponse> => {
    const accessToken = await getToken()
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
  } = useMutation<OrderSessionSuccessResponse, Error, CheckoutSessionRequest>({
    mutationKey: ["createCheckoutSession"],
    mutationFn: createCheckoutSessionRequest,
    onSuccess: (res) => {
      toast.success(res?.message || "Order placed successfully")
    },
    onError: (error) => {
      if (error?.message === CONSENT_REDIRECT) return
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

export const useGetMyOrders = () => {
  const getToken = useAuth0Token()
  const getMyOrdersRequest = async ():Promise<OrderResponse> => {
    const accessToken = await getToken()
    const response = await fetch(`${API_BASE_URL}/api/order`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    if (!response.ok) {
      throw new Error("Failed to get orders")
    }
    return response.json()
  }

  const {
    data: result,
    isPending,
    isError,
    error,
  } = useQuery<OrderResponse, Error>({
    queryKey: ["getMyOrders"],
    queryFn: getMyOrdersRequest,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    retry: false,
    refetchInterval: 5 * 1000, // refetch every 5 seconds
  })

  if (isError && error?.message !== CONSENT_REDIRECT) {
    toast.error(error.message.toString())
  }

  return {
    result,
    isPending,
  }
}
