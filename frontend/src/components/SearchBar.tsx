import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import z from "zod"
import { Form, FormControl, FormField, FormItem } from "./ui/form"
import { Search } from "lucide-react"
import { Input } from "./ui/input"
import { Button } from "./ui/button"

const formSchema = z.object({
  searchQuery: z.string().nonempty("Restaurant name field is required"),
})

export type SearchForm = z.infer<typeof formSchema>

type Props = {
  onSubmit: (FormData: SearchForm) => void
  placeholder: string
  onReset: () => void
}

const SearchBar = ({ onSubmit, placeholder, onReset }: Props) => {
  const form = useForm<SearchForm>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      searchQuery: "",
    },
  })

  const handleReset = () => {
    form.reset({
      searchQuery: "",
    })
    if (onReset) {
      onReset()
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={`flex items-center flex-1 gap-1 justify-between flex-row border-2 border-amber-600 rounded-full p-2 mx-5 
            ${form.formState.errors.searchQuery && "border-red-600"}`}>
        <Search strokeWidth={2.5} size={30} className="ml-0 text-amber-600 hidden md:block" />
        <FormField
          control={form.control}
          name="searchQuery"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormControl>
                <Input
                  {...field}
                  className="border-none shadow-none font-normal text-xl md:text-xl focus-visible:ring-0"
                  placeholder={placeholder}
                />
              </FormControl>
            </FormItem>
          )}
        />
        {form.formState.isDirty && (
          <Button onClick={handleReset} type="button" variant="outline" className="rounded-full">
            Clear
          </Button>
        )}

        <Button type="submit" className="rounded-full bg-amber-600">
          Search
        </Button>
      </form>
    </Form>
  )
}

export default SearchBar
