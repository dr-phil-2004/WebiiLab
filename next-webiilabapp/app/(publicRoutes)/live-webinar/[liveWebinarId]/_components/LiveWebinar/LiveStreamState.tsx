import { User, Webinar } from '@/lib/generated/prisma/client'
import { WebinarWithPresenter } from '@/lib/type'
import {
  LivestreamPlayer,
  StreamVideo,
  StreamVideoClient,
  User as StreamUser
} from "@stream-io/video-react-sdk";
import React, { useEffect, useState } from 'react'
import CustomLiveStreamPlayer from './CustomLiveStreamPlayer';
import { getTokenForHost } from '@/app/actions/streamio';

type Props = {
    apiKey: string,
   
    callId: string,
    user: User ,
    userId: string,
    webinar: WebinarWithPresenter
}
const hostUser: StreamUser= {id:process.env.NEXT_PUBLIC_STREAM_USER_ID!}
const LiveStreamState = ({apiKey, callId, user, userId, webinar}: Props) => {
  // const hostUser = {
  //   id: userId,
  //   name: user?.name || 'Host',
  //   image: user?.profileImage || undefined,
  //   type: 'authenticated' as const,
  // }
  const [hostToken, setHostToken ] = useState<string | null>()
    const [client, setClient] = useState<StreamVideoClient | null>(null)

  // const client = new StreamVideoClient({ apiKey, token, user: hostUser })

  useEffect(()=>{
    const init = async()=>{
      try {
        const token = await getTokenForHost(
          webinar.presenterId,
          webinar.presenter.name,
          webinar.presenter.profileImage
        )


        const host: StreamUser ={
          id: webinar.presenterId,
          name: webinar.presenter.name,
          image: webinar.presenter.profileImage
        }

        const streamClient = new StreamVideoClient(
         {
          apiKey,
          user: hostUser,
          token,

         }
        )

        setClient(streamClient)
      } catch (error) {
        
      }
    }
    init()
  }, [apiKey, webinar])
  if(!client || !hostToken) return null
  return (
    <StreamVideo client={client} >
      <CustomLiveStreamPlayer callId={callId} callType='livestream' username={user.name} webinar={webinar} token={hostToken} userId={userId} />

    </StreamVideo>
  )

}

export default LiveStreamState