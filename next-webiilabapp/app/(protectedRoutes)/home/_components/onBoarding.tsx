import { onBoardingSteps } from "@/lib/data"
import { Circle, CheckCircle2 } from "lucide-react"
import Link from "next/link"
import React from "react"

const onBoarding = () => {
  const completedCount = onBoardingSteps.filter((step) => step.complete).length
  const totalSteps = onBoardingSteps.length
  const progressPercentage = (completedCount / totalSteps) * 100

  return (
    <div className="w-full max-w-md space-y-5 rounded-2xl border border-border bg-card/40 p-6 shadow-lg backdrop-blur-md">
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="font-semibold text-primary">Setup Progress</span>
          <span className="text-xs font-medium text-muted-foreground">
            {completedCount} of {totalSteps} completed
          </span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
          <div
            className="h-full bg-primary transition-all duration-500 ease-out"
            style={{ width: `${progressPercentage || 10}%` }}
          />
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {onBoardingSteps.map((step, index) => {
          const isComplete = step.complete
          return (
            <Link
              key={index}
              href={step.link || "#"}
              className={`group flex items-center justify-between rounded-xl border border-border/50 bg-background/50 p-3 transition-all duration-200 hover:bg-secondary/40 ${
                isComplete ? "opacity-70" : ""
              }`}
            >
              <div className="flex items-center gap-3">
                {isComplete ? (
                  <CheckCircle2 size={18} className="shrink-0 text-primary" />
                ) : (
                  <Circle
                    size={18}
                    className="shrink-0 text-muted-foreground transition-colors group-hover:text-primary"
                  />
                )}
                <span className="text-sm font-medium text-foreground transition-colors group-hover:text-primary">
                  {step.title}
                </span>
              </div>
              <span className="text-xs text-muted-foreground transition-transform group-hover:translate-x-0.5">
                {isComplete ? "Done" : "Start →"}
              </span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

export default onBoarding
