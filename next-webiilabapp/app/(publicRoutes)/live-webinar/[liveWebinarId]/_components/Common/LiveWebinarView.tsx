"use client"
import { WebinarWithPresenter } from "@/lib/type"
import {
  Call,
  ParticipantView,
  useCallStateHooks,
} from "@stream-io/video-react-sdk"
import { Loader2, MessageSquare, Mic, StopCircle, Users } from "lucide-react"
import {
  StreamChat,
  type Channel as ChatChannel,
  type Event as ChatEvent,
} from "stream-chat"
import { Chat, Channel, MessageList, MessageComposer } from "stream-chat-react"
import "stream-chat-react/dist/css/index.css"

import React, { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { CtaTypeEnum } from "@/lib/generated/prisma/enums"
import CTADialogueBox from "./CTADialogueBox"
import { changeWebinarStatus } from "@/app/actions/webinar"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import ObsDialogBox from "./ObsDialogBox"

type Props = {
  showChat: boolean
  setShowChat: (show: boolean) => void
  isHost?: boolean
  username: string
  userToken: string
  call: Call
  userId: string
  webinar: WebinarWithPresenter
}

const LiveWebinarView = ({
  showChat,
  setShowChat,
  isHost = false,
  username,
  userToken,
  userId,
  call,
  webinar,
}: Props) => {
  const { useParticipantCount, useParticipants } = useCallStateHooks()
  const participants = useParticipants()
  const viewerCount = useParticipantCount()
  const [chatClient, setChatClient] = useState<StreamChat | null>(null)
  const [dialogOpen, setDialogOpen] = useState(true)
  const [channel, setChannel] = useState<ChatChannel | null>(null)
  const hostParticipant = participants.length > 0 ? participants[0] : null
  const chatClientRef = useRef<StreamChat | null>(null)
  const [loading, setLoading] = useState(false)
  const [obsDialogOpen, setObsDialogOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    let isCancelled = false

    const initChat = async () => {
      const client = StreamChat.getInstance(
        process.env.NEXT_PUBLIC_STREAM_API_KEY!
      )

      await client.connectUser({ id: userId, name: username }, userToken)

      const channel = client.channel("livestream", webinar.id, {
        name: webinar.title,
      })

      await channel.watch()

      if (!isCancelled) {
        chatClientRef.current = client
        setChatClient(client)
        setChannel(channel)
      }
    }

    initChat()

    return () => {
      isCancelled = true
      if (chatClientRef.current) {
        chatClientRef.current.disconnectUser()
        chatClientRef.current = null
      }
    }
  }, [userId, username, userToken, webinar.id, webinar.title])
  useEffect(() => {
    if (chatClient && channel) {
      channel.on((event: ChatEvent) => {
        if (event?.type === "open_cta_dialog" && !isHost) {
          setDialogOpen(true)
        }
      })
    }
  }, [chatClient, channel, isHost])

  const handleEndStream = async () => {
    setLoading(true)
    try {
      await call.stopLive({
        continue_recording: false,
      })
      call.endCall()
      const res = await changeWebinarStatus(webinar.id, "ENDED")
      if (!res.success) {
        throw new Error(res.message)
      }
      toast.success("Webinar ended successfully")
      router.push("/")
    } catch (error) {
      console.error("Error ending stream", error)
      toast.error("Failed to end stream")
    } finally {
      setLoading(false)
    }
  }
  // call.on() returns an unsubscribe function: without the cleanup, every
  // re-render added another listener and toasts fired several times.
  useEffect(() => {
    const unsubscribers = [
      call.on("call.rtmp_broadcast_started", () => {
        toast.success("webinar started successfully")
        router.refresh()
      }),
      call.on("call.rtmp_broadcast_failed", () => {
        toast.error("failed to start webinar.Please try again")
        router.refresh()
      }),
      call.on("call.rtmp_broadcast_stopped", () => {
        toast.success("webinar ended successfully")
        router.refresh()
      }),
      call.on("call.ended", () => {
        toast.success("webinar ended successfully")
        router.push("/")
      }),
    ]
    return () => unsubscribers.forEach((unsubscribe) => unsubscribe())
  }, [call, router])

  const handleCTAButtonClick = async () => {
    if (channel) {
      console.log("CTA button clicked", channel)
      await channel.sendEvent({
        type: "open_cta_dialog",
      })
    }
  }

  if (!chatClient || !channel) return null
  return (
    <div className="flex h-screen max-h-screen w-full flex-col overflow-hidden bg-background text-foreground">
      <div className="flex items-center justify-between border-b border-border px-4 py-2">
        <div className="flex items-center space-x-2">
          <div className="bg-accent-stone text-stone flex items-center rounded-full px-3 py-1 text-sm font-medium">
            <span className="relative mr-2 h-2 w-2 flex-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-destructive opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 animate-pulse rounded-full bg-destructive"></span>
            </span>
            Live
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1 rounded-full bg-muted/50 px-3 py-1">
            <Users size={16} />
            <span className="text-sm">{viewerCount}</span>
          </div>
          <button
            onClick={() => setShowChat(!showChat)}
            className={`spaace-x-1 flex items-center rounded-full px-3 py-1 text-sm ${
              showChat
                ? "bg-accent-primary text-primary-foreground"
                : "bg-muted/50"
            }`}
          >
            <MessageSquare size={16} />
            <span>Chat</span>
          </button>
        </div>
      </div>
      <div className="flex flex-1 gap-2 overflow-hidden p-2">
        <div className="flex flex-1 flex-col overflow-hidden rounded-lg border border-border bg-card">
          <div className="relative flex-1 overflow-hidden">
            {/* <ParticipantView /> */}
            {hostParticipant ? (
              <div className={`h-full w-full`}>
                <ParticipantView
                  participant={hostParticipant}
                  className="h-full w-full !max-w-full object-cover"
                />
              </div>
            ) : (
              <div className="flex h-full w-full flex-col items-center justify-center space-y-4 text-muted-foreground">
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-muted">
                  <Users size={40} className="text-muted-foreground" />
                </div>
                <p>Waiting for stream to start...</p>
              </div>
            )}
            {isHost && (
              <div className="absolute right-4 bottom-4 rounded-full bg-primary px-3 py-1 font-medium">
                Host
              </div>
            )}
          </div>
          <div className="flex items-center justify-between border-t border-border bg-accent/50 p-2 py-2">
            <div className="flex items-center space-x-2">
              <div className="text-sm font-medium capitalize">
                {webinar?.title}
              </div>
            </div>
            {isHost && (
              <div className="flex items-center space-x-1">
                <Button
                  variant="outline"
                  className="mr-2"
                  onClick={() => {
                    setObsDialogOpen(true)
                  }}
                >
                  <Mic />
                  <span>Get OBS Credentials</span>
                </Button>
                <Button onClick={handleEndStream} disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    <>
                      <StopCircle size={16} />
                      <span>End Stream</span>
                    </>
                  )}
                </Button>
                <Button onClick={handleCTAButtonClick}>
                  {webinar.ctaType === CtaTypeEnum.BOOK_A_CALL
                    ? "Book a Call"
                    : "Buy Now"}
                </Button>
              </div>
            )}
            {/* <div className="text-sm text-muted-foreground">
                      {new Date(webinar.startTime).toLocaleDateString(undefined, {
                        month: 'short', day:'numeric', hour:'numeric', minute:'numeric'
                      })}
                    </div>

                    <div className="text-sm text-primary font-medium"></div> */}
          </div>
        </div>
        {showChat && (
          <Chat client={chatClient}>
            <Channel channel={channel}>
              <div className="flex w-72 flex-col overflow-hidden rounded-lg border border-border bg-card">
                <div className="vorder-border flex items-center justify-between border-b px-3 py-2 font-medium text-primary">
                  <span>Chat</span>
                  <span className="5 rounded-full bg-muted px-2 py-0 text-xs">
                    {viewerCount}
                  </span>
                </div>
                <MessageList />
                <div className="border-t border-border p-2">
                  <MessageComposer />
                </div>
              </div>
            </Channel>
          </Chat>
        )}
      </div>
      {dialogOpen && (
        <CTADialogueBox
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          userId={userId}
          webinar={webinar}
        />
      )}
      [obsDialogOpen && (
      <ObsDialogBox
        open={obsDialogOpen}
        onOpenChange={setObsDialogOpen}
        streamKey={userToken}
        rtmp_url={`rrtmps://ingress.stream-io-video.com:443/${process.env.NEXT_PUBLIC_STREAM_API_KEY}.livestream.${webinar.id}`}
      />
      )]
    </div>
  )
}

export default LiveWebinarView
