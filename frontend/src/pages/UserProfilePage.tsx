import { useFetchCurrentUser, useUpdateUser } from "@/api/UserApi"
import UserProfileForm from "@/forms/user-profile-form/UserProfileForm"

const UserProfilePage = () => {
  const { currentUser, isPending: isGetLoading } = useFetchCurrentUser()
  const { updateUser, isPending: isUpdateLoading } = useUpdateUser()
  if (isGetLoading) {
    return <span>Loading...</span>
  }
  if (!currentUser) {
    return <span>Unable to load current user</span>
  }
  return <UserProfileForm onSave={updateUser} isLoading={isUpdateLoading} currentUser={currentUser} />
}

export default UserProfilePage
