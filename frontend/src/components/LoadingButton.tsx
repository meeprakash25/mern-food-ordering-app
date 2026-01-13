import { Loader2 } from "lucide-react"
import { Button } from "./ui/button"

const LoadingButton = () => {
  return (
    <Button disabled>
      <Loader2 className="mr-1 h-4 w-4 animate-spin" />
      Please wait...
    </Button>
  )
}

export default LoadingButton
