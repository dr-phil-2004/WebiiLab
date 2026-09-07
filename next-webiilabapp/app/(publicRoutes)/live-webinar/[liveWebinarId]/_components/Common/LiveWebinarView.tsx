
'use client'
import { WebinarWithPresenter } from '@/lib/type'
import { Call, ParticipantView, useCallStateHooks } from '@stream-io/video-react-sdk'
import {  Loader2, MessageSquare, Mic, StopCircle, User, Users } from 'lucide-react'
import { StreamChat } from 'stream-chat'
import { Chat, Channel, MessageList, MessageComposer} from 'stream-chat-react'
import 'stream-chat-react/dist/css/index.css'


import React, { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { CtaTypeEnum } from '@/lib/generated/prisma/enums'
import CTADialogueBox from './CTADialogueBox'
import { changeWebinarStatus } from '@/app/actions/webinar'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import ObsDialogBox from './ObsDialogBox'




type Props = {
    showChat: boolean,
    setShowChat: (show: boolean) => void,
    isHost?: boolean,
    username: string,
    userToken: string,
    call: Call,
    userId: string,
    webinar: WebinarWithPresenter,
}

const LiveWebinarView = ({showChat, setShowChat, isHost=false, username, userToken, userId, call,webinar}: Props) => {
    
    const {useParticipantCount, useParticipants}= useCallStateHooks();
    const participants = useParticipants()
    const viewerCount= useParticipantCount()
    const [chatClient, setChatClient] = useState<StreamChat  | null>(null)
    const [dialogOpen, setDialogOpen] =useState(true)
    const [channel, setChannel] =useState<any>(null)
    const hostParticipant =  participants.length >0 ? participants[0] : null;
    const chatClientRef = useRef<StreamChat | null>(null)
    const [loading, setLoading] = useState(false)
    const [obsDialogOpen, setObsDialogOpen] = useState(false)
    const router = useRouter();


    useEffect(()=>{
        let isCancelled = false

        const initChat = async()=>{
            const client = StreamChat.getInstance(
                process.env.NEXT_PUBLIC_STREAM_API_KEY!
            )

            await client.connectUser(
                {id: userId, 
                    name: username
                },
                userToken
            )

            const channel = client.channel('livestream', webinar.id, {
                name: webinar.title,
            } as any)

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
            if(chatClientRef.current){
                chatClientRef.current.disconnectUser()
                chatClientRef.current = null
            }
        };


    },[userId, username, userToken, webinar.id, webinar.title])
    useEffect(()=>{
        if(chatClient && channel ){
            channel.on((event:any)=>{
                if(event?.type === 'open_cta_dialog' && !isHost ){
                    setDialogOpen(true)
                }
                
            })
        }
    },[chatClient,channel, isHost])
   

        const handleEndStream = async ()=>{
        setLoading(true)
        try {
            await call.stopLive({
                continue_recording: false
            })
            call.endCall()
            const res= await changeWebinarStatus(webinar.id, "ENDED");
            if(!res.success){
                throw new Error(res.message)
            }
            toast.success('Webinar ended successfully')
            router.push('/')
            
            
        } catch (error) {
            console.error("Error ending stream", error);
            toast.error('Failed to end stream')
            
        } finally{
            setLoading(false)
        }
    }
     useEffect(()=>{
       call.on('call.rtmp_broadcast_started', ()=>{
        toast.success('webinar started successfully')
        router.refresh()
       })
       call.on('call.rtmp_broadcast_failed', ()=>{
        toast.error('failed to start webinar.Please try again')
        router.refresh()
       })
       call.on('call.rtmp_broadcast_stopped', ()=>{
        toast.success('webinar ended successfully')
        router.refresh()
       })
    },[call])
    useEffect(()=>{
        call.on('call.ended', ()=>{
            toast.success('webinar ended successfully')
            router.push('/')
        })
    },[call])

    const handleCTAButtonClick = async () => {
        if (channel) {
            console.log('CTA button clicked', channel )
            await channel.sendEvent({
                type: 'open_cta_dialog'
            })
        }
    }

    if(!chatClient || !channel) return null
  return (
    <div className='flex flex-col w-full h-screen max-h-screen overflow-hidden bg-background text-foreground'>
        <div className="py-2 px-4 border-b border-border flex items-center justify-between ">
            <div className="flex items-center space-x-2">
                <div className="bg-accent-stone text-stone px-3 py-1 rounded-full text-sm font-medium flex items-center">
                <span className="relative flex-2 mr-2 h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-destructive animate-pulse"></span>
                </span>
                Live
                </div>
                 </div>

                 <div className="flex items-center  space-x-3">
                    <div className="flex items-center space-x-1 bg-muted/50 px-3 py-1 rounded-full">
                    <Users size={16} />
                    <span className="text-sm">{viewerCount}</span>
                    </div>
                    <button
                    
                    onClick={()=>setShowChat(!showChat)}
                    className={`px-3 py-1 rounded-full text-sm flex items-center spaace-x-1 ${
                        showChat ? "bg-accent-primary text-primary-foreground "
                        :"bg-muted/50"
                        
                        }`}
                    >
                        <MessageSquare size={16} />
                        <span 
                        >Chat</span>
                    </button>
                 </div>
        </div>
        <div className="flex flex-1 p-2 gap-2 overflow-hidden">
            <div className="flex-1 rounded-lg overflow-hidden border border-border flex flex-col bg-card">
                <div className="flex-1 relative overflow-hidden ">
                    {/* <ParticipantView /> */}
                    {hostParticipant ? (
                        <div className={`w-full h-full`}>
                            <ParticipantView participant={hostParticipant}
                            className='w-full h-full object-cover !max-w-full'
                            />
                        </div>
                    ):(

                        <div className="w-full h-full flex items-center justify-center flex-col text-muted-foreground space-y-4  ">
                            <div className="w-24 h-24  rounded-full bg-muted flex items-center justify-center">
                                <Users size={40} className='text-muted-foreground' />
                            </div>
                            <p>Waiting for stream to start...</p>
                        </div>
                    )}
                    {isHost &&  (
                      <div className="absolute bottom-4 right-4 bg-primary px-3 py-1 rounded-full font-medium">
                      Host
                      </div>
                    )}
                </div>
                <div className="p-2 border-t border-border flex items-center justify-between py-2 bg-accent/50 ">
                  <div className="flex items-center space-x-2">
                    <div className="text-sm font-medium capitalize">
                        {webinar?.title}
                    </div>
                    </div>
                    {isHost && (
                        <div className="flex items-center space-x-1">
                            <Button variant ='outline' className='mr-2' onClick={()=>{ setObsDialogOpen(true)}}>
                                <Mic />
                                <span>Get OBS Credentials</span>
                            </Button>
                            <Button onClick={handleEndStream} disabled={loading}>
                                {loading ? (
                                    <>
                                    <Loader2 className='animate-spin mr-2' />
                                    Loading...
                                    
                                    </>
                                )
                                :(
                                    <>
                                    <StopCircle size={16} />
                                    <span>End Stream</span>
                                    </>
                                )   }

                            </Button>
                            <Button onClick={handleCTAButtonClick}>
                                {webinar.ctaType === CtaTypeEnum.BOOK_A_CALL
                                ? 'Book a Call'
                                :'Buy Now'}
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
            { showChat && (
                <Chat client={chatClient}>
                    <Channel channel={channel}>
                        <div className="w-72 bg-card border border-border rounded-lg  overflow-hidden flex flex-col ">
                         <div className="py-2 px-3 text-primary border-b vorder-border  font-medium flex items-center justify-between">
                            <span>Chat</span>
                            <span className="text-xs bg-muted px-2 py-0 5 rounded-full">{viewerCount}</span>
                         </div>
                         <MessageList />
                         <div className="p-2 border-t border-border">
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