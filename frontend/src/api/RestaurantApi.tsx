import type { SearchStateType } from "@/pages/SearchPage"
import type { CitiesResponse, RestaurantSearchResponse } from "@/types/types"
import { useQuery } from "@tanstack/react-query"
import { toast } from "sonner"

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export const useSearchRestaurants = (searchState: SearchStateType, city?: string) => {
  // Sort cuisines to ensure consistent query keys and API params
  const sortedCuisines = [...searchState.selectedCuisines].sort()

  const createSearchRequest = async (): Promise<RestaurantSearchResponse> => {
    const params = new URLSearchParams()
    params.set("searchQuery", searchState.searchQuery)
    params.set("page", searchState.page.toString())
    params.set("selectedCuisines", sortedCuisines.join(","))
    params.set("sortOption", searchState.sortOption)

    const response = await fetch(`${API_BASE_URL}/api/restaurant/search/${city}?${params.toString()}`)
    if (!response.ok) {
      throw new Error("Failed to fetch restaurants")
    }

    return await response.json()
  }

  const {
    data: searchResults,
    isPending,
    isError,
    error,
  } = useQuery<RestaurantSearchResponse, Error>({
    queryKey: city
      ? ["searchResults", city, searchState.searchQuery, searchState.page, sortedCuisines, searchState.sortOption]
      : ["searchResults", searchState.searchQuery, searchState.page, sortedCuisines, searchState.sortOption],
    queryFn: createSearchRequest,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: false,
    enabled: !!city,
    staleTime: 5 * 60 * 1000, // Cache data for 5 minutes per city
  })

  if (isError) {
    toast.error(error.message.toString())
  }

  return { searchResults, isPending }
}

export const useFetchCities = () => {
  const fetchCitiesRequest = async (): Promise<CitiesResponse> => {
    const response = await fetch(`${API_BASE_URL}/api/restaurant/cities`)

    if (!response.ok) {
      throw new Error("Failed to fetch cities")
    }

    return await response.json()
  }

  const {
    data: cities,
    isPending,
    isSuccess,
    isError,
    error,
  } = useQuery<CitiesResponse, Error>({
    queryKey: ["fetchCities"],
    queryFn: fetchCitiesRequest,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: false,
  })

  if (isError) {
    console.log(error.message.toString())
  }

  return {
    cities,
    isSuccess,
    isPending,
  }
}
