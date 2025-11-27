import { useAuth0 } from "@auth0/auth0-react"
import { useMutation } from "@tanstack/react-query"

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

type CreateUserRequest = {
  auth0Id: string
  email: string
}

export const useCreateUser = () => {
  const {getAccessTokenSilently} = useAuth0()
  const createUserRequest = async (user: CreateUserRequest): Promise<CreateUserRequest> => {
    const accessToken = await getAccessTokenSilently()
    const response = await fetch(`${API_BASE_URL}/api/user`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });
    if (!response.ok) {
      throw new Error("Failed to create user");
    }
    return await response.json();
  }

  const {
    mutateAsync: createUser,
    isPending,
    isError,
    isSuccess,
  } = useMutation<CreateUserRequest, Error, CreateUserRequest>({
    mutationKey: ["createUser"],
    mutationFn: createUserRequest,
  });

  return {
    createUser,
    isPending,
    isError,
    isSuccess,
  };
}