import React from 'react'
import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? '', {
    apiVersion: '2026-07-29.dahlia',
    appInfo:{
        name: 'Webinar Funnel',
        version:'1.0.0'
    }
}

) 