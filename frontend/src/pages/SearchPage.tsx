import { useSearchRestaurants } from "@/api/RestaurantApi"
import CuisinesFilter from "@/components/CuisinesFilter"
import PaginationSelector from "@/components/PaginationSelector"
import SearchBar, { type SearchForm } from "@/components/SearchBar"
import SearchResultCard from "@/components/SearchResultCard"
import SearchResultsInfo from "@/components/SearchResultsInfo"
import SortOptionDropdown from "@/components/SortOptionDropdown"
import { useState } from "react"
import { useParams } from "react-router-dom"

export type SearchStateType = {
  searchQuery: string
  page: number
  selectedCuisines: string[]
  sortOption: string
}

const SearchPage = () => {
  const { city } = useParams()

  const [searchState, setSearchState] = useState<SearchStateType>({
    searchQuery: "",
    page: 1,
    selectedCuisines: [],
    sortOption: "bestMatch",
  })

  const [isExpanded, setIsExpanded] = useState<boolean>(false)

  const { searchResults: results, isPending } = useSearchRestaurants(searchState, city)

  const setSortOption = (sortOption: string) => {
    setSearchState((prevState) => ({
      ...prevState,
      sortOption,
      page: 1,
    }))
  }

  const setSelectedCuisines = (selectedCuisines: string[]) => {
    setSearchState((prevState) => ({
      ...prevState,
      selectedCuisines,
      page: 1,
    }))
  }

  const setPage = (page: number) => {
    setSearchState((prevState) => ({
      ...prevState,
      page,
    }))
  }

  const setSearchQuery = (searchFormData: SearchForm) => {
    setSearchState((prevState) => ({
      ...prevState,
      searchQuery: searchFormData.searchQuery,
      page: 1, // Reset to page 1 when search query changes
    }))
  }

  const resetSearch = () => {
    setSearchState((prevState) => ({
      ...prevState,
      searchQuery: "",
      page: 1, // Reset to page 1 when search is reset
    }))
  }

  if (isPending) {
    return <span>Loading...</span>
  }

  // if (!results || results?.data.pagination.total === 0 || !city) {
  //   return <span>No results found</span>
  // }

  const result = results?.data

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[250px_1fr] gap-5">
      <div id="cuisines-list">
        <CuisinesFilter
          isExpanded={isExpanded}
          onExpandedClick={() => setIsExpanded((prevIsExpanded) => !prevIsExpanded)}
          selectedCuisines={searchState.selectedCuisines}
          onChange={setSelectedCuisines}
        />
      </div>
      <div id="main-content" className="flex flex-col gap-2">
        <SearchBar
          searchQuery={searchState.searchQuery}
          onSubmit={setSearchQuery}
          placeholder="Search by Cuisine or Restaurant Name"
          onReset={resetSearch}
        />
        <div className="flex justify-between flex-col gap-3 lg:flex-row">
          <SearchResultsInfo total={result?.pagination.total || 0} city={city || ""} />
          <SortOptionDropdown sortOption={searchState.sortOption} onChange={(value) => setSortOption(value)} />
        </div>
        {result?.restaurants.map((restaurant, index) => (
          <SearchResultCard key={index} restaurant={restaurant} />
        ))}
        <PaginationSelector
          page={result?.pagination.page || 0}
          pages={result?.pagination.pages || 0}
          onPageChange={setPage}
        />
      </div>
    </div>
  )
}

export default SearchPage
