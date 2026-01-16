import { Link } from "react-router-dom"
import { Badge } from "./ui/badge"

type Props = {
  cities: string[]
}

const CitiesBadge = ({ cities }: Props) => {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex w-full flex-wrap gap-2">
        {cities.map((city, index) => (
          <Link key={city + index} to={`/search/${city}`}>
            <Badge variant="outline">{city}</Badge>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default CitiesBadge
