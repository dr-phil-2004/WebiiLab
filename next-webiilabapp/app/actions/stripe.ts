'use server'
import React from 'react'
import { onAuthenticateUser } from './auth'
import { stripe } from '@/lib/stripe'
import Stripe from 'stripe'
import { subscriptionPriceId } from '@/lib/data'
import { prismaClient } from '@/lib/prismaClient'
import { changeAttendanceType } from './attendance'


export const getAllproductsFromStripe = async () => {
 try {
     const currentUser = await onAuthenticateUser()

  if(!currentUser.user){
    return{
        error:'User not authenticated',
        status:401,
        success: false,
    }
  }
  if(!currentUser.user.stripeConnectId){
    return{
        error:'User not connected to Stripe',
        status:401,
        success:false,
    }
  }

  const products =  await stripe.products.list({},
    {
        stripeAccount: currentUser.user.stripeConnectId,
    }
  )

  return{
    products: products.data,
    status:200,
    success: true ,

  }
 } catch (error) {
    console.log('Error getting products  from stripe ')
    return{
        error:' Error getting products form stripe',
        status: 500,
        success:false
    }
    
 }
    
}

export const onGetStripeClientSecret = async (email: string, userId: string) =>{
  try {
    const currentUser = await onAuthenticateUser()
    if(!currentUser){
      return{
        error:'Error getting products from stripe',
        status:401,
        success:false
      }
    }

    let customer : Stripe.Customer
    const existingCustomer = await stripe.customers.list({email:email})
    if(existingCustomer.data.length > 0){
      customer = existingCustomer.data[0]

    }else{
      customer = await stripe.customers.create({email: email,
        metadata:{
          userId: userId,
        }
      })
    }

    await prismaClient.user.update({
      where:{
        id:userId
      },
      data:{
        stripeCustomerId: customer.id
      }
    })

    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [{ price: subscriptionPriceId }],
      payment_behavior: 'default_incomplete',
      expand: ['latest_invoice.payment_intent'],
      metadata: {
        userId: userId,
      },
    })

    let clientSecret: string | null = null
    const latestInvoice = subscription.latest_invoice as any

    if (typeof latestInvoice === 'object' && latestInvoice !== null) {
      if (typeof latestInvoice.payment_intent === 'object' && latestInvoice.payment_intent !== null) {
        clientSecret = latestInvoice.payment_intent.client_secret
      } else if (typeof latestInvoice.payment_intent === 'string') {
        const pi = await stripe.paymentIntents.retrieve(latestInvoice.payment_intent)
        clientSecret = pi.client_secret
      }
    }

    // Fallback 1: Retrieve invoice directly with expanded payment_intent
    if (!clientSecret) {
      const invoiceId = typeof latestInvoice === 'string' ? latestInvoice : latestInvoice?.id
      if (invoiceId) {
        const invoice = (await stripe.invoices.retrieve(invoiceId, {
          expand: ['payment_intent'],
        })) as any

        if (typeof invoice.payment_intent === 'object' && invoice.payment_intent !== null) {
          clientSecret = invoice.payment_intent.client_secret
        } else if (typeof invoice.payment_intent === 'string') {
          const pi = await stripe.paymentIntents.retrieve(invoice.payment_intent)
          clientSecret = pi.client_secret
        }
      }
    }

    // Fallback 2: Retrieve the latest PaymentIntent for the customer directly
    if (!clientSecret) {
      const paymentIntents = await stripe.paymentIntents.list({
        customer: customer.id,
        limit: 1,
      })
      if (paymentIntents.data.length > 0) {
        clientSecret = paymentIntents.data[0].client_secret
      }
    }

    if (!clientSecret) {
      console.error('Failed to resolve client_secret for subscription:', subscription.id)
      return {
        status: 400,
        error: 'Failed to retrieve payment intent client secret',
        success: false,
      }
    }

    return {
      status: 200,
      secret: clientSecret,
      customer: customer.id,
      success: true,
    }
  } catch (error) {
    console.error('Subscription creation error', error)
    return {
      status: 400,
      error: 'Failed to create subscription',
      success: false,
    }
  }
    
}

export const updateSubscription = async(subscription: Stripe.Subscription) =>{
  try {
    const userid = subscription.metadata.userId

    await prismaClient.user.update({
      where:{
        id: userid
      },
      data:{
        subscription: subscription.status === 'active' ?true : false,
        
      }
    })
    
  } catch (error) {
    console.error('Error updating subscription:', error)
    
  }
}

export const createCheckoutLink = async(priceId: string,stripeId: string, attendeeId: string, webinarId: string, bookCall:boolean=false)=>{


  try {

    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price:priceId,
          quantity:1

        },

      ],
      mode:'payment',
      success_url:`${process.env.NEXT_PUBLIC_BASE_URL}/`,
      cancel_url:`${process.env.NEXT_PUBLIC_BASE_URL}/`,
      metadata:{
        attendeeId:attendeeId,
        webinarId: webinarId,
      },

    },
  {
    stripeAccount: stripeId,
  
  }

)
  if(bookCall){
    await changeAttendanceType(attendeeId, webinardId, "ADDED_TO_CART")
  }
 return{
  sessionUrl: session.url,
  status:200,
  success:true,
 }  
    
  } catch (error) {
    console.log('Error creating checkout link ', error)
    return{
      error:'Error creating checkout link ',
      status:500,
      success:false,
    }
    
  }
}
    

