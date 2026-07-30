import { Webinar } from '@/lib/generated/prisma/client'
import { format } from 'date-fns'
import { Calendar } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { PipelineIcon } from '../[webinarId]/pipeline/page'

type Props = {

    webinar: Webinar
}

const WebinarCards = ({webinar}: Props) => {
  return <div className="flex gap-3 flex-col items-start w-full">

    <Link 
    href={`/webinars/${webinar.id}`}
    className="w-full max-w-[400px]"
    
    
    
    >

      
        <Image
        src={'/darkthumnail.png'}
        alt='webinar'
        width={400}
        height={200}
        className='rounded-md w-[400px]'
        
        
        />
        

    </Link>
    <div className="w-full flex justify-between gap-3  items-center ">

        <Link
        href={`/webinars/${webinar.id}`}
        className='flex flex-col gap-2 items-start '
        
        
        
        >
            <div className="">
                <p className="text-sm text-stone  font-semibold">
                    {webinar.title}
                </p>
                <p className="text-sm text-stone ">
                    {webinar.description}
                </p>
            </div>
            <div className="flex gap-2 justify-start items-center">
                <div className="flex gap-2 items-center  text-xs text-muted-foreground">
                    <Calendar  size={15}/>
                    <p>{format(new Date(webinar?.startTime), 'dd/MM/yyyy')}</p>
                </div>
            </div>
        
        
        </Link>

        <Link
        href={`/webinars/${webinar.id}/pipeline`}
        className="flex px-4 py-2 rounded-md border-[0.5px] border-border bg-secondary"
        
        >
        <PipelineIcon className='w-4 h-4' />
        
        </Link>
    </div>
  </div>
}

export default WebinarCards