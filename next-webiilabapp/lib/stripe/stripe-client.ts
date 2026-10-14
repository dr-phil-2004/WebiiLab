import { loadStripe, type Stripe } from "@stripe/stripe-js"

// Stripe.js must be loaded once per account: <Elements> does not accept a
// new promise on re-render, so we cache one promise per (connected) account.
const stripePromises = new Map<string, Promise<Stripe | null>>()

export const getStripePromise = (
  connectedAccountId?: string
): Promise<Stripe | null> => {
  const key = connectedAccountId ?? "platform"
  const cached = stripePromises.get(key)
  if (cached) return cached

  const promise = loadStripe(
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? "",
    connectedAccountId ? { stripeAccount: connectedAccountId } : undefined
  )
  stripePromises.set(key, promise)
  return promise
}
