import landingImage from "../assets/landing.png"
import appDownloadImage from "../assets/appDownload.png"
import SearchBar, { type SearchForm } from "@/components/SearchBar"
import { useNavigate } from "react-router-dom"
import { useFetchCities } from "@/api/RestaurantApi"
import CitiesBadge from "@/components/CitiesBadge"

const HomePage = () => {

  const {cities} = useFetchCities()

  const navigate = useNavigate()
  const handleSearchSubmit = (searchFormValues: SearchForm) => {
    navigate({
      pathname: `/search/${searchFormValues.searchQuery}`,
    })
  }
  return (
    <div className="flex flex-col gap-12">
      <div className="md:px-32 bg-white rounded-lg shadow-md py-8 flex flex-col gap-3 text-center -mt-18">
        <h1 className="text-5xl font-bold tracking-tight text-amber-600">Tuck into a takeaway today</h1>
        <span className="text-xl">Food is just a click away!</span>
        <SearchBar placeholder="Search by city or town" onSubmit={handleSearchSubmit} />
        {cities?.data && <CitiesBadge cities={cities.data} />}
      </div>
      <div className="grid md:grid-cols-2 gap-5">
        <img src={landingImage} alt="LandingImage" />
        <div>
          <div className="flex flex-col items-center justify-center gap-4 text-center">
            <span className="font-bold text-3xl tracking-tighter">Order takeaway even faster!</span>
            <span>Download the MearnEats App for faster ordering and personalized recommendations</span>
            <img src={appDownloadImage} alt="Download Image" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomePage
