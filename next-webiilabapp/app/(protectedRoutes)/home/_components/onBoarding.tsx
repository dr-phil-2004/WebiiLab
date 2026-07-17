import { onBoardingSteps } from '@/lib/data'
import { CheckCircle, CircleCheck } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

type Props = {}

const onBoarding = (props: Props) => {
  return (
    <div className='flex flex-col gap-1 items-start justify-start'>
        {
            onBoardingSteps.map((step, index)=> (
                <Link
                key={index}
                href={step.link}
                className='flex items-center gap-2'
                >
                    <CircleCheck size={15} />
                    <p className="text-base text-foreground">{step.title}</p>
                </Link>
            )
            
            )
        }
    </div>
  )
}

export default onBoarding