import type { ApiResponse, CurrentUserResponse } from "@/types/types"
import { useAuth0 } from "@auth0/auth0-react"
import { useMutation, useQuery } from "@tanstack/react-query"
import { toast } from "sonner"

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

type CreateUserRequest = {
  auth0Id: string
  email: string
}

export const useCreateUser = () => {
  const { getAccessTokenSilently } = useAuth0()
  const createUserRequest = async (user: CreateUserRequest): Promise<ApiResponse> => {
    const accessToken = await getAccessTokenSilently()
    const response = await fetch(`${API_BASE_URL}/api/user`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    })
    if (!response.ok) {
      throw new Error("Failed to create user")
    }
    return await response.json()
  }

  const {
    mutateAsync: createUser,
    isPending,
    isError,
    isSuccess,
  } = useMutation<ApiResponse, Error, CreateUserRequest>({
    mutationKey: ["createUser"],
    mutationFn: createUserRequest,
  })

  return {
    createUser,
    isPending,
    isError,
    isSuccess,
  }
}

type UpdateUserRequest = {
  name: string
  addressLine: string
  city: string
  country: string
}

export const useUpdateUser = () => {
  const { getAccessTokenSilently } = useAuth0()
  const updateUserRequest = async (formData: UpdateUserRequest): Promise<ApiResponse> => {
    const accessToken = await getAccessTokenSilently()
    const response = await fetch(`${API_BASE_URL}/api/user/update`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
    if (!response.ok) {
      throw new Error("Failed to create user")
    }
    return await response.json()
  }

  const {
    mutateAsync: updateUser,
    isPending,
    isSuccess,
    isError,
    error,
    reset,
  } = useMutation<ApiResponse, Error, UpdateUserRequest>({
    mutationKey: ["updateUser"],
    mutationFn: updateUserRequest,
    onSuccess: (res) => {
      toast.success(res?.message || "User updated")
    },
    onError: (error) => {
      toast.success(error?.message || "Error updating user")
    },
  })

  return {
    updateUser,
    isPending,
    isSuccess,
    isError,
    error,
    reset,
  }
}



export const useFetchCurrentUser = () => {
  const { getAccessTokenSilently } = useAuth0()
  const fetchCurrentUserRequest = async (): Promise<CurrentUserResponse> => {
    const accessToken = await getAccessTokenSilently()
    const response = await fetch(`${API_BASE_URL}/api/user/fetch`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    })
    if (!response.ok) {
      throw new Error("Failed to fetch user")
    }
    return await response.json()
  }

  const {
    data: currentUser,
    isPending,
    isError,
    error,
  } = useQuery<CurrentUserResponse, Error>({
    queryKey: ["fetchUser"],
    queryFn: fetchCurrentUserRequest,
  })

  if (isError) {
    toast.error(error.message.toString())
  }

  return {
    currentUser,
    isPending,
  }
}
