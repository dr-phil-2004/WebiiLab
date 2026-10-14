"use client"
import { WebinarWithPresenter } from "@/lib/type"
import {
  Call,
  StreamCall,
  useStreamVideoClient,
} from "@stream-io/video-react-sdk"
import React, { useEffect, useState } from "react"
import LiveWebinarView from "../Common/LiveWebinarView"

type Props = {
  callId: string
  callType: "livestream" | "video" | "recording"
  webinar: WebinarWithPresenter
  token: string
  username: string
  userId: string
}

const CustomLiveStreamPlayer = ({
  callId,
  callType,
  webinar,
  token,
  username,
}: Props) => {
  const client = useStreamVideoClient()
  const [call, setCall] = useState<Call>()
  const [showChat, setShowChat] = useState(true)

  useEffect(() => {
    if (!client) return

    const myCall = client.call(callType, callId)
    myCall.join({ create: true }).then(() => setCall(myCall))
    return () => {
      setCall(undefined)
    }
  }, [client, callId, callType])

  if (!call) return null

  return (
    <StreamCall call={call}>
      <LiveWebinarView
        showChat={showChat}
        setShowChat={setShowChat}
        isHost={true}
        username={username}
        userToken={token}
        userId={webinar.presenter.id}
        webinar={webinar}
        call={call}
      />
    </StreamCall>
  )
}

export default CustomLiveStreamPlayer
