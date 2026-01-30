import { useAuth0 } from "@auth0/auth0-react"
import { useLocation } from "react-router-dom"
import { Button } from "./ui/button"
import LoadingButton from "./LoadingButton"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog"
import UserProfileForm, { type UserFormData } from "@/forms/user-profile-form/UserProfileForm"
import { useFetchCurrentUser } from "@/api/UserApi"

type Props = {
  onCheckout: (userFormData: UserFormData) => void
  disabled: boolean
  isLoading: boolean
}

const CheckoutButton = ({ onCheckout, disabled, isLoading }: Props) => {
  const { isAuthenticated, isLoading: isAuthLoading, loginWithRedirect } = useAuth0()

  const { pathname } = useLocation()

  const { currentUser, isPending: isGetUserLoading } = useFetchCurrentUser()

  const onLogin = async () => {
    await loginWithRedirect({
      appState: {
        returnTo: pathname,
      },
    })
  }

  if (!isAuthenticated) {
    return (
      <Button onClick={onLogin} className="bg-amber-600 hover:bg-amber-700 flex-1">
        Login to checkout
      </Button>
    )
  }

  if (isAuthLoading || !currentUser || isLoading) {
    return <LoadingButton />
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button disabled={disabled} className="bg-amber-600 hover:bg-amber-700 flex-1">
          Goto checkout
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[450px] md:min-w-[800px] bg-gray-50 p-0 gap-0">
        <DialogHeader className="h-0">
          <DialogTitle></DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <UserProfileForm
          currentUser={currentUser}
          onSave={onCheckout}
          isLoading={isGetUserLoading}
          title="Delivery Details"
          description="Confirm your delivery details"
          buttonText="Continue to payment"
        />
      </DialogContent>
    </Dialog>
  )
}

export default CheckoutButton
