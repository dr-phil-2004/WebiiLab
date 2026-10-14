"use client"
import { Button } from "@/components/ui/button"
import type { User } from "@/lib/generated/prisma/client"
import { ArrowLeft, CloudLightningIcon, LightbulbIcon, Zap } from "lucide-react"
import { usePathname, useRouter } from "next/navigation"
import React from "react"
import YellowIcon from "../YellowIcon"
import CreateWebinarButton from "../CreateWebinarButton"
import type Stripe from "stripe"
import { StripeElements } from "@/components/Stripe/Elements"
import { SubscriptionModal } from "../SubscriptionModal"

type Props = {
  user: User
  stripeProduct: Stripe.Product[] | []
}

const Header = ({ user, stripeProduct }: Props) => {
  const pathname = usePathname()
  const router = useRouter()

  return (
    <div className="sticky top-0 z-10 flex w-full flex-wrap items-center justify-between gap-4 bg-background px-4 pt-10">
      {pathname.includes("pipeline") ? (
        <Button
          className="rounded-xl border border-border bg-primary/10"
          variant={"outline"}
          onClick={() => router.push("/webinars")}
        >
          <ArrowLeft /> Back to Webinars
        </Button>
      ) : (
        <div className="text-bold flex items-center justify-center rounded-xl border border-border bg-background px-4 py-2 text-primary capitalize">
          {pathname.split("/")[1]}
        </div>
      )}

      <div className="flex flex-wrap items-center gap-6">
        <YellowIcon>
          <Zap />
        </YellowIcon>
        {user.subscription ? (
          <CreateWebinarButton stripeProducts={stripeProduct} />
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
