import { buttonVariants } from "@/components/ui/Button"
import { toast } from "./use-toast"
import Link from "next/link"

export const customToast=() => {
  const loginToast=()=>{
    const {dismiss}= toast({
        title:'Login required',
        description: 'You need to be logged in to do that',
        variant: 'destructive',
        action:(
            <Link className={buttonVariants({variant: 'outline'})} onClick={()=>dismiss()} href='/sign-in'>Login</Link>
        )
    })

  }
  
  return {loginToast}
}