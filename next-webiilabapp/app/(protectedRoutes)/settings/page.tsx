import { onAuthenticateUser } from '@/app/actions/auth'
import { getStripeOAuthLink } from '@/lib/stripe/utils'
import { LucideAlertCircle, LucideArrowRight, LucideCheckCircle, LucideCheckCircle2 } from 'lucide-react'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import React from 'react'

type Props = {}

const page = async (props: Props) => {
  const userExists = await onAuthenticateUser()
  if(!userExists.user){
    redirect('/sign-in')
  }

  const isConnected = !!userExists?.user?.stripeConnectId;

  const stripelinks= getStripeOAuthLink(
    "api/stripe-connect",
    userExists.user.id
  )
  
  return (
    <div className='w-full mx-auto py-8 px-4'>
        <h1 className='text-2xl font-bold mb-6'>Manage your account</h1>
        <h2 className='text-xl font-semibold mb-4'>Add Payment Options to your webinar</h2>
        <div className="w-full border border-input  rounded-lg bg-background shadow-sm">
            <div className="flex items-center mb-4">
                <div className="h-10 w-10  rounded-full bg-gradient-to-r 
                 from-orange-700 to-yellow-600 flex 
                 items-center justify-center mr-4">
<svg xmlns="http://www.w3.org/2000/svg" width='24' height='24' viewBox="0 0 576 512" fill='none'><path  fill='white' d="M309.5-18.9c-4.1-8-12.4-13.1-21.4-13.1s-17.3 5.1-21.4 13.1L193.1 125.3 33.2 150.7c-8.9 1.4-16.3 7.7-19.1 16.3s-.5 18 5.8 24.4l114.4 114.5-25.2 159.9c-1.4 8.9 2.3 17.9 9.6 23.2s16.9 6.1 25 2L288.1 417.6 432.4 491c8 4.1 17.7 3.3 25-2s11-14.2 9.6-23.2L441.7 305.9 556.1 191.4c6.4-6.4 8.6-15.8 5.8-24.4s-10.1-14.9-19.1-16.3L383 125.3 309.5-18.9z"/></svg>
                 </div>
                 <div className="">
                  <h2 className="text-xl font-semibold text-primary">
                    Stripe Connect 
                  </h2>
                  <p className='text-muted-foreground text-sm'>
                    Connect your Stripe account  to start  accepting  payments
                  </p>
                 </div>
            </div>
            <div className="my-6 p-4 bg-muted rounded-md">
              <div className="flex items-start ">
                {isConnected? (
                  <LucideCheckCircle2 className='h-5 w-5 text-green-500  mt-0.5 mr-3  flex-shrink-0' />
                ) :(
                  <LucideAlertCircle className='h-5 w-5 text-amber-500 mt-0.5 mr-3 flex-shrink-0'/>
                )}
                <div className="">
                  <p className="font-medium">
                    {isConnected ? 'Stripe account connected'
                     : 'Stripe account not connected yet '}
                  </p>
                  <p className='text-muted-foreground text-sm'>
                    {isConnected ? 'You can now accept payments for your webinars'
                     : 'Please connect your Stripe account to accept payments for your webinars'}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center justify-between gap-4">
              <div className="text-sm text-muted-foreground">
                {isConnected ? (
                  'You can reconnect anytime if needed'
                ):(
                  "You'll redirect to  Stripe  to complete  the connection "
                )}
              </div>
              <Link
              href={stripelinks}
              className={`px-5 py-2.5 rounded-md font-medium text-sm flex items-center mb-2
              gap-2 transition-colors
              ${isConnected ? "bg-muted hover:bg-muted/80 text-foreground "
            : "bg-gradient-to-r from-orange-600 to-yellow-500 text-white hover:brightness-110"
            }
              `}>
              
              {isConnected ? "Reconnect " : "Connect your Stripe account"}
              <LucideArrowRight size={16} />
              </Link>
            </div>
            {!isConnected && 
              <div className="mt-6 pt-6 border-t  border-border ">
                <h3 className="text-lg font-semibold mb-2 p-2">
                 Why connect with stripe ?
                </h3>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li className="flex items-center gap-2 m-4">
                    <div className="h-4 w-4 rounded-full bg-green-100  flex items-center justify-center ">
                      <div className="h-1.5 w-1.5 rounded-full bg-green-500"></div>
                    </div>
                    Process payments securely from customers worldwide 
                  </li>
                                    <li className="flex items-center gap-2 m-4">
                    <div className="h-4 w-4 rounded-full bg-green-100  flex items-center justify-center ">
                      <div className="h-1.5 w-1.5 rounded-full bg-green-500"></div>
                    </div>
                    Manage subscription and recurring billing
                  </li>
                                    <li className="flex items-center gap-2 m-4">
                    <div className="h-4 w-4 rounded-full bg-green-100  flex items-center justify-center ">
                      <div className="h-1.5 w-1.5 rounded-full bg-green-500"></div>
                    </div>
                    Access detailed financial reports and analytics 
                  </li>


                </ul>
              </div>
            }
        </div>
    </div>
  )
}

export default page