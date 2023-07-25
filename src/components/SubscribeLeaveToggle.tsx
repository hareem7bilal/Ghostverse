"use client"

import { FC, startTransition } from 'react'
import { Button } from './ui/Button'
import { useMutation } from '@tanstack/react-query'
import {GhostitSubscriptionPayload} from '@/lib/validators/ghostit'
import axios, { AxiosError } from 'axios'
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { customToast } from "@/hooks/use-custom-toast"

interface SubscribeLeaveToggleProps {
  ghostitId: string,
  ghostitName: string,
  isSubscribed: boolean
}

const SubscribeLeaveToggle: FC<SubscribeLeaveToggleProps> = ({ghostitId, ghostitName, isSubscribed}) => {
    const router = useRouter()
    const { toast } = useToast()
    const { loginToast } = customToast()

    
    const {mutate:subscribe, isLoading:isSubLoading}=useMutation({
        mutationFn: async()=>{
            const payload: GhostitSubscriptionPayload={
                ghostitId,
            }
            const {data}=await axios.post('/api/ghostit/subscribe', payload)
            return data as string

        },
        onError: (err) => {
            if (err instanceof AxiosError) {

                if (err.response?.status === 401) {
                    return loginToast()
                }

            }

            return toast({
                title: 'There was an error',
                description: 'Something went wrong, please try again',
                variant: 'destructive'
            })
          
        },
        onSuccess: (data)=>{
            startTransition(()=>{
                router.refresh()
            })
          
            return toast({
                title: 'Subscribed',
                description: `You are now subscribed to g/${ghostitName}`
            })

        }

    })



    const {mutate:unsubscribe, isLoading:isUnsubLoading}=useMutation({
        mutationFn: async()=>{
            const payload: GhostitSubscriptionPayload={
                ghostitId,
            }
            const {data}=await axios.post('/api/ghostit/unsubscribe', payload)
            return data as string

        },
        onError: (err) => {
            if (err instanceof AxiosError) {

                if (err.response?.status === 401) {
                    return loginToast()
                }

            }

            return toast({
                title: 'There was an error',
                description: 'Something went wrong, please try again',
                variant: 'destructive'
            })
          
        },
        onSuccess: (data)=>{
            startTransition(()=>{
                router.refresh()
            })
          
            return toast({
                title: 'Unsubscribed',
                description: `You are now unsubscribed from g/${ghostitName}`
            })

        }

    })

  return isSubscribed?
  <Button className='w-full mt-1 mb-4' isLoading={isUnsubLoading} onClick={()=>unsubscribe()}>Leave community</Button>:
  <Button className='w-full mt-1 mb-4' isLoading={isSubLoading} onClick={()=>subscribe()}>Join to post</Button>
}

export default SubscribeLeaveToggle