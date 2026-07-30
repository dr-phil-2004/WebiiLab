'use client'

import { useWebinarStore } from '@/store/useWebinarStore'
import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertCircle, Check, ChevronRight, Loader2, ChevronLeft } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { createWebinar } from '@/app/actions/webinar'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

type Step = {
    id: string
    title: string 
    description: string
    component: React.ReactNode
}

type Props = {
    steps: Step[]
    onComplete: (id : string) => void 
}

const MultiStepForm = ({ steps, onComplete }: Props) => {
  const { formData, validateStep, isSubmitting, setSubmitting, setModalOpen } = useWebinarStore()
  const [completedStep, setCompletedStep] = useState<string[]>([])
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [validationErrors, setValidationErrors] = useState<string | null>(null)

  const router = useRouter()
  const currentStep = steps[currentStepIndex]
  const isFirstStep = currentStepIndex === 0
  const isLastStep = currentStepIndex === steps.length - 1

  const handleBack = () => {
    if (isFirstStep) {
      setModalOpen(false)
    } else {
      setCurrentStepIndex((prev) => prev - 1)
      setValidationErrors(null)
    }
  }

  const handleNext = async () => {
    setValidationErrors(null)
    const isValid = validateStep(currentStep.id as keyof typeof formData)
    if (!isValid) {
      setValidationErrors("Please fill in all required fields correctly.")
      return
    }

    if (!completedStep.includes(currentStep.id)) {
      setCompletedStep([...completedStep, currentStep.id])
    }

    if (isLastStep) {
      try {
        setSubmitting(true)
        const result = await createWebinar(formData)
        if (result && result.status === 200 && result.webinarId) {
          toast.success('Your Webinar has been successfully created!')
          onComplete(result.webinarId)
        } else {
          const errMsg = result?.message || 'Failed to create webinar. Please verify all steps.'
          toast.error(errMsg)
          setValidationErrors(errMsg)
        }
        router.refresh()
      } catch (error) {
        console.error('Error creating webinar:', error)
        toast.error('Failed to create webinar. Please try again.')
        setValidationErrors('An unexpected error occurred. Please check details.')
      } finally {
        setSubmitting(false)
      }
    } else {
      setCurrentStepIndex((prev) => prev + 1)
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 w-full bg-zinc-950/20 text-zinc-100 rounded-2xl overflow-hidden min-h-[500px]">
      
      {/* Sidebar - Steps Indicator (Desktop: side, Mobile: top) */}
      <div className="col-span-1 md:col-span-4 p-5 bg-zinc-900/10 border-b md:border-b-0 md:border-r border-zinc-900/60 flex flex-col justify-between">
        <div className="space-y-4 md:space-y-6">
          <div className="hidden md:block">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-orange-500/80">Configure Webinar</h3>
            <p className="text-zinc-500 text-[10px] mt-0.5">Complete all steps to launch</p>
          </div>

          {/* Steps list */}
          <div className="flex md:flex-col justify-between md:justify-start gap-4 md:gap-6 overflow-x-auto md:overflow-x-visible pb-2 md:pb-0 scrollbar-hide">
            {steps.map((step, index) => {
              const isCompleted = completedStep.includes(step.id)
              const isCurrent = index === currentStepIndex
              const isPast = index < currentStepIndex

              return (
                <div key={step.id} className="relative flex items-center md:items-start gap-3 shrink-0 md:shrink">
                  <div className="relative flex items-center justify-center">
                    <motion.div
                      animate={{
                        backgroundColor: isCompleted
                          ? 'rgb(249, 115, 22)' // orange-500
                          : isCurrent
                          ? 'rgba(249, 115, 22, 0.15)' // outline-orange
                          : 'rgb(24, 24, 27)', // zinc-900
                        borderColor: isCurrent || isCompleted ? 'rgb(249, 115, 22)' : 'rgb(39, 39, 42)',
                        scale: isCurrent ? 1.05 : 1,
                      }}
                      transition={{ duration: 0.25 }}
                      className={cn(
                        "flex items-center justify-center w-8 h-8 rounded-full border text-sm font-semibold z-10 select-none",
                        isCompleted ? "text-zinc-950" : "text-zinc-400"
                      )}
                    >
                      <AnimatePresence mode="wait">
                        {isCompleted ? (
                          <motion.div
                            key="check"
                            initial={{ scale: 0.6, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.6, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <Check className="w-4 h-4 text-zinc-950 stroke-[3px]" />
                          </motion.div>
                        ) : (
                          <motion.span
                            key="number"
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className={cn(isCurrent && "text-orange-500 font-bold")}
                          >
                            {index + 1}
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </motion.div>

                    {/* Step line indicator (Desktop only) */}
                    {index < steps.length - 1 && (
                      <div className="absolute top-8 left-4 w-px h-10 bg-zinc-800 hidden md:block">
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: isPast || isCompleted ? '100%' : '0%' }}
                          className="w-full bg-orange-500 transition-all duration-300"
                        />
                      </div>
                    )}
                  </div>

                  <div className="hidden md:block pt-0.5 text-left">
                    <h4 className={cn(
                      "text-xs font-semibold transition-colors duration-200",
                      isCurrent ? "text-orange-500" : isCompleted ? "text-zinc-200" : "text-zinc-500"
                    )}>
                      {step.title}
                    </h4>
                    <p className="text-[10px] text-zinc-500 line-clamp-1 mt-0.5">{step.description}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Footer info (Desktop only) */}
        <div className="hidden md:block pt-4 border-t border-zinc-900/60">
          <div className="flex items-center gap-2 text-zinc-600 text-[10px]">
            <span>Secure Launch</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/80 animate-pulse" />
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="col-span-1 md:col-span-8 p-6 md:p-8 flex flex-col justify-between min-h-[460px]">
        <div>
          {/* Header */}
          <div className="mb-5 pb-3 border-b border-zinc-900/60">
            <h2 className="text-lg font-bold text-white tracking-tight">{currentStep.title}</h2>
            <p className="text-zinc-400 text-xs mt-1">{currentStep.description}</p>
          </div>

          {/* Form step components with sliding animations */}
          <div className="min-h-[260px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep.id}
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.2 }}
                className="w-full"
              >
                {currentStep.component}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Validation Banner */}
          {validationErrors && (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-3 rounded-lg border border-red-500/20 bg-red-500/5 text-red-400 text-xs flex items-start gap-2.5"
            >
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
              <p className="font-medium leading-relaxed">{validationErrors}</p>
            </motion.div>
          )}
        </div>

        {/* Navigation Actions */}
        <div className="mt-8 pt-4 border-t border-zinc-900/60 flex items-center justify-between">
          <Button
            type="button"
            variant="ghost"
            onClick={handleBack}
            disabled={isSubmitting}
            className="border border-zinc-800 bg-zinc-950/40 hover:bg-zinc-900 text-zinc-400 hover:text-zinc-200 transition-all font-semibold gap-1.5 px-4 h-9"
          >
            {isFirstStep ? (
              'Cancel'
            ) : (
              <>
                <ChevronLeft className="w-4 h-4" />
                Back
              </>
            )}
          </Button>

          <Button
            type="button"
            onClick={handleNext}
            disabled={isSubmitting}
            className="bg-orange-500 hover:bg-orange-600 text-white font-semibold gap-1.5 px-5 h-9 shadow-lg shadow-orange-500/10 active:scale-95 transition-all"
          >
            {isLastStep ? (
              isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Creating...
                </>
              ) : (
                'Complete & Launch'
              )
            ) : (
              <>
                Next Step
                <ChevronRight className="w-4 h-4" />
              </>
            )}
          </Button>
        </div>
      </div>

    </div>
  )
}

export default MultiStepForm