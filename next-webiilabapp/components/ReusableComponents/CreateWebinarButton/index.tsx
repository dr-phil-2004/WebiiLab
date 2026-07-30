'use client'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { useWebinarStore } from '@/store/useWebinarStore'
import { PlusIcon, CheckCircle2, Copy, ExternalLink, ArrowRight } from 'lucide-react'
import React, { useState } from 'react'
import MultiStepForm from './MultiStepForm'
import BasicInfoStep from './BasicInfoStep'
import CtaStep from './CtaStep'
import AdditionalInfoStep from './AdditionalInfoStep'
import { toast } from 'sonner'

type Props = {}

const CreateWebinarButton = (props: Props) => {
    const { isModalOpen, setModalOpen, isCompleted, setCompleted, resetForm } = useWebinarStore()
    const [webinarLink, setWebinarLink] = useState('')

    const steps = [
        {
            id: 'basicInfo',
            title: 'Basic Info',
            description: 'Enter basic information about your webinar',
            component: <BasicInfoStep />
        },
        {
            id: 'cta',
            title: 'Call to Action',
            description: 'Set up your Call to Action and AI agent details',
            component: <CtaStep />
        },
        {
            id: 'additionalInfo',
            title: 'Additional Info',
            description: 'Configure chat settings and coupons',
            component: <AdditionalInfoStep />
        }
    ]

    const handleComplete = (webinarId: string) => {
      setCompleted(true)
      setWebinarLink(
        `${window.location.origin}/live-webinar/${webinarId}`
      )
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
        toast.success('Webinar link copied to clipboard!')
      }
    }

  return (
    <Dialog open={isModalOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button 
          className="border border-orange-500/30 text-white font-semibold bg-orange-500/10 hover:bg-orange-500/20 capitalize gap-2 transition-all shadow-md shadow-orange-500/5"
          onClick={() => setModalOpen(true)}
        >
          <PlusIcon className="w-4 h-4 text-orange-500" />
          Create Webinar
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[650px] md:max-w-[850px] border-zinc-800 bg-zinc-950/95 text-zinc-100 p-0 overflow-hidden shadow-2xl backdrop-blur-md">
        <DialogHeader className="p-0">
          {isCompleted ? (
            <div className="flex flex-col items-center justify-center p-8 text-center space-y-6">
              <DialogTitle className="sr-only">Webinar Created</DialogTitle>
              
              {/* Animated Success Icon */}
              <div className="relative flex items-center justify-center w-16 h-16 rounded-full bg-orange-500/10 border border-orange-500/30 shadow-inner">
                <CheckCircle2 className="w-10 h-10 text-orange-500 animate-pulse" />
                <span className="absolute inset-0 rounded-full border border-orange-500 animate-ping opacity-25"></span>
              </div>

              {/* Header */}
              <div className="space-y-2">
                <h3 className="text-2xl font-bold tracking-tight text-white">Webinar Created Successfully!</h3>
                <p className="text-zinc-400 text-sm max-w-md mx-auto">
                  Your interactive webinar is ready. Attendees can join using the link below, where your custom Call to Action and AI agent will be active.
                </p>
              </div>

              {/* Link Display Box */}
              <div className="w-full max-w-lg bg-zinc-900/60 border border-zinc-800 rounded-xl p-3.5 flex items-center justify-between gap-4">
                <span className="text-xs text-zinc-300 font-mono truncate select-all">{webinarLink}</span>
                <div className="flex items-center gap-1.5 shrink-0">
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    onClick={copyToClipboard}
                    className="h-8 px-2.5 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200"
                  >
                    <Copy className="w-4 h-4 mr-1.5" />
                    Copy
                  </Button>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    asChild
                    className="h-8 px-2.5 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200"
                  >
                    <a href={webinarLink} target="_blank" rel="noreferrer">
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </Button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md pt-2">
                <Button 
                  onClick={() => handleOpenChange(false)}
                  variant="outline" 
                  className="flex-1 border-zinc-800 hover:bg-zinc-900 text-zinc-300 hover:text-zinc-100"
                >
                  Close Window
                </Button>
                <Button 
                  asChild
                  className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-semibold gap-2 shadow-lg shadow-orange-500/20"
                >
                  <a href={webinarLink} target="_blank" rel="noreferrer">
                    Go to Webinar Room
                    <ArrowRight className="w-4 h-4" />
                  </a>
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