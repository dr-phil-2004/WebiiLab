'use client'
import { Button } from '@/components/ui/button'
import type { User } from '@/lib/generated/prisma/client'
import { ArrowLeft, CloudLightningIcon, LightbulbIcon, Zap } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'
import React from 'react'
import YellowIcon from '../YellowIcon'
import CreateWebinarButton from '../CreateWebinarButton'
import Stripe from 'stripe'
import { StripeElements } from '@/components/Stripe/Elements'
import { SubscriptionModal } from '../SubscriptionModal'

type Props = {
    user: User
    stripeProduct: Stripe.Product[] | []
}


const Header = ({user, stripeProduct}: Props) => {
    const pathname = usePathname()
    const router = useRouter()
    

  return (
    <div className='w-full px-4 pt-10 sticky top-0 z-10 flex justify-between items-center
     flex-wrap  gap-4 bg-background'>
        {pathname.includes('pipeline') ? (
            <Button
            className= 'bg-primary/10 border border-border rounded-xl'
            variant={'outline'}
            onClick={ ()=> router.push('/webinars')}
            >

                <ArrowLeft /> Back to Webinars
            </Button>
        ) : (
          <div className="px-4 py-2  flex justify-center text-bold items-center 
          rounded-xl bg-background border border-border  text-primary capitalize
          ">

            {pathname.split('/')[1]}
          </div>
        )}

        <div className="flex gap-6  items-center flex-wrap">
          <YellowIcon>
            <Zap  />
          </YellowIcon>
          {user.subscription ? (<CreateWebinarButton stripeProducts={stripeProduct} />
        ) : (
          <StripeElements>
            <SubscriptionModal user={user} />
          </StripeElements>
        )}


          {/* <CreateWebinarButton stripeProducts={stripeProduct} /> */}
        </div>

    </div>
  )
}

export default Header