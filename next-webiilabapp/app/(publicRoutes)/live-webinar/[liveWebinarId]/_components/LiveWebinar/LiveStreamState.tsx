import type { User } from "@/lib/generated/prisma/client"
import { WebinarWithPresenter } from "@/lib/type"
import {
  StreamVideo,
  StreamVideoClient,
  User as StreamUser,
} from "@stream-io/video-react-sdk"
import React, { useEffect, useState } from "react"
import CustomLiveStreamPlayer from "./CustomLiveStreamPlayer"
import { getTokenForHost } from "@/app/actions/streamio"

type Props = {
  apiKey: string

  callId: string
  user: User
  userId: string
  webinar: WebinarWithPresenter
}
const LiveStreamState = ({ apiKey, callId, user, userId, webinar }: Props) => {
  const [hostToken, setHostToken] = useState<string | null>(null)
  const [client, setClient] = useState<StreamVideoClient | null>(null)

  useEffect(() => {
    const init = async () => {
      try {
        const token = await getTokenForHost(
          webinar.presenterId,
          webinar.presenter.name,
          webinar.presenter.profileImage
        )

        const host: StreamUser = {
          id: webinar.presenterId,
          name: webinar.presenter.name,
          image: webinar.presenter.profileImage,
        }

        const streamClient = new StreamVideoClient({
          apiKey,
          // Must be the user the token was issued for (presenterId),
          // otherwise Stream rejects the connection.
          user: host,
          token,
        })

        setHostToken(token)
        setClient(streamClient)
      } catch (error) {
        console.error("Failed to start the host livestream", error)
      }
    }
    init()
  }, [apiKey, webinar])
  if (!client || !hostToken) return null
  return (
    <StreamVideo client={client}>
      <CustomLiveStreamPlayer
        callId={callId}
        callType="livestream"
        username={user.name}
        webinar={webinar}
        token={hostToken}
        userId={userId}
      />
    </StreamVideo>
  )
}

export default LiveStreamState
