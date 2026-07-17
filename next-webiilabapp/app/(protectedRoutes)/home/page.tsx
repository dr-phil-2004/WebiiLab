import React from 'react'
import OnBoarding from './_components/onBoarding'

type Props = {}

const page = (props: Props) => {
  return (
    <div className='w-full mx-auto h-full'>
      <div className="w-full flex flex-col sm:flex-row  justify-between
      items-start gap-14
    ">

      <div className="space-y-6">
        <h2 className="text-gray-800 font-semibold text-2xl dark:text-neutral-200">
          Let&apos;s Create Your First Webinar Funnel!
        </h2>
        <p className='text-primary text-muted-foreground text-xl'>  
          Watch how easy it is to create your first webinar funnel and start 
        </p>
        <OnBoarding />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 place-content-center">
        
      </div>
    </div>
    </div>
  )
}

export default page