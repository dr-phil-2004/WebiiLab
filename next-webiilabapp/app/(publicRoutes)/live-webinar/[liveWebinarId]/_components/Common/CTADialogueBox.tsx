import { createCheckoutLink } from "@/app/actions/stripe"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { WebinarWithPresenter } from "@/lib/type"
import { ChevronRight, Loader2, Play } from "lucide-react"
import { useRouter } from "next/navigation"
import React, { useState } from "react"
import { toast } from "sonner"

type Props = {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  trigger?: React.ReactNode
  userId: string
  webinar: WebinarWithPresenter
}

const CTADialogueBox = ({
  open,
  onOpenChange,
  trigger,
  userId,
  webinar,
}: Props) => {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const handleClick = async () => {
    try {
      setLoading(true)
      if (webinar?.ctaType === "BOOK_A_CALL") {
        router.push(`/live-webinar/${webinar?.id}/bcall?attendedId=${userId}`)
      } else {
        if (!webinar.priceId || !webinar.presenter.stripeConnectId) {
          return toast.error("Something went wrong. Please try again later.")
        }
        const session = await createCheckoutLink(
          webinar.priceId,
          webinar.presenter.stripeConnectId,
          userId,
          webinar.id,
          true
        )

        if (!session.sessionUrl) {
          throw new Error("Session ID is not found ")
        }
        window.open(session.sessionUrl, "_blank")
      }
    } catch (error) {
      console.error("Error creating checkout link", error)
      toast.error("Something went wrong. Please try again later.")
    } finally {
      setLoading(false)
    }
    if (webinar?.ctaType === "BOOK_A_CALL") {
      router.push(`/live-webinar/${webinar?.id}/break-room`)
    } else {
      router.push(`/live-webinar/${webinar?.id}/checkout`)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger>{trigger}</DialogTrigger>}
      <DialogContent className="border-border bg-card text-card-foreground sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-medium">
            {webinar?.ctaType === "BOOK_A_CALL" ? "Book a call" : "Buy Now "}
          </DialogTitle>
          <p className="mt-1 text-sm text-muted-foreground">
            {webinar?.ctaType === "BOOK_A_CALL"
              ? "You will br redirected to a call on another page"
              : "You will br redirected to a checkout"}
          </p>
        </DialogHeader>
        <div className="mt-4 flex space-x-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-md bg-muted">
            <div className="flex-items-center h-8 w-8 justify-center rounded-full bg-background">
              <Play />
            </div>
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-medium">{webinar.title}</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              {webinar.description}
            </p>
          </div>
        </div>

        <DialogFooter className="mt-4 flex items-center justify-between sm:mt-0">
          <DialogClose>Close </DialogClose>
          <Button variant="outline" className="text-muted-foreground">
            Cancel
          </Button>

          <Button
            onClick={handleClick}
            disabled={loading}
            className="flex items-center"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...
              </>
            ) : (
              `Proceed to ${webinar?.ctaType === "BOOK_A_CALL" ? "CJoin Break Room" : "Buy Now"}`
            )}
            <ChevronRight className="h-4 w-4" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default CTADialogueBox
