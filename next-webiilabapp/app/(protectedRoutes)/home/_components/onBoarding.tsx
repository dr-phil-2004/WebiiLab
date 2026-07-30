import { onBoardingSteps } from '@/lib/data'
import { CircleCheck, Circle, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

type Props = {}

const onBoarding = (props: Props) => {
  const completedCount = onBoardingSteps.filter(step => step.complete).length
  const totalSteps = onBoardingSteps.length
  const progressPercentage = (completedCount / totalSteps) * 100

  return (
    <div className='w-full max-w-md p-6 rounded-2xl border border-border bg-card/40 backdrop-blur-md shadow-lg space-y-5'>
      <div className="space-y-2">
        <div className="flex justify-between items-center text-sm">
          <span className="font-semibold text-primary">Setup Progress</span>
          <span className="text-xs text-muted-foreground font-medium">{completedCount} of {totalSteps} completed</span>
        </div>
        <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary transition-all duration-500 ease-out" 
            style={{ width: `${progressPercentage || 10}%` }}
          />
        </div>
      </div>

      <div className='flex flex-col gap-3'>
        {onBoardingSteps.map((step, index) => {
          const isComplete = step.complete
          return (
            <Link
              key={index}
              href={step.link || '#'}
              className={`flex items-center justify-between p-3 rounded-xl border border-border/50 bg-background/50 hover:bg-secondary/40 transition-all duration-200 group ${
                isComplete ? 'opacity-70' : ''
              }`}
            >
              <div className="flex items-center gap-3">
                {isComplete ? (
                  <CheckCircle2 size={18} className="text-primary shrink-0" />
                ) : (
                  <Circle size={18} className="text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                )}
                <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                  {step.title}
                </span>
              </div>
              <span className="text-xs text-muted-foreground group-hover:translate-x-0.5 transition-transform">
                {isComplete ? 'Done' : 'Start →'}
              </span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

export default onBoarding