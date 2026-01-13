import { FormDescription, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { cuisinesList } from "@/config/restaurant-options-config"
import { useFormContext } from "react-hook-form"
import CuisineCheckbox from "./CuisineCheckbox"

const Cuisines = () => {
  const {control} = useFormContext()
  return (
    <div className="space-y-2">
      <div>
        <h2 className="text-2xl font-bold">Cuisines</h2>
        <FormDescription>Select the cuisines that your restaurant serves</FormDescription>
      </div>
      <FormField
        control={control}
        name="cuisines"
        render={({ field }) => (
          <FormItem>
            <div className="grid md:grid-cols-5 gap-1">
              {cuisinesList.map((cuisine, index) => (
                <CuisineCheckbox key={index} cuisine={cuisine} field={field} />
              ))}
            </div>
            <FormMessage />
          </FormItem>
        )}></FormField>
    </div>
  )
}

export default Cuisines