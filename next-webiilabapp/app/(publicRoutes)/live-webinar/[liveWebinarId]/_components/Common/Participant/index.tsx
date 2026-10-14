"use client"

import { getStreamIoToken } from "@/app/actions/streamio"
import { Button } from "@/components/ui/button"
import { WebinarWithPresenter } from "@/lib/type"
import useAttendeeStore from "@/store/useAttendeeStore"

import {
  Call,
  StreamCall,
  StreamVideo,
  StreamVideoClient,
  type User,
} from "@stream-io/video-react-sdk"
import { AlertCircle, Loader2, WifiOff } from "lucide-react"
import React, { useEffect, useRef, useState } from "react"
import LiveWebinarView from "../LiveWebinarView"

type Props = {
  apiKey: string
  // token:string,
  callId: string
  // user: User,
  // userId: string,
  webinar: WebinarWithPresenter
}

const Participant = ({ apiKey, callId, webinar }: Props) => {
  const { attendee } = useAttendeeStore()
  const [showChat, setShowChat] = useState<boolean>(false)
  const [client, setClient] = useState<StreamVideoClient | null>(null)
  const [call, setCall] = useState<Call | null>(null)
  const [token, setToken] = useState<string | null>()
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [connectionStatus, setConnectionStatus] = useState<
    "connecting" | "failed" | "reconnecting" | "connected"
  >("connecting")

  const clientInitialized = useRef<boolean>(false)

  useEffect(() => {
    if (clientInitialized.current) return
    const initClient = async () => {
      try {
        setConnectionStatus("connecting")
        const user: User = {
          id: attendee?.id || "guest",
          name: attendee?.name || "Guest",
          image: `https://api.dicebear.com/7.x/initials/svg?seed=${attendee?.name || "Guest"}`,
        }

        const userToken = await getStreamIoToken(attendee)
        setToken(userToken)

        const streamClient = new StreamVideoClient({
          apiKey,
          user,
          token: userToken,
        })

        streamClient.on("connection.changed", (event) => {
          const status = event.online ? "connected" : "reconnecting"
          setConnectionStatus(status)
        })

        await streamClient.connectUser(user, userToken)

        const streamCall = streamClient.call("livestream", callId)
        setClient(streamClient)
        setCall(streamCall)
        setConnectionStatus("connected")
        clientInitialized.current = true
        await streamCall.join({ create: true })
      } catch (error) {
        console.error("Error initializing client or joining call:", error)
        setConnectionStatus("failed")
        setErrorMessage(
          error instanceof Error ? error.message : "Faailed to connect webinar "
        )
      }
    }
    initClient()

    return () => {
      const currentCall = call
      const currentClient = client

      if (currentCall && currentClient) {
        currentCall
          .leave()
          .then(() => {
            currentClient?.disconnectUser()
            clientInitialized.current = false
          })
          .catch((error) => {
            console.error("Error leaving call:", error)
          })
      }
    }
  }, [apiKey, callId, attendee, call, client])

  if (!attendee) {
    return (
      <div className="flex h-screen items-center justify-center bg-background text-foreground">
        <div className="max-w-md rounded-lg border border-border bg-card p-8 text-center">
          <h2 className="mb-4 text-2xl font-bold">
            please register to join the webinar
          </h2>
          <p className="mb-6 text-muted-foreground"></p>
          <Button
            onClick={() => window.location.reload()}
            className="bg-accent-primary hover:bg-accent-primary/90 mt-6 text-accent-foreground"
          >
            Register Now
          </Button>
        </div>
      </div>
    )
  }

  if (!client || !call || !token) {
    return (
      <div className="flex h-screen items-center justify-center bg-background text-foreground">
        <div className="max-w-md rounded-lg border border-border bg-card p-8 text-center">
          {connectionStatus === "connecting" && (
            <>
              <div className="relative mx-auto mb-6 h-24 w-24">
                <div className="bprder-accent-primary absolute inset-0 animate-spin rounded-full border-t-2"></div>
                <div className="absolute inset-3 flex items-center justify-center rounded-full bg-card">
                  <Loader2 className="text-accent-primary h-10 w-10 animate-pulse" />
                </div>
              </div>
              <h2 className="mb-2 text-xl font-semibold">Loading Webinar</h2>
              <p className="text-muted-foreground">
                connecting to {webinar.title} in a moment
              </p>
              <div className="mt-6 flex justify-center space-x-1">
                <span className="bg-accent-primary rouded-full h-2 w-2 animate-bounce"></span>
                <span
                  className="bg-accent-primary h-2 w-2 animate-bounce rounded-full"
                  style={{ animationDelay: "0.2s" }}
                ></span>
                <span
                  className="bg-accent-primary h-2 w-2 animate-bounce rounded-full"
                  style={{ animationDelay: "0.4s" }}
                ></span>
              </div>
            </>
          )}

          {connectionStatus === "reconnecting" && (
            <>
              <div className="mx-auto mb-4 h-16 w-16">
                <WifiOff className="h-10 w-10 animate-pulse text-amber-400" />
              </div>
              <h2 className="mb-2 text-xl font-semibold">Reconnecting</h2>
              <p className="text-muted-foreground">
                Reconnecting to {webinar.title} in a moment
              </p>
              <div className="mb-6 h-2 w-full rounded-full bg-muted">
                <div
                  className="h-2 animate-pulse rounded-full bg-amber-500"
                  style={{ width: "60%" }}
                ></div>
              </div>
            </>
          )}

          {connectionStatus === "failed" && (
            <>
              <div className="mx-auto mb-4 h-16 w-16 text-destructive">
                <AlertCircle className="h-16 w-16" />
              </div>
              <h2 className="mb-2 text-xl font-semibold">Failed to connect</h2>
              <p className="mb-6 text-muted-foreground">
                {errorMessage || "Unable to connect to webinar"}
              </p>
              <div className="flex justify-center space-x-4">
                <Button
                  variant="outline"
                  onClick={() => window.location.reload()}
                >
                  Retry Connection
                </Button>
                <Button
                  className="bg-accent-primary hover:bg-accent-primary/90 text-accent-foreground"
                  onClick={() => (window.location.href = "/")}
                >
                  Back to Home
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    )
  }
  return (
    <StreamVideo client={client}>
      <StreamCall call={call}>
        <LiveWebinarView
          showChat={showChat}
          setShowChat={setShowChat}
          webinar={webinar}
          isHost={false}
          username={attendee?.name}
          userId={attendee?.id}
          userToken={token}
          call={call}
        />
      </StreamCall>
    </StreamVideo>
  )
}

export default Participant
