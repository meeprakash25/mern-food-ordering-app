import { Loader2 } from "lucide-react"
import { Button } from "./ui/button"

const LoadingButton = () => {
  return (
    <Button disabled className="flex flex-row justify-center align-middle w-full">
      <Loader2 className="mr-1 h-4 w-4 animate-spin" />
      <span>Please wait...</span>
    </Button>
  )
}

export default LoadingButton
