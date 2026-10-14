"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useWebinarStore } from "@/store/useWebinarStore"
import {
  PlusIcon,
  CheckCircle2,
  Copy,
  ExternalLink,
  ArrowRight,
} from "lucide-react"
import React, { useState } from "react"
import MultiStepForm from "./MultiStepForm"
import BasicInfoStep from "./BasicInfoStep"
import CtaStep from "./CtaStep"
import AdditionalInfoStep from "./AdditionalInfoStep"
import { toast } from "sonner"
import type Stripe from "stripe"

type Props = {
  stripeProducts: Stripe.Product[] | []
}

const CreateWebinarButton = ({ stripeProducts }: Props) => {
  const { isModalOpen, setModalOpen, isCompleted, setCompleted, resetForm } =
    useWebinarStore()
  const [webinarLink, setWebinarLink] = useState("")

  const steps = [
    {
      id: "basicInfo",
      title: "Basic Info",
      description: "Enter basic information about your webinar",
      component: <BasicInfoStep />,
    },
    {
      id: "cta",
      title: "Call to Action",
      description: "Set up your Call to Action and AI agent details",
      component: <CtaStep stripeProducts={stripeProducts} />,
    },
    {
      id: "additionalInfo",
      title: "Additional Info",
      description: "Configure chat settings and coupons",
      component: <AdditionalInfoStep />,
    },
  ]

  const handleComplete = (webinarId: string) => {
    setCompleted(true)
    setWebinarLink(`${window.location.origin}/live-webinar/${webinarId}`)
  }

  const handleOpenChange = (open: boolean) => {
    setModalOpen(open)
    if (!open) {
      // Reset form after close animation completes
      setTimeout(() => {
        resetForm()
      }, 300)
    }
  }

  const copyToClipboard = () => {
    if (webinarLink) {
      navigator.clipboard.writeText(webinarLink)
      toast.success("Webinar link copied to clipboard!")
    }
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger
        render={
          <Button className="gap-2 border border-orange-500/30 bg-orange-500/10 font-semibold text-white capitalize shadow-md shadow-orange-500/5 transition-all hover:bg-orange-500/20" />
        }
      >
        <PlusIcon className="h-4 w-4 text-orange-500" />
        Create Webinar
      </DialogTrigger>

      <DialogContent className="overflow-hidden border-zinc-800 bg-zinc-950/95 p-0 text-zinc-100 shadow-2xl backdrop-blur-md sm:max-w-[650px] md:max-w-[850px]">
        <DialogHeader className="p-0">
          {isCompleted ? (
            <div className="flex flex-col items-center justify-center space-y-6 p-8 text-center">
              <DialogTitle className="sr-only">Webinar Created</DialogTitle>

              {/* Animated Success Icon */}
              <div className="relative flex h-16 w-16 items-center justify-center rounded-full border border-orange-500/30 bg-orange-500/10 shadow-inner">
                <CheckCircle2 className="h-10 w-10 animate-pulse text-orange-500" />
                <span className="absolute inset-0 animate-ping rounded-full border border-orange-500 opacity-25"></span>
              </div>

              {/* Header */}
              <div className="space-y-2">
                <h3 className="text-2xl font-bold tracking-tight text-white">
                  Webinar Created Successfully!
                </h3>
                <p className="mx-auto max-w-md text-sm text-zinc-400">
                  Your interactive webinar is ready. Attendees can join using
                  the link below, where your custom Call to Action and AI agent
                  will be active.
                </p>
              </div>

              {/* Link Display Box */}
              <div className="flex w-full max-w-lg items-center justify-between gap-4 rounded-xl border border-zinc-800 bg-zinc-900/60 p-3.5">
                <span className="truncate font-mono text-xs text-zinc-300 select-all">
                  {webinarLink}
                </span>
                <div className="flex shrink-0 items-center gap-1.5">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={copyToClipboard}
                    className="h-8 px-2.5 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200"
                  >
                    <Copy className="mr-1.5 h-4 w-4" />
                    Copy
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    nativeButton={false}
                    render={
                      <a
                        href={webinarLink}
                        target="_blank"
                        rel="noreferrer"
                        aria-label="Open webinar in a new tab"
                      />
                    }
                    className="h-8 px-2.5 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex w-full max-w-md flex-col gap-3 pt-2 sm:flex-row">
                <Button
                  onClick={() => handleOpenChange(false)}
                  variant="outline"
                  className="flex-1 border-zinc-800 text-zinc-300 hover:bg-zinc-900 hover:text-zinc-100"
                >
                  Close Window
                </Button>
                <Button
                  nativeButton={false}
                  render={
                    <a href={webinarLink} target="_blank" rel="noreferrer" />
                  }
                  className="flex-1 gap-2 bg-orange-500 font-semibold text-white shadow-lg shadow-orange-500/20 hover:bg-orange-600"
                >
                  Go to Webinar Room
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ) : (
            <>
              <DialogTitle className="sr-only">Create Your Webinar</DialogTitle>
              <MultiStepForm steps={steps} onComplete={handleComplete} />
            </>
          )}
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}

export default CreateWebinarButton
