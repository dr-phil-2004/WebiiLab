import { useStripeElements } from '@/lib/stripe/stripe-client'
import { Elements } from '@stripe/react-stripe-js'
import React from 'react'
import Stripe from 'stripe'

type Props = {
    children: React.ReactNode
}

export const StripeElements = ({children}: Props) => {
    const {StripePromise} = useStripeElements()
    const promise= StripePromise()

  return promise && <Elements stripe={promise as any}>
    {children}
  </Elements>
}