'use client'
import type { User, Webinar } from '@/lib/generated/prisma/client'
import { WebinarStatusEnum } from '@/lib/generated/prisma/enums'
import React, { useEffect } from 'react'
import WebinarUpcomingState from './UpcomingWebinar/WebinarUpcomingState'
import { usePathname, useRouter } from 'next/navigation'
import useAttendeeStore from '@/store/useAttendeeStore'
import { toast } from 'sonner'
import LiveStreamState from './LiveWebinar/LiveStreamState'
import { WebinarWithPresenter } from '@/lib/type'
import Participant from './Common/Participant/page'

type Props = {
    apiKey: string,
    token : string,
    callId: string,
    user: User | null,
    userId: string,
    error: string | undefined,
    webinar: WebinarWithPresenter
}

const RenderWebinar = ({apiKey,token, callId, user, userId, error, webinar, }: Props) => {
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
  return(
    
    
    <React.Fragment>
    {webinar.webinarStatus === WebinarStatusEnum.SCHEDULED ? (
        <WebinarUpcomingState
        webinar={webinar}
        currentUser ={user || null}
        
        />
    ): webinar.webinarStatus === WebinarStatusEnum.WAITING_ROOM ? (
     <WebinarUpcomingState
        webinar={webinar}
        currentUser ={user || null}
        
        /> 
    ):webinar.webinarStatus === WebinarStatusEnum.LIVE?(

      <React.Fragment>
        {user?.id === webinar.presenterId ? (

          <LiveStreamState
          apiKey={apiKey}
          token={token}
          callId={callId}
          webinar={webinar}
          user={user}
          userId={userId}
          />
          
        ):attendee ? (
          <Participant
          apiKey={apiKey}
          token={token}
          callId={callId}
          
          />
        ):( <WebinarUpcomingState
        webinar={webinar}
        currentUser ={user || null}
        
        /> )}
      </React.Fragment>
    ) :webinar.webinarStatus === WebinarStatusEnum.CANCELLED ? (
      <div className='flex justify-center items-center h-full w-full'>
        <div className="text-center space-y-4 ">
          <h3 className="text-2xl font-semibold text-primary ">{webinar.title}</h3>
          <p className="text-muted-foreground text-xs "> The webinar has been Cancelled</p>
        </div>
      </div>
    ) :(<WebinarUpcomingState
        webinar={webinar}
        currentUser ={user || null}
        
        />)
  
  }
  </React.Fragment>
   )
}

export default RenderWebinar