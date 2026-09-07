'use client'
import { WebinarWithPresenter } from '@/lib/type'
import { Call, StreamCall, useStreamVideoClient } from '@stream-io/video-react-sdk'
import React, { useEffect, useState } from 'react'
import LiveWebinarView from '../Common/LiveWebinarView'

type Props = {
    callId: string,
    callType: 'livestream' | 'video' | 'recording',
    webinar: WebinarWithPresenter,
    token: string,
    username: string,
    userId: string,
}

const CustomLiveStreamPlayer = ({callId, callType, webinar, token, username, userId}: Props) => {
    const client= useStreamVideoClient()
    const [call, setCall] = useState<Call>()
    const [showChat, setShowChat] = useState(true)

    useEffect(()=>{
        if(!client) return

        const myCall= client.call(callType, callId)
        setCall(myCall)
              myCall.join({create: true}).then((e)=> setCall(myCall))
      return ()=>{
        // myCall.leave().catch((e)=>{
        //   console.error('Failed to leave', e)
        // })
        setCall(undefined)
      }

      
          
    },[client, callId, callType])

    if(!call) return null;


  return <StreamCall call={call}>
    <LiveWebinarView  
    showChat={showChat}
    setShowChat={setShowChat}
    isHost={true}
    username={username}
    userToken={token}
    userId={webinar.presenter.id}
    webinar={webinar}/>
  </StreamCall>
}

export default CustomLiveStreamPlayer