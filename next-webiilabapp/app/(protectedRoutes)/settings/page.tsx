import { onAuthenticateUser } from "@/app/actions/auth"
import { getStripeOAuthLink } from "@/lib/stripe/utils"
import {
  LucideAlertCircle,
  LucideArrowRight,
  LucideCheckCircle2,
} from "lucide-react"
import Link from "next/link"
import { redirect } from "next/navigation"
import React from "react"

const page = async () => {
  const userExists = await onAuthenticateUser()
  if (!userExists.user) {
    redirect("/sign-in")
  }

  const isConnected = !!userExists?.user?.stripeConnectId

  const stripelinks = getStripeOAuthLink(
    "api/stripe-connect",
    userExists.user.id
  )

  return (
    <div className="mx-auto w-full px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">Manage your account</h1>
      <h2 className="mb-4 text-xl font-semibold">
        Add Payment Options to your webinar
      </h2>
      <div className="w-full rounded-lg border border-input bg-background shadow-sm">
        <div className="mb-4 flex items-center">
          <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-orange-700 to-yellow-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 576 512"
              fill="none"
            >
              <path
                fill="white"
                d="M309.5-18.9c-4.1-8-12.4-13.1-21.4-13.1s-17.3 5.1-21.4 13.1L193.1 125.3 33.2 150.7c-8.9 1.4-16.3 7.7-19.1 16.3s-.5 18 5.8 24.4l114.4 114.5-25.2 159.9c-1.4 8.9 2.3 17.9 9.6 23.2s16.9 6.1 25 2L288.1 417.6 432.4 491c8 4.1 17.7 3.3 25-2s11-14.2 9.6-23.2L441.7 305.9 556.1 191.4c6.4-6.4 8.6-15.8 5.8-24.4s-10.1-14.9-19.1-16.3L383 125.3 309.5-18.9z"
              />
            </svg>
          </div>
          <div className="">
            <h2 className="text-xl font-semibold text-primary">
              Stripe Connect
            </h2>
            <p className="text-sm text-muted-foreground">
              Connect your Stripe account to start accepting payments
            </p>
          </div>
        </div>
        <div className="my-6 rounded-md bg-muted p-4">
          <div className="flex items-start">
            {isConnected ? (
              <LucideCheckCircle2 className="mt-0.5 mr-3 h-5 w-5 flex-shrink-0 text-green-500" />
            ) : (
              <LucideAlertCircle className="mt-0.5 mr-3 h-5 w-5 flex-shrink-0 text-amber-500" />
            )}
            <div className="">
              <p className="font-medium">
                {isConnected
                  ? "Stripe account connected"
                  : "Stripe account not connected yet "}
              </p>
              <p className="text-sm text-muted-foreground">
                {isConnected
                  ? "You can now accept payments for your webinars"
                  : "Please connect your Stripe account to accept payments for your webinars"}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4">
          <div className="text-sm text-muted-foreground">
            {isConnected
              ? "You can reconnect anytime if needed"
              : "You'll redirect to  Stripe  to complete  the connection "}
          </div>
          <Link
            href={stripelinks}
            className={`mb-2 flex items-center gap-2 rounded-md px-5 py-2.5 text-sm font-medium transition-colors ${
              isConnected
                ? "bg-muted text-foreground hover:bg-muted/80"
                : "bg-gradient-to-r from-orange-600 to-yellow-500 text-white hover:brightness-110"
            } `}
          >
            {isConnected ? "Reconnect " : "Connect your Stripe account"}
            <LucideArrowRight size={16} />
          </Link>
        </div>
        {!isConnected && (
          <div className="mt-6 border-t border-border pt-6">
            <h3 className="mb-2 p-2 text-lg font-semibold">
              Why connect with stripe ?
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="m-4 flex items-center gap-2">
                <div className="flex h-4 w-4 items-center justify-center rounded-full bg-green-100">
                  <div className="h-1.5 w-1.5 rounded-full bg-green-500"></div>
                </div>
                Process payments securely from customers worldwide
              </li>
              <li className="m-4 flex items-center gap-2">
                <div className="flex h-4 w-4 items-center justify-center rounded-full bg-green-100">
                  <div className="h-1.5 w-1.5 rounded-full bg-green-500"></div>
                </div>
                Manage subscription and recurring billing
              </li>
              <li className="m-4 flex items-center gap-2">
                <div className="flex h-4 w-4 items-center justify-center rounded-full bg-green-100">
                  <div className="h-1.5 w-1.5 rounded-full bg-green-500"></div>
                </div>
                Access detailed financial reports and analytics
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}

export default page
