import type { ApiResponse, RestaurantOrdersResponse, RestaurantResponse } from "@/types/types"
import { useAuth0Token, CONSENT_REDIRECT } from "@/auth/useAuth0Token"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useEffect, useRef } from "react"
import { toast } from "sonner"

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export const useGetUserRestaurant = (options?: { enabled?: boolean }) => {
  const getToken = useAuth0Token()
  const getUserRestaurantRequest = async (): Promise<RestaurantResponse> => {
    const accessToken = await getToken()
    const response = await fetch(`${API_BASE_URL}/api/user/restaurant`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || "Failed to fetch restaurant")
    }
    return await response.json()
  }

  const {
    data: userRestaurant,
    isPending,
    isError,
    error,
    isSuccess,
    refetch,
  } = useQuery<RestaurantResponse, Error>({
    queryKey: ["userRestaurant"],
    queryFn: getUserRestaurantRequest,
    enabled: options?.enabled ?? true,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    staleTime: 1 * 60 * 1000, // cache for 1 minutes to avoid refetch loops in StrictMode
    retry: false,
  })

  const successShown = useRef(false)
  const errorShown = useRef(false)

  useEffect(() => {
    if (isSuccess && userRestaurant && !successShown.current) {
      toast.success(userRestaurant?.message || "Restaurant fetched")
      successShown.current = true
    }
  }, [isSuccess, userRestaurant])

  useEffect(() => {
    if (isError && error && error.message !== CONSENT_REDIRECT && !errorShown.current) {
      toast.error(error.message.toString() || "Something went wrong")
      errorShown.current = true
    }
  }, [isError, error])

  return {
    userRestaurant,
    isPending,
    isError,
    isSuccess,
    refetch,
  }
}

export const useCreateUserRestaurant = () => {
  const getToken = useAuth0Token()
  const createUserRestaurantRequest = async (restaurant: FormData): Promise<RestaurantResponse> => {
    const accessToken = await getToken()
    const response = await fetch(`${API_BASE_URL}/api/user/restaurant`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        // Prepare FormData for file upload with multipart/form-data automatically set
      },
      body: restaurant,
    })
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || "Failed to create restaurant")
    }
    return await response.json()
  }

  const { mutateAsync: createUserRestaurant, isPending } = useMutation<RestaurantResponse, Error, FormData>({
    mutationKey: ["createUserReataurant"],
    mutationFn: createUserRestaurantRequest,
    onSuccess: (data) => {
      toast.success(data?.message || "Restaurant created")
    },
    onError: (error) => {
      if (error?.message === CONSENT_REDIRECT) return
      toast.error(error?.message || "Failed to create restaurant")
    },
  })

  return {
    createUserRestaurant,
    isPending,
  }
}

export const useUpdateUserRestaurant = () => {
  const getToken = useAuth0Token()
  const updateUserRestaurantRequest = async (restaurant: FormData): Promise<RestaurantResponse> => {
    const accessToken = await getToken()
    const response = await fetch(`${API_BASE_URL}/api/user/restaurant`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        // Prepare FormData for file upload with multipart/form-data automatically set
      },
      body: restaurant,
    })
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || "Failed to update restaurant")
    }
    return await response.json()
  }

  const { mutateAsync: updateUserRestaurant, isPending } = useMutation<RestaurantResponse, Error, FormData>({
    mutationKey: ["updateUserReataurant"],
    mutationFn: updateUserRestaurantRequest,
    onSuccess: (data) => {
      toast.success(data?.message || "Restaurant updated")
    },
    onError: (error) => {
      if (error?.message === CONSENT_REDIRECT) return
      toast.error(error?.message || "Failed to update restaurant")
    },
  })

  return {
    updateUserRestaurant,
    isPending,
  }
}

export const useGetUserRestaurantOrders = () => {
  const getToken = useAuth0Token()
  const getUserRestaurantOrdersRequest = async (): Promise<RestaurantOrdersResponse> => {
    const accessToken = await getToken()
    const response = await fetch(`${API_BASE_URL}/api/user/restaurant/order`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    })
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || "Failed to getch restaurant orders")
    }
    return response.json()
  }

  const {
    data: result,
    isPending,
    isError,
    error,
  } = useQuery<RestaurantOrdersResponse, Error>({
    queryKey: ["getUserRestaurantOrders"],
    queryFn: getUserRestaurantOrdersRequest,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    staleTime: 5 * 60 * 1000, // cache for 5 minutes to avoid refetch loops in StrictMode
    retry: false,
  })

  if (isError && error?.message !== CONSENT_REDIRECT) {
    toast.error(error.message.toString())
  }

  return {
    result,
    isPending,
    isError,
    error,
  }
}

type UpdateOrderStatusRequestType = {
  orderId: string
  status: string
  type: "order" | "payment"
}

export const useUpdateUserRestaurantOrderStatus = () => {
  const getToken = useAuth0Token()
  const queryClient = useQueryClient()

  const updateUserRestaurantOrderStatus = async (
    updateOrderStatusRequest: UpdateOrderStatusRequestType,
  ): Promise<ApiResponse> => {
    const accessToken = await getToken()
    const response = await fetch(
      `${API_BASE_URL}/api/user/restaurant/order/${updateOrderStatusRequest.orderId}/status`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: updateOrderStatusRequest.status, type: updateOrderStatusRequest.type }),
      },
    )

    if (!response.ok) {
      throw new Error("Failed to update status")
    }
    return response.json()
  }

  const { mutateAsync: updateUserRestarantOrderStatus, isPending } = useMutation<
    ApiResponse,
    Error,
    UpdateOrderStatusRequestType
  >({
    mutationKey: ["updateRestarantStatus"],
    mutationFn: updateUserRestaurantOrderStatus,
    onSuccess: (res) => {
      toast.success(res?.message || "Order updated")
      queryClient.invalidateQueries({ queryKey: ["getUserRestaurantOrders"] })
    },
    onError: (error) => {
      if (error?.message === CONSENT_REDIRECT) return
      toast.error(error?.message || "Unable to update order")
    },
  })

  return {
    updateUserRestarantOrderStatus,
    isPending,
  }
}
