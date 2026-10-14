"use client"

import { useWebinarStore } from "@/store/useWebinarStore"
import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  AlertCircle,
  Check,
  ChevronRight,
  Loader2,
  ChevronLeft,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { createWebinar } from "@/app/actions/webinar"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

type Step = {
  id: string
  title: string
  description: string
  component: React.ReactNode
}

type Props = {
  steps: Step[]
  onComplete: (id: string) => void
}

const MultiStepForm = ({ steps, onComplete }: Props) => {
  const { formData, validateStep, isSubmitting, setSubmitting, setModalOpen } =
    useWebinarStore()
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
          toast.success("Your Webinar has been successfully created!")
          onComplete(result.webinarId)
        } else {
          const errMsg =
            result?.message ||
            "Failed to create webinar. Please verify all steps."
          toast.error(errMsg)
          setValidationErrors(errMsg)
        }
        router.refresh()
      } catch (error) {
        console.error("Error creating webinar:", error)
        toast.error("Failed to create webinar. Please try again.")
        setValidationErrors(
          "An unexpected error occurred. Please check details."
        )
      } finally {
        setSubmitting(false)
      }
    } else {
      setCurrentStepIndex((prev) => prev + 1)
    }
  }

  return (
    <div className="grid min-h-[500px] w-full grid-cols-1 overflow-hidden rounded-2xl bg-zinc-950/20 text-zinc-100 md:grid-cols-12">
      {/* Sidebar - Steps Indicator (Desktop: side, Mobile: top) */}
      <div className="col-span-1 flex flex-col justify-between border-b border-zinc-900/60 bg-zinc-900/10 p-5 md:col-span-4 md:border-r md:border-b-0">
        <div className="space-y-4 md:space-y-6">
          <div className="hidden md:block">
            <h3 className="text-xs font-semibold tracking-wider text-orange-500/80 uppercase">
              Configure Webinar
            </h3>
            <p className="mt-0.5 text-[10px] text-zinc-500">
              Complete all steps to launch
            </p>
          </div>

          {/* Steps list */}
          <div className="scrollbar-hide flex justify-between gap-4 overflow-x-auto pb-2 md:flex-col md:justify-start md:gap-6 md:overflow-x-visible md:pb-0">
            {steps.map((step, index) => {
              const isCompleted = completedStep.includes(step.id)
              const isCurrent = index === currentStepIndex
              const isPast = index < currentStepIndex

              return (
                <div
                  key={step.id}
                  className="relative flex shrink-0 items-center gap-3 md:shrink md:items-start"
                >
                  <div className="relative flex items-center justify-center">
                    <motion.div
                      animate={{
                        backgroundColor: isCompleted
                          ? "rgb(249, 115, 22)" // orange-500
                          : isCurrent
                            ? "rgba(249, 115, 22, 0.15)" // outline-orange
                            : "rgb(24, 24, 27)", // zinc-900
                        borderColor:
                          isCurrent || isCompleted
                            ? "rgb(249, 115, 22)"
                            : "rgb(39, 39, 42)",
                        scale: isCurrent ? 1.05 : 1,
                      }}
                      transition={{ duration: 0.25 }}
                      className={cn(
                        "z-10 flex h-8 w-8 items-center justify-center rounded-full border text-sm font-semibold select-none",
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
                            <Check className="h-4 w-4 stroke-[3px] text-zinc-950" />
                          </motion.div>
                        ) : (
                          <motion.span
                            key="number"
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className={cn(
                              isCurrent && "font-bold text-orange-500"
                            )}
                          >
                            {index + 1}
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </motion.div>

                    {/* Step line indicator (Desktop only) */}
                    {index < steps.length - 1 && (
                      <div className="absolute top-8 left-4 hidden h-10 w-px bg-zinc-800 md:block">
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{
                            height: isPast || isCompleted ? "100%" : "0%",
                          }}
                          className="w-full bg-orange-500 transition-all duration-300"
                        />
                      </div>
                    )}
                  </div>

                  <div className="hidden pt-0.5 text-left md:block">
                    <h4
                      className={cn(
                        "text-xs font-semibold transition-colors duration-200",
                        isCurrent
                          ? "text-orange-500"
                          : isCompleted
                            ? "text-zinc-200"
                            : "text-zinc-500"
                      )}
                    >
                      {step.title}
                    </h4>
                    <p className="mt-0.5 line-clamp-1 text-[10px] text-zinc-500">
                      {step.description}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Footer info (Desktop only) */}
        <div className="hidden border-t border-zinc-900/60 pt-4 md:block">
          <div className="flex items-center gap-2 text-[10px] text-zinc-600">
            <span>Secure Launch</span>
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500/80" />
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="col-span-1 flex min-h-[460px] flex-col justify-between p-6 md:col-span-8 md:p-8">
        <div>
          {/* Header */}
          <div className="mb-5 border-b border-zinc-900/60 pb-3">
            <h2 className="text-lg font-bold tracking-tight text-white">
              {currentStep.title}
            </h2>
            <p className="mt-1 text-xs text-zinc-400">
              {currentStep.description}
            </p>
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
              className="mt-4 flex items-start gap-2.5 rounded-lg border border-red-500/20 bg-red-500/5 p-3 text-xs text-red-400"
            >
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <p className="leading-relaxed font-medium">{validationErrors}</p>
            </motion.div>
          )}
        </div>

        {/* Navigation Actions */}
        <div className="mt-8 flex items-center justify-between border-t border-zinc-900/60 pt-4">
          <Button
            type="button"
            variant="ghost"
            onClick={handleBack}
            disabled={isSubmitting}
            className="h-9 gap-1.5 border border-zinc-800 bg-zinc-950/40 px-4 font-semibold text-zinc-400 transition-all hover:bg-zinc-900 hover:text-zinc-200"
          >
            {isFirstStep ? (
              "Cancel"
            ) : (
              <>
                <ChevronLeft className="h-4 w-4" />
                Back
              </>
            )}
          </Button>

          <Button
            type="button"
            onClick={handleNext}
            disabled={isSubmitting}
            className="h-9 gap-1.5 bg-orange-500 px-5 font-semibold text-white shadow-lg shadow-orange-500/10 transition-all hover:bg-orange-600 active:scale-95"
          >
            {isLastStep ? (
              isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Complete & Launch"
              )
            ) : (
              <>
                Next Step
                <ChevronRight className="h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default MultiStepForm
