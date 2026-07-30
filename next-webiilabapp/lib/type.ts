import { AttendedTypeEnum } from "./generated/prisma/client"

export type ValidationErrors = Record<string, string>


export type  ValidationResult ={
    valid: boolean
    errors: ValidationErrors
}

export const validateBasicInfo = (data:{
    webinarName?: string
    description?: string
    date?: Date
    time?: string 
    timeFormat?: 'AM'| 'PM'
}) : ValidationResult =>{
    const errors : ValidationErrors = {}
    if(!data.webinarName){
        errors.webinarName = "Webinar name is required"
    }
    if(!data.description){
        errors.description = "Description is required"
    }
   
    if(!data.date){
        errors.date="Date is required"
    }
   
    if(!data.time?.trim()) {
        errors.time = "Time is required"
    }else{

        const timeRegex =/^(0[1-9]|1[0-2]):[0-5][0-9]$/
        if(!timeRegex.test(data.time)){
            errors.time="Time must be in format HH:MM (e.g, 10:30)"
        }
    }
   
    return { 
        valid: Object.keys(errors).length === 0, errors}

}

export const validateCTA = (data:{
    ctaLabel?: string
    tags?: string[]
    ctaType?: string
    aiAgent?: string 
    priceId?: string 
}) : ValidationResult =>{
    const errors : ValidationErrors = {}
    if(!data.ctaLabel){
        errors.ctaLabel = "CTA Label is required"
    }
    if(!data.tags){
        errors.tags = "Tags is required"
    }
    if(!data.ctaType){
        errors.ctaType = "CTA Type is required"
    }
    if(!data.aiAgent){
        errors.aiAgent = "AI Agent is required"
    }
    if(!data.priceId){
        errors.priceId = "Price ID is required"
    }
    return { 
        valid: Object.keys(errors).length === 0, errors}

}

export const validateAdditionalInfo = (data:{
    lockChat?: boolean 
    couponCode?: string 
    couponEnabled?: boolean 
}) : ValidationResult => {
    const errors: ValidationErrors = {}
    
    if (data.couponEnabled) {
        if(!data.couponCode || data.couponCode.trim() === "") {
            errors.couponCode = "Coupon code is required when coupon is enabled"
        }   
     }
    
    return { valid: Object.keys(errors).length === 0, errors }
}

export type AttendanceData = {
    count:number
    users: Array<{email: string; name: string; id: string}> 
}
export type PipelineData = {
    data: Record<AttendedTypeEnum, AttendanceData>
    tags: string[]
}

