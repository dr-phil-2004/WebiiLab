'use client'
import type { User, Webinar } from '@/lib/generated/prisma/client'
import { WebinarStatusEnum } from '@/lib/generated/prisma/enums'
import React, { useEffect } from 'react'
import WebinarUpcomingState from './UpcomingWebinar/WebinarUpcomingState'
import { usePathname, useRouter } from 'next/navigation'
import useAttendeeStore from '@/store/useAttendeeStore'
import { toast } from 'sonner'
import LiveStreamState from './LiveWebinar/LiveStreamState'
import { StreamRecording, WebinarWithPresenter } from '@/lib/type'
import Participant from './Common/Participant/page'

type Props = {
    apiKey: string,
   
    user: User | null,
    userId: string,
    error: string | undefined,
    webinar: WebinarWithPresenter,
    recording?: StreamRecording | null
  
  }

const RenderWebinar = ({apiKey,recording, user, userId, error, webinar, }: Props) => {
  const router = useRouter()
  const pathname= usePathname()
  const {attendee}= useAttendeeStore()
  useEffect(()=>
  {
    if(error){
      toast.error(error)
      router.push(pathname)
    }
    
  },[error]
  )
  return<React.Fragment>
    
  </React.Fragment>
}

export default RenderWebinar