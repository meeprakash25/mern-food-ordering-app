import { CircleUserRound, Menu } from "lucide-react"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet"
import { Separator } from "./ui/separator"
import { Button } from "./ui/button"
import { useAuth0 } from "@auth0/auth0-react"
import MobileNavLinks from "./MobileNavLinks"

const MobileNav = () => {
  const { isAuthenticated, loginWithRedirect, user } = useAuth0()
  return (
    <Sheet>
      <SheetTrigger>
        <Menu className="text-amber-600" />
      </SheetTrigger>
      <SheetContent className="space-y-3">
        <SheetHeader>
          <SheetTitle className="lex flex-col gap-4">
            {isAuthenticated ? (
              <span className="flex items-center font-bold gap-2">
                <CircleUserRound className="text-amber-600" />
                {user?.email}
              </span>
            ) : (
              <span className="text-amber-600">Welcome to MernEats.com!</span>
            )}
          </SheetTitle>
          <Separator />
          <SheetDescription className="flex flex-col gap-4">
            {isAuthenticated ? (
              <MobileNavLinks />
            ) : (
              <Button
                onClick={async () => await loginWithRedirect()}
                className="flex-1 font-bold bg-amber-600 hover:bg-amber-700">
                Login
              </Button>
            )}
          </SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  )
}

export default MobileNav
