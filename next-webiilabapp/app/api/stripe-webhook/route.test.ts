import { beforeEach, describe, expect, it, vi } from "vitest"
import type Stripe from "stripe"

const constructEvent = vi.fn()
const changeAttendanceType = vi.fn()
const updateSubscription = vi.fn()

vi.mock("@/lib/stripe", () => ({
  stripe: {
    webhooks: {
      constructEvent: (...args: unknown[]) => constructEvent(...args),
    },
  },
}))
vi.mock("@/app/actions/attendance", () => ({
  changeAttendanceType: (...args: unknown[]) => changeAttendanceType(...args),
}))
vi.mock("@/app/actions/stripe", () => ({
  updateSubscription: (...args: unknown[]) => updateSubscription(...args),
}))
vi.mock("next/headers", () => ({
  headers: async () => new Headers({ "Stripe-Signature": "sig_test" }),
}))

const { POST } = await import("./route")

const request = () =>
  new Request("http://localhost/api/stripe-webhook", {
    method: "POST",
    body: "{}",
  }) as unknown as Parameters<typeof POST>[0]

const event = (type: string, object: object, account?: string) =>
  ({ type, account, data: { object } }) as unknown as Stripe.Event

describe("POST /api/stripe-webhook", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    process.env.STRIPE_WEBHOOK_SECRET = "whsec_test"
  })

  it("marks the attendee as CONVERTED when a webinar checkout completes", async () => {
    constructEvent.mockReturnValue(
      event("checkout.session.completed", {
        metadata: {
          attendeeId: "att_1",
          webinarId: "web_1",
          connectAccountPayments: "true",
        },
      })
    )

    const res = await POST(request())

    expect(res.status).toBe(200)
    expect(changeAttendanceType).toHaveBeenCalledWith(
      "att_1",
      "web_1",
      "CONVERTED"
    )
    expect(updateSubscription).not.toHaveBeenCalled()
  })

  it("treats events coming from a connected account as attendee events", async () => {
    constructEvent.mockReturnValue(
      event(
        "checkout.session.completed",
        { metadata: { attendeeId: "att_2", webinarId: "web_2" } },
        "acct_123"
      )
    )

    await POST(request())

    expect(changeAttendanceType).toHaveBeenCalledWith(
      "att_2",
      "web_2",
      "CONVERTED"
    )
    expect(updateSubscription).not.toHaveBeenCalled()
  })

  it("does not pass a platform checkout session to updateSubscription", async () => {
    constructEvent.mockReturnValue(
      event("checkout.session.completed", { metadata: {} })
    )

    const res = await POST(request())

    expect(res.status).toBe(200)
    expect(updateSubscription).not.toHaveBeenCalled()
  })

  it.each([
    "customer.subscription.created",
    "customer.subscription.updated",
    "customer.subscription.deleted",
  ])("syncs the subscription on %s", async (type) => {
    const subscription = { status: "active", metadata: { userId: "user_1" } }
    constructEvent.mockReturnValue(event(type, subscription))

    await POST(request())

    expect(updateSubscription).toHaveBeenCalledWith(subscription)
  })

  it("rejects an invalid signature with 400", async () => {
    constructEvent.mockImplementation(() => {
      throw new Error("No signatures found matching the expected signature")
    })

    const res = await POST(request())

    expect(res.status).toBe(400)
    expect(updateSubscription).not.toHaveBeenCalled()
  })
})
