import {
  useCreateUserRestaurant,
  useGetUserRestaurant,
  useGetUserRestaurantOrders,
  useUpdateUserRestaurant,
} from "@/api/UserRestaurantApi"
import OrderItemCard from "@/components/OrderItemCard"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ManageRestaurantForm from "@/forms/manage-restaurant-form/ManageRestaurantForm"
import type { Order } from "@/types/types"
import { useState } from "react"

const ManageRestaurantPage = () => {
  const { createUserRestaurant, isPending: isCreatePending } = useCreateUserRestaurant()
  const { updateUserRestaurant, isPending: isUpdatePending } = useUpdateUserRestaurant()

  const { result: ordersResult, isPending: isOrdersPending } = useGetUserRestaurantOrders()
  const orders = ordersResult?.data as Order[]

  const [activeTab, setActiveTab] = useState("orders")

  const {
    userRestaurant,
    isPending: isGetRestaurantPending,
    refetch: refetchUserRestaurant,
  } = useGetUserRestaurant({ enabled: false })

  const isEditing = !!userRestaurant?.data

  const handleTabChange = (value: string) => {
    setActiveTab(value)
    if (value === "manage-restaurant") {
      void refetchUserRestaurant()
    }
  }
  return (
    <Tabs defaultValue="orders" value={activeTab} onValueChange={handleTabChange}>
      <TabsList variant="line">
        <TabsTrigger value="orders" className="font-bold text-xl">
          Orders
        </TabsTrigger>
        <TabsTrigger value="manage-restaurant" className="font-bold text-xl">
          Manage Restaurant
        </TabsTrigger>
      </TabsList>
      <TabsContent value="orders" className="space-y-5 bg-gray-50 rounded-lg p-2 md:p-8">
        {isOrdersPending ?
          <p>Loading...</p>
        : !orders ?
          <p>No orders found</p>
        : <>
            <h2 className="text-2xl font-bold">{orders.length} active orders</h2>
            {orders.map((order) => (
              <OrderItemCard key={order._id} order={order} />
            ))}
          </>
        }
      </TabsContent>
      <TabsContent value="manage-restaurant" className="space-y-5 bg-gray-50 rounded-lg p-2 md:p-8">
        {isGetRestaurantPending ?
          <p>Loading...</p>
        : <ManageRestaurantForm
            restaurant={userRestaurant}
            onSave={isEditing ? updateUserRestaurant : createUserRestaurant}
            isLoading={isCreatePending || isUpdatePending || isGetRestaurantPending}
          />
        }
      </TabsContent>
    </Tabs>
  )
}

export default ManageRestaurantPage
