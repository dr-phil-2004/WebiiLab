import { onAuthenticateUser } from '@/app/actions/auth'
import { generateStreamToken } from '@/app/actions/stream'
import { getWebinarById } from '@/app/actions/webinar'
import React from 'react'
import RenderWebinar from './_components/RenderWebinar'

type Props = {
    params:Promise<{
        liveWebinarId: string
    }>
    searchParams: Promise<
            {    error:string}
    >
}

const page = async({params, searchParams}: Props) => {

    const {liveWebinarId} = await params
    const {error} = await searchParams

    const webinarData = await getWebinarById(liveWebinarId)
    if(!webinarData){
        return(
            <div className="w-full min-h-screen flex justify-center items-center text-lg sm:text-4xl">
                Webinar not found
            </div>
        )
       
    }

    const checkUser = await onAuthenticateUser()
    const user = checkUser.user || null

    const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY as string
    const callId= process.env.STREAM_CALL_ID as string

    // Generate a token dynamically for the authenticated user so the
    // user_id claim inside the JWT matches the userId passed to connectUser().
    const userId = user?.id || 'guest'
    const token = await generateStreamToken(userId)

  return <div className="w-full min-h-screen mx-auto ">
    <RenderWebinar 
    apiKey={apiKey}
    token={token}
    callId={callId}
    user={user}createCheckoutLink
    userId={userId}
    error={error}
    webinar={webinarData}
    />
  </div>
}

export default page