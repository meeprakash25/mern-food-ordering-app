import type { RestaurantResponse } from "@/types/types"
import { useAuth0 } from "@auth0/auth0-react"
import { useMutation, useQuery } from "@tanstack/react-query"
import { useEffect, useRef } from "react"
import { toast } from "sonner"

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export const useGetUserRestaurant = () => {
  const { getAccessTokenSilently } = useAuth0()
  const getUserRestaurantRequest = async (): Promise<RestaurantResponse> => {
    const accessToken = await getAccessTokenSilently()
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
  } = useQuery<RestaurantResponse, Error>({
    queryKey: ["userRestaurant"],
    queryFn: getUserRestaurantRequest,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    // staleTime: 5 * 60 * 1000, // cache for 5 minutes to avoid refetch loops in StrictMode
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
    if (isError && error && !errorShown.current) {
      toast.error(error.message.toString() || "Something went wrong")
      errorShown.current = true
    }
  }, [isError, error])

  return {
    userRestaurant,
    isPending,
    isError,
    isSuccess,
  }
}

export const useCreateUserRestaurant = () => {
  const { getAccessTokenSilently } = useAuth0()
  const createUserRestaurantRequest = async (restaurant: FormData): Promise<RestaurantResponse> => {
    const accessToken = await getAccessTokenSilently()
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
      toast.error(error?.message || "Failed to create restaurant")
    },
  })

  return {
    createUserRestaurant,
    isPending,
  }
}

export const useUpdateUserRestaurant = () => {
  const { getAccessTokenSilently } = useAuth0()
  const updateUserRestaurantRequest = async (restaurant: FormData): Promise<RestaurantResponse> => {
    const accessToken = await getAccessTokenSilently()
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
      toast.error(error?.message || "Failed to update restaurant")
    },
  })

  return {
    updateUserRestaurant,
    isPending,
  }
}
