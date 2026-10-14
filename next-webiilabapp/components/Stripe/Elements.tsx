"use client"

import { getStripePromise } from "@/lib/stripe/stripe-client"
import { Elements } from "@stripe/react-stripe-js"
import React from "react"

type Props = {
  children: React.ReactNode
  connectedAccountId?: string
}

export const StripeElements = ({ children, connectedAccountId }: Props) => {
  return (
    <Elements stripe={getStripePromise(connectedAccountId)}>
      {children}
    </Elements>
  )
}
