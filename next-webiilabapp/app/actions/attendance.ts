'use server'

import { AttendedTypeEnum, CtaTypeEnum } from "@/lib/generated/prisma/client"
import { prismaClient } from "@/lib/prismaClient"
import { AttendanceData } from "@/lib/type"
import { revalidatePath } from "next/cache"

export const getWebinarAttendance = async(webinarId:string,
    options:{
        includeUsers: boolean,
        userLimits? : number
    } = {
        includeUsers: true,
        userLimits:100
    }
) =>{
    try{

        const webinar = await prismaClient.webinar.findUnique({
            where:{
                id:webinarId
            },
            select:{
                id:true,
                ctaType: true,
                tags:true,
                presenter:true,
                _count: {
                    select:{
                        attendances:true,
                    }
                }
               
            }
        })
        if(!webinar){
            return{
                success: false,
                status:404,
                error:'Webinar not found'
            }
        }
        const  attendanceCounts = await prismaClient.attendance.groupBy({
            by: ['attendedType'],
            where:{webinarId},
            _count:{
               attendedType:true
            }
        })

        const result : Record<AttendedTypeEnum, AttendanceData> = {} as 
        Record<AttendedTypeEnum, AttendanceData>

        for( const type of Object.values(AttendedTypeEnum)){
           if(
            type === AttendedTypeEnum.ADDED_TO_CART &&
            webinar.ctaType === CtaTypeEnum.BOOK_A_CALL
           )

           continue

            if(
            type === AttendedTypeEnum.BREAKOUT_ROOM &&
            webinar.ctaType === CtaTypeEnum.BOOK_A_CALL
           )

           continue


           const countItem = attendanceCounts.find((item)=>{
            if(

                webinar.ctaType === CtaTypeEnum.BOOK_A_CALL &&
                type === AttendedTypeEnum.BREAKOUT_ROOM &&
                item.attendedType ===  AttendedTypeEnum.ADDED_TO_CART
            ){
                return true 
            }
            return item.attendedType === type
           })

           result[type] = {
            count: countItem ? countItem._count.attendedType:0,
            users:[]
           }
        }

        if(options.includeUsers){
            for(const type of Object.values(AttendedTypeEnum)){
                if(
                    (type === AttendedTypeEnum.ADDED_TO_CART && 
                        webinar.ctaType ===  CtaTypeEnum.BOOK_A_CALL
                    ) || (
                        type === AttendedTypeEnum.BREAKOUT_ROOM &&
                        webinar.ctaType !== CtaTypeEnum.BOOK_A_CALL
                    )

                ){
                    continue
                }

                const queryType = 
                webinar.ctaType === CtaTypeEnum.BOOK_A_CALL &&
                type === AttendedTypeEnum.BREAKOUT_ROOM
                ? AttendedTypeEnum.ADDED_TO_CART
                : type 


                if(result[type].count > 0){
                    const attendance = await prismaClient.attendance.findMany({
                        where: {
                            webinarId,
                            attendedType: queryType,
                        },
                        include: {
                            user: true ,
                        },
                        take: options.userLimits,

                        orderBy: {
                            joinedAt: 'desc'
                        }

                    })

                    result[type].users = attendance.map((attendance) => ({

                        id: attendance.user.id,
                        name: attendance.user.name,
                        email: attendance.user.email,
                        attendedAt: attendance.joinedAt,
                        stripeConnectId: null, 
                        callStatus: attendance.user.callStatus,
                        createdAt: attendance.user.createdAt,
                        updatedAt: attendance.user.updatedAt,
                    }))
                }
            }
        }

        // revalidatePath(`/webinars/${webinarId}/pipelines`)
        return{
            success:true,
            data: result,
            ctaType:webinar.ctaType,
            presenter: webinar.presenter,
            webinarTags:webinar.tags || []
        }
        
    }
    catch(error){

        console.log('Failed to fetch  attendance data', error)
        return{
            success: false,
            error: 'Failed to fetch attendance data',
        }
        
    }
    
}

export const registerToWaitingList = async(webinarId: string, name: string, email: string)=>{
    try {

        if(!webinarId || !email){
            return{
                success:false,
                status:400,
                message:'Missing require parameters'
            }
        }
        const webinar = await prismaClient.webinar.findUnique({
            where:{
                id:webinarId
            },
            // select:{
            //     id:true,
            //     ctaType:true,
            //     tags:true,
            //     status: true,
            // }
        })
        if(!webinar){
            return{
                success:false,
                status:404,
                message:'Webinar not found'
            }
        }

        let attendee = await prismaClient.attendee.findUnique({
            where:{email: email}
        })

        if(!attendee){
            attendee = await prismaClient.attendee.create({
                data:{email, name},
            })
        }
     
        const existingAttendance = await prismaClient.attendance.findFirst({
            where:{
                attendeeId: attendee.id,
                webinarId: webinarId,
            },
            include:{
                user:true,
                
            },
            
        })
        if(existingAttendance){
            return{
                success:false,
                status:400,
                message:'You have already registered for this webinar'
            }
        }
        const attendance = await prismaClient.attendance.create({
            data:{
                webinarId: webinarId,
                attendeeId: attendee.id,
                attendedType:AttendedTypeEnum.REGISTERED,
            },
            include:{
                user:true,
            }
        })
        revalidatePath(`/live-webinar/${webinarId}`)
        return{
            success:true,
            data: attendance,
            status:200,
            message:'You have successfully registered for this webinar'
        }
        
        
    } catch (error) {
        console.error('Failed to register for waiting list', error)
        return{
            success:false,
            status:500,
            message:'Failed to register for waiting list',
            
        }
        
    }
}


export const changeAttendanceType = async(
    attendeeId:string, 
    webinarId: string,
    attendedType: AttendedTypeEnum
    ) =>{
        try {

            const attendance =await prismaClient.attendance.update({
                where:{
                    attendeeId_webinarId:{attendeeId, webinarId},
                    
                },
            
            data:{
                attendedType,
            },
        
        })
        return{
            success:true,
            data: attendance,
            status:200,
            message:'Attendance type changed successfully',
            
        }
            
            
        } catch (error) {
            console.error('Error updating attendance type:', error)
            return{
                success:false,
                status:500,
                message:'Failed to update attendance type',
            }
        }
        
    }