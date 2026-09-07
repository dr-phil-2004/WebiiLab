'use client'

import { onGetStripeClientSecret } from '@/app/actions/stripe'
import { Button } from '@/components/ui/button'
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import type { User } from '@/lib/generated/prisma/client'
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js'
import { Loader2, PlusIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'

import React, { useState } from 'react'
import { toast } from 'sonner'

type Props = {
    user: User
}

export const SubscriptionModal = ({user}: Props) => {
    const router = useRouter()
    const stripe = useStripe()
    const elements= useElements()
    const [loading, setLoading] = useState(false)
    const handleSubmit = async()=>{
        try {
            setLoading(true)
            if(!stripe || !elements){
               return toast.error('Stripe not Initialized')
            }
            const intent = await onGetStripeClientSecret(user.email, user.id)

            if (!intent?.secret) {
                throw new Error(intent?.error || 'Failed to initialize payment')
            }
            const cardElement = elements.getElement(CardElement)

            if(!cardElement){
                throw new Error('Card element not found')
            }

            const {error, paymentIntent} = await stripe.confirmCardPayment(intent.secret, {
                payment_method: {
                    card:cardElement,
                    
                },
            })
            if(error){
                throw new Error(error.message)
            }
            console.log('Payment successful', paymentIntent)
             toast.success('Payment successful')
            router.refresh()
        } catch (error: any) {
            console.log('SUBSCRIPTION--->', error)
            toast.error(error?.message || 'Failed to update subscription')
            
        }finally{
            setLoading(false)
        }
    }
  return (
    <Dialog>
        <DialogTrigger>
            <button className='rounded-xl flex gap-2 items-center hover:cursor-pointer px-4 py-2 
            border border-border bg-primary/10 backdrop-blur-sm text-sm font-normal text-stone gover:bg-primary-20 
            '>
                <PlusIcon />
               Create Webinar 
                
                </button>
        </DialogTrigger>
        <DialogContent className='sm:max-w-[425px]'>
            <DialogHeader>
                <DialogTitle>Webiilab Subscriptions</DialogTitle>
            </DialogHeader>
            <CardElement 
            options={{
                style:{
                    base:{
                        fontSize:'16px',
                        color:'#B4B0AE',
                        '::placeholder':{
                            color:'#B4B0AE'
                        }
                    },
                    invalid:{
                        color:'#e82828ff',
                        '::placeholder': {
                        color: '#FFFAFA',
                        },
                    },
                },
            }}
            
            className='border-[1px] outline-none  rounded-lg p-3 w-full' />
            <DialogFooter className='gap-4 items-center '>
                <DialogClose
                className='w-full sm:w-auto border border-border rounded-md px-3 py-2'
                disabled={loading}
                >
                    Cancel
                </DialogClose>
                <Button type='submit'
                className='w-full sm:w-auto'
                onClick={handleSubmit}
                disabled={loading}
                >
                    {loading ? (
                        <>
                        <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                        Loading...
                        </>
                    ):
                    (
                        'Confirm'
                    )}
                    
                </Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
  )
}

