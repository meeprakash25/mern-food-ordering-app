import { useCreateUserRestaurant, useGetUserRestaurant, useUpdateUserRestaurant } from "@/api/UserRestaurantApi"
import ManageRestaurantForm from "@/forms/manage-restaurant-form/ManageRestaurantForm"

const ManageRestaurantPage = () => {
  const { createUserRestaurant, isPending: isCreatePending } = useCreateUserRestaurant()
  const { updateUserRestaurant, isPending: isUpdatePending } = useUpdateUserRestaurant()
  const { userRestaurant, isPending: isFetchPending } = useGetUserRestaurant()

  const isEditing = !!userRestaurant?.data

  return (
    <ManageRestaurantForm
      restaurant={userRestaurant}
      onSave={isEditing ? updateUserRestaurant : createUserRestaurant}
      isLoading={isCreatePending || isUpdatePending}
    />
  )
}

export default ManageRestaurantPage
