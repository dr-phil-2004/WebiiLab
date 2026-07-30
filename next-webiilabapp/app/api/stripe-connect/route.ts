import { prismaClient } from "@/lib/prismaClient";
import { stripe } from "@/lib/stripe";
import { NextRequest, NextResponse } from "next/server";

export async function  GET(request: NextRequest){
   try {
     const searchParams= request.nextUrl.searchParams
    const code = searchParams.get('code')
    const state = searchParams.get('state')


    if(!code || !state){
        console.log('Missing Required Parameters:', {code, state})
        return NextResponse.redirect(
            new URL(
                `settings?success=false&message=Missing+Required+Parameters`,
                request.url
            )
         )
    }


    console.log('Processing Stripe connect callback :', {code,stateId:state})

    try {
        const response = await stripe.oauth.token({
            grant_type:'authorization_code',
            code,
        })

        if(!response.stripe_user_id){
            throw new Error('Stripe user id is missing from the response')
        }

        await prismaClient.user.update(
           { where:{
                id:state,

            },
            data:{
                stripeConnectId: response.stripe_user_id
            },}
        )
        console.log('Successfully  connected  Stripe account :', {
                userId: state,
                stripeConnectId: response.stripe_user_id
        })
        return NextResponse.redirect(
            new URL(
                'settings?success=true&message=Stripe+account+connected+successfully',
                request.url
            )
        )
        
    } catch (stripeError) {
        console.error('Error processing Stripe connect callback:', stripeError)
        return NextResponse.redirect(
            new URL(
                `settings?success=false&message=${encodeURIComponent((stripeError as Error ).message)}`,
                request.url
            )
        )
    }
    
   } catch (error) {
    console.error('Error processing Stripe connect callback:', error)
    return NextResponse.redirect(
        new URL(
            'settings?success=false&message=Failed+to+process+Stripe+connect+callback',
            request.url
        )
    )
   }
}