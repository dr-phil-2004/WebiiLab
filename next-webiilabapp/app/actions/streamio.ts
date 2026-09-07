'use server'
import {Attendee} from '@/lib/generated/prisma/client'
import { StringFieldRefInput } from '@/lib/generated/prisma/internal/prismaNamespace'
import { getStreamClient } from '@/lib/stream/getStreamClient'
import { StreamVideoClient, UserRequest } from '@stream-io/node-sdk'


export const getStreamIoToken = async(attendee:Attendee | null) => {
    try {
        const newUser : UserRequest ={
            id: attendee?.id || 'guest',
            role:'user',
            name: attendee?.name || 'Guest',
            image: `https://api.dicebear.com/7.x/initials/svg?seed=${attendee?.name || 'Guest'}`
        }

        await getStreamClient.upsertUsers([newUser])

        const validity = 60*60*60
        const token  = getStreamClient.generateUserToken({
            user_id: attendee?.id || 'guest',
            validity_in_seconds: validity,
        })
        return token
     
    } catch (error) {
        console.error('Error generating Stream Io token', error)
        throw new Error('Failed to generate token')
        
    }
   



}

export const getTokenForHost = async(
    userId: string,
    username: string,
    profilePic: string
)=>{
    try {
        const newUser: UserRequest = {
            id: userId,
            role: 'user',
            name: username,
            image: profilePic || `https://api.dicebear.com/7.x/initials/svg?seed=${username}`
        }
        await getStreamClient.upsertUsers([newUser])
        const token = getStreamClient.generateUserToken({
            user_id: userId,
            validity_in_seconds: 60*60*60,
            
        });
        return token
    } catch (error) {
        console.error('Error generating Stream Io token for host', error)
        throw new Error('Failed to generate token for host')
    }
}


export const createAndStartStream = async (webinarId: string)=>{
    try {
        const checkWebinar = await prismaClient.webinar.findUnique({})
    } catch (error) {
        
    }
}

