import { useAuth0 } from "@auth0/auth0-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu"
import { CircleUserRound } from "lucide-react"
import { Link } from "react-router-dom"
import { Button } from "./ui/button"
import { Separator } from "./ui/separator"

const UsernameMenu = () => {
  const {user, logout} = useAuth0()
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center px-3 font-bold hover:text-amber-600 gap-2">
        <CircleUserRound className="text-amber-600" />
        {user?.email}
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>
          <Link to="/user-profile" className="font-bold hover:text-amber-600">
            User Profile
          </Link>
        </DropdownMenuItem>
        <Separator />
        <DropdownMenuItem>
          <Button onClick={() => logout()} className="flex flex-1 font-bold bg-amber-600 hover:bg-amber-700 transition-all">
            Log Out
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default UsernameMenu;