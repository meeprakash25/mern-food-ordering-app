import { zodResolver } from "@hookform/resolvers/zod"
import { FormProvider, useForm } from "react-hook-form"
import { z } from "zod"
import DetailsSection from "./DetailsSection"
import { Separator } from "@/components/ui/separator"
import Cuisines from "./Cuisines"
import MenuSection from "./MenuSection"
import ImageSection from "./ImageSection"
import LoadingButton from "@/components/LoadingButton"
import { Button } from "@/components/ui/button"
import type { RestaurantResponse } from "@/types/types"
import { useEffect } from "react"

const formSchema = z
  .object({
    restaurantName: z.string().min(1, "Restaurant name is required"),
    city: z.string().min(1, "City is required"),
    country: z.string().min(1, "Country is required"),
    deliveryPrice: z.number().min(0, "Delivery price is required"),
    estimatedDeliveryTime: z.number().min(0, "Estimated delivery time is required"),
    cuisines: z.array(z.string()).min(1, "Cuisines is required"),
    menuItems: z
      .array(
        z.object({
          name: z.string().min(1, " is required"),
          price: z.number().min(0, " is required"),
        })
      )
      .min(1, "Menu items is required"),
    imageUrl: z.string().optional(),
    imageFile: z
      .custom<File>((file) => file instanceof File, { message: "Image file is required" })
      .refine((file) => file && file.type.startsWith("image/"), {
        message: "Only image files are allowed",
      })
      .refine((file) => file && file.size < 5 * 1024 * 1024, {
        message: "Image size must be less than 5MB",
      })
      .optional(),
  })
  .refine((data) => data.imageUrl || data.imageFile, {
    message: "Either image URL or image File must be provided",
    path: ["imageFile"],
  })

export type RestaurantFormData = z.infer<typeof formSchema>

type Props = {
  restaurant?: RestaurantResponse
  onSave: (RestaurantFormData: FormData) => void
  isLoading: boolean
}

// Helper function to convert string numbers to actual numbers
const convertRestaurantData = (data: any): Partial<RestaurantFormData> => {
  return {
    restaurantName: data.restaurantName || "",
    city: data.city || "",
    country: data.country || "",
    deliveryPrice: parseFloat(data.deliveryPrice) || 0,
    estimatedDeliveryTime: parseInt(data.estimatedDeliveryTime, 10) || 0,
    cuisines: data.cuisines || [],
    menuItems:
      data.menuItems?.map((item: any) => ({
        name: item.name || "",
        price: parseFloat(item.price) || 0,
      })) || [],
    imageUrl: data.imageUrl || undefined,
  }
}

const ManageRestaurantForm = ({ onSave, isLoading, restaurant }: Props) => {
  const form = useForm<RestaurantFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: restaurant?.data
      ? convertRestaurantData(restaurant.data)
      : {
          restaurantName: "",
          city: "",
          country: "",
          deliveryPrice: 0,
          estimatedDeliveryTime: 0,
          cuisines: [],
          menuItems: [{ name: "", price: 0 }],
          imageUrl: undefined,
          imageFile: undefined as any,
        },
  })

  useEffect(() => {
    if (!restaurant) {
      return
    }
    const formData = convertRestaurantData(restaurant.data)
    form.reset(formData)
  }, [form, restaurant])

  const onSubmit = (formDataJson: RestaurantFormData) => {
    const formData = new FormData()
    formData.append("restaurantName", formDataJson.restaurantName)
    formData.append("city", formDataJson.city)
    formData.append("country", formDataJson.country)
    formData.append("deliveryPrice", formDataJson.deliveryPrice.toString())
    formData.append("estimatedDeliveryTime", formDataJson.estimatedDeliveryTime.toString())
    formDataJson.cuisines.forEach((cuisine, index) => {
      formData.append(`cuisines[${index}]`, cuisine)
    })
    formDataJson.menuItems.forEach((menuItem, index) => {
      formData.append(`menuItems[${index}][name]`, menuItem.name)
      formData.append(`menuItems[${index}][price]`, menuItem.price.toString())
    })
    if (formDataJson.imageFile) {
      formData.append("imageFile", formDataJson.imageFile)
    }
    onSave(formData)
  }

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 bg-gray-50 rounded-lg p-2 md:p-10">
        <DetailsSection />
        <Separator />
        <Cuisines />
        <Separator />
        <MenuSection />
        <Separator />
        <ImageSection />
        <div className="w-full md:w-40">
          {isLoading ?
            <LoadingButton />
          : <Button type="submit" className="bg-amber-600 hover:bg-amber-700 w-full">
              Submit
            </Button>
          }
        </div>
      </form>
    </FormProvider>
  )
}

export default ManageRestaurantForm
