'use server'

import { WebinarFormState } from "@/store/useWebinarStore"
import { onAuthenticateUser } from "./auth"
import { prismaClient } from "@/lib/prismaClient"
import { revalidatePath } from "next/cache"
import { WebinarStatusEnum } from "@/lib/generated/prisma/enums"



function combinateDateTime(
    date: Date,
    timeStr: string,
    timeFormat: 'AM' | 'PM'
) : Date {
    const [hoursStr, minutesStr] = timeStr.split(':')
    let hours = parseInt(hoursStr, 10)
    const minutes = Number.parseInt(minutesStr || '0', 10)

    if(timeFormat === 'PM' && hours !== 12) hours += 12
    if(timeFormat === 'AM' && hours === 12) hours = 0
    
    const combined = new Date(date)
    combined.setHours(hours, minutes, 0, 0)

    return combined
}


export const createWebinar = async(formData: WebinarFormState)=>{

    try {
        const user = await onAuthenticateUser()
        if(!user.user){
            return{status:401, message: 'Unauthorized'}
        }

        // if(!user.user.subscription){
        //     return{status:402, message: 'Forbidden. Please upgrade to create a webinar'}
        // }


        const presentId = user.user.id
        console.log('FormData :',formData, presentId)


        if(!formData.basicInfo.webinarName){
            return{status:403, message: 'Webinar name is required'}
        }

        if(!formData.basicInfo.time){
            return{status:403, message: 'Time is required'}
        }

        if(!formData.basicInfo.date){
            return{status:403, message: 'Date is required'}
        }


        const combinedDateTime = combinateDateTime(
            formData.basicInfo.date,
            formData.basicInfo.time,
            formData.basicInfo.timeFormat || 'AM'
        )

        const now = new Date()

        if(combinedDateTime <= now){
            return{status:403, message: 'Webinar date and time must be in the future'}
        }

        if(!formData.cta.ctaType){
            return{status:403, message: 'CTA Type is required'}
        }

        const webinar = await prismaClient.webinar.create({
           data:{
            title:formData.basicInfo.webinarName,
            description: formData.basicInfo.description,
            startTime: combinedDateTime,
            tags:formData.basicInfo.tags || [],
            ctaLabel:formData.cta.ctaLabel,
            ctaType:formData.cta.ctaType,
            aiAgentId:formData.cta.aiAgent || null,
            priceId:formData.cta.priceId || null,
            lockChat:formData.additionalInfo.lockChat || false,
            couponCode:formData.additionalInfo.couponCode 
            ? formData.additionalInfo.couponCode
            : null,
            couponEnabled:formData.additionalInfo.couponEnabled || false,
            presenterId:presentId,
           }
        })

        revalidatePath('/')
        return {
            status: 200, 
            message:'Webinar created successfully',
            webinarId:webinar.id,
            webinarLink:`/webinar/${webinar.id}`
        };
        

        
    } catch (error) {
        console.error('Error creating webinar:', error);
        return {status:500, message: 'Failed to create webinar. Please try again'}
        
        
    }

}

export const getWebinarByPresenterId = async(presenterId: string, webinarStatus?: string) => {
    try {

        let statusFilter: WebinarStatusEnum| undefined;

        switch(webinarStatus){
            case'upcoming':
            statusFilter = WebinarStatusEnum.SCHEDULED
            break;
            
            case'ended':
            statusFilter = WebinarStatusEnum.ENDED
            break;
            
           
            
            default:
            statusFilter= undefined
        }
        
        const webinars =await prismaClient.webinar.findMany({
            where: {
                presenterId, 
                
                ...(statusFilter
                    ? {webinarStatus: statusFilter}
                    : {}),
            },
            include:{
                presenter: {
                    select:{
                        id:true,
                        name:true,
                        email:true,
                        
                    }
                },

            }

        })
        return webinars;
        
    } catch (error) {
        console.error('Error fetching webinars:', error);
        return [];
        
    }
}


export const getWebinarById = async (webinarId: string)=>{
    try {
        const webinar =await prismaClient.webinar.findUnique({
            where: {id:webinarId},

            include:{
                presenter:{
                    select:{
                        id:true,
                        name:true,
                        profileImage: true,
                        stripeConnectId:true

                    }
                }
            }
        })

        return webinar 
        
    } catch (error) {
        console.error('Error fetching Webinar:', error)
        throw new Error('Failed to fetch webinar')
        
    }
}

export const changeWebinarStatus = async( webinarId: string, status: WebinarStatusEnum)=>{


    try {
        const webinar = await prismaClient.webinar.update({
            where:{
                id: webinarId,
            },
            data:{
                webinarStatus:status,
            }
        })
        return {
            status: 200,
            success: true,
            message: "Webinar status updated successfully",
            data:webinar,
        }
        
    } catch (error) {
        console.error("Error updating webinar status:", error)
        return{
            status: 200,
            success: true,
            message: 'Failed to update webinat status . please try again '
        }
        
    }

}
