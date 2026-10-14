import { changeAttendanceType } from "@/app/actions/attendance"
import { updateSubscription } from "@/app/actions/stripe"
import { stripe } from "@/lib/stripe"
import { headers } from "next/headers"
import { NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"

const STRIPE_SUBSCRIPTION_EVENTS = new Set<Stripe.Event.Type>([
  "invoice.created",
  "invoice.finalized",
  "invoice.paid",
  "checkout.session.completed",
  "customer.subscription.created",
  "customer.subscription.updated",
  "customer.subscription.deleted",
])

const getStripeEvent = async (
  body: string,
  sig: string | null
): Promise<Stripe.Event> => {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

  if (!webhookSecret || !sig) {
    throw new Error("Stripe signature or webhook secret missing")
  }

  return stripe.webhooks.constructEvent(body, sig, webhookSecret)
}

const isConnectedAccountEvent = (event: Stripe.Event): boolean => {
  if (event.account) return true
  const object = event.data.object as { metadata?: Stripe.Metadata | null }
  return Boolean(
    object.metadata?.connectAccountPayments ||
      object.metadata?.connectAccountSubscription
  )
}

const handleConnectedAccountEvent = async (event: Stripe.Event) => {
  if (event.type !== "checkout.session.completed") return

  const session = event.data.object
  const attendeeId = session.metadata?.attendeeId
  const webinarId = session.metadata?.webinarId
  if (attendeeId && webinarId) {
    await changeAttendanceType(attendeeId, webinarId, "CONVERTED")
  }
}

export async function POST(req: NextRequest) {
  const body = await req.text()
  const signature = (await headers()).get("Stripe-Signature")

  let stripeEvent: Stripe.Event
  try {
    stripeEvent = await getStripeEvent(body, signature)
  } catch (error) {
    console.error("Stripe webhook signature error", error)
    const message = error instanceof Error ? error.message : "Invalid payload"
    return NextResponse.json(`Webhook Error: ${message}`, { status: 400 })
  }

  try {
    if (!STRIPE_SUBSCRIPTION_EVENTS.has(stripeEvent.type)) {
      return NextResponse.json({ received: true }, { status: 200 })
    }

    if (isConnectedAccountEvent(stripeEvent)) {
      await handleConnectedAccountEvent(stripeEvent)
      return NextResponse.json({ received: true }, { status: 200 })
    }

    switch (stripeEvent.type) {
      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted":
        await updateSubscription(stripeEvent.data.object)
        break
      default:
        // Platform checkout sessions and invoices need no DB update today:
        // the subscription status is synced by the customer.subscription.* events.
        break
    }

    return NextResponse.json({ received: true }, { status: 200 })
  } catch (error) {
    console.error("Stripe webhook handler error", error)
    return NextResponse.json("Webhook handler failed", { status: 500 })
  }
}
