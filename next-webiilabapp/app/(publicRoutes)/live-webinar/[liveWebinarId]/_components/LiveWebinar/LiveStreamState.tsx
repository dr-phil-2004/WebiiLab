import { User, Webinar } from '@/lib/generated/prisma/client'
import { WebinarWithPresenter } from '@/lib/type'
import {
  LivestreamPlayer,
  StreamVideo,
  StreamVideoClient,
  User as StreamUser
} from "@stream-io/video-react-sdk";
import React, { useState } from 'react'
import CustomLiveStreamPlayer from './CustomLiveStreamPlayer';

type Props = {
    apiKey: string,
   
    callId: string,
    user: User ,
    userId: string,
    webinar: WebinarWithPresenter
}
const hostUser: StreamUser= {id:process.env.NEXT_PUBLIC_STREAM_USER_ID!}
const LiveStreamState = ({apiKey, token, callId, user, userId, webinar}: Props) => {
  // const hostUser = {
  //   id: userId,
  //   name: user?.name || 'Host',
  //   image: user?.profileImage || undefined,
  //   type: 'authenticated' as const,
  // }
  const [hostToken, setHostToken ] = useState<string | null>()
  const client = new StreamVideoClient({ apiKey, token, user: hostUser })

  useEffect(()=>{
    const init = async()=>{
      try {
        const token = await getTokenForHost()
      } catch (error) {
        
      }
    }
    init()
  }, [apiKey, webinar])
  return (
    <StreamVideo client={client} >
      <CustomLiveStreamPlayer callId={callId} callType='livestream' username={user.name} webinar={webinar} token={token} userId={userId} />

    </StreamVideo>
  )

}

export default LiveStreamState