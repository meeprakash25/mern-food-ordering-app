import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import LoadingButton from "@/components/LoadingButton"
import { Button } from "@/components/ui/button"
import type { CurrentUserResponse } from "@/types/types"
import { useEffect } from "react"

const formSchema = z.object({
  email: z.string().optional(),
  name: z.string("Name is required").min(1, "Name is required"),
  addressLine: z.string("Address Line 1 is required").min(1, "Address Line 1 is required"),
  city: z.string("City is required").min(1, "City is required"),
  country: z.string("Country is required").min(1, "Country is required"),
})

export type UserFormData = z.infer<typeof formSchema>

type Props = {
  onSave: (userProfileData: UserFormData) => void
  isLoading: boolean
  currentUser: CurrentUserResponse
  title?: string
  description?: string
  buttonText?: string
}

function UserProfileForm({ onSave, isLoading, currentUser, title = "User Profile", description="View and change your profile information here", buttonText = "Submit" }: Props) {
const form = useForm<UserFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: currentUser.data,
  })

  useEffect(() => {
    form.reset(currentUser.data)
  }, [currentUser, form])

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSave)} className="space-y-4 bg-gray-50 rounded-lg md:p-10">
        <div>
          <h2 className="text-2xl font-bold">{title}</h2>
          <FormDescription>{description}</FormDescription>
        </div>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input {...field} disabled className="bg-white" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} className="bg-white" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex flex-col md:flex-row gap-4">
          <FormField
            control={form.control}
            name="addressLine"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Address Line 1</FormLabel>
                <FormControl>
                  <Input {...field} className="bg-white" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>City</FormLabel>
                <FormControl>
                  <Input {...field} className="bg-white" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="country"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Country</FormLabel>
                <FormControl>
                  <Input {...field} className="bg-white" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="w-full md:w-40">
          {isLoading ?
            <LoadingButton />
          : <Button type="submit" className="bg-amber-600 hover:bg-amber-700 active:bg-amber-700 w-full">
              {buttonText}
            </Button>
          }
        </div>
      </form>
    </Form>
  )
}

export default UserProfileForm
