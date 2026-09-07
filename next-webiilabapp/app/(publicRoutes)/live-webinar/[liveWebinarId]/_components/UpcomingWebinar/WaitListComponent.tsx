'use client'
import { registerToWaitingList } from '@/app/actions/attendance'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { WebinarStatusEnum } from '@/lib/generated/prisma/enums'
import useAttendeeStore from '@/store/useAttendeeStore'
import { Loader2 } from 'lucide-react'
import { Trykker } from 'next/font/google'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { toast } from 'sonner'

type Props = {
    webinarId : string,
    webinarStatus: WebinarStatusEnum
    onRegistered : ()=> void
}

const WaitListComponent = ({webinarId, webinarStatus, onRegistered }: Props) => {
    const [isOpen, setIsOpen]= useState(false)
    const[name, setName] = useState('')
    const[email, setEmail] = useState('')
    const [submitted, setSubmitted] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const {setAttendee}= useAttendeeStore()
    const router = useRouter()




    const buttonText = ()=>{
        switch(webinarStatus){
            case WebinarStatusEnum.WAITING_ROOM:
                return 'Go to Waiting Room'
            case WebinarStatusEnum.SCHEDULED:
                return 'Go to Waiting Room'
            case WebinarStatusEnum.LIVE:
                return 'Join Webinar'
            default:
                return 'Register'
        }
    }

    const handleSubmit = async(e: React.FormEvent<HTMLFormElement>)=>{
        e.preventDefault();
       
        setIsSubmitting(true)
        try {
            const res = await registerToWaitingList(
                webinarId,
                name,
                email,
            )

            if(!res.success){
               throw new Error('Something went wrong'|| res.message) 
            }
            if(res.data?.user){
                setAttendee(res.data.user)
            }

            toast.success(
                webinarStatus === WebinarStatusEnum.LIVE 
                ? "You are now in the Waiting Room"
                :"You have been added to the Waiting List"
            )

            setName('')
            setEmail('')
            setSubmitted(true)
            setTimeout(()=>{
                if(webinarStatus === WebinarStatusEnum.LIVE){
                    router.refresh()
                }

                if(onRegistered)
                    onRegistered()
            }, 1500)
           
           
            
        } catch (error) {
            console.error('Failed to register for waiting list', error)
            toast.error(error instanceof Error ? error.message :'Failed to register for waiting list')
        } finally {
            setIsSubmitting(false)
        }
    }
  return <Dialog open={isOpen} onOpenChange={setIsOpen}>
    <DialogTrigger >
        <Button
        className={`${webinarStatus === WebinarStatusEnum.LIVE
            ? 'bg-red-600 hover:bg-red-700':
            'bg-primary/80 hover:bg-primary/90'
            } rounded-md px-4 py-2 text-primary-foreground text-sm font-semibold` }
        
        >
            {webinarStatus === WebinarStatusEnum.LIVE &&(
                <span className='mr-2 h-2 w-2  bg-white rounded-full animate-pulse'></span>
            )
               
            }
            {buttonText()}
        </Button>
        
    </DialogTrigger>
    <DialogContent className='border-0 bg-transparent' 
    isHideCloseButton={true}

    
    >
        <DialogHeader className='justify-center items-center border border-input rounded-xl p-4 bg-background'>
            <DialogTitle className='text-center text-lg  font-semibold mb-4 '>
                {webinarStatus === WebinarStatusEnum.LIVE 
                ?  "Get Ready To Join"
                : "Join the WaitList"
                }
            </DialogTitle>
            <form onSubmit={handleSubmit} className='flex flex-col gap-4 w-full'>
                {!submitted && (
                    <React.Fragment>
                        <Input 
                        type = 'text'
                        name = 'name'
                        value = {name}
                        onChange={(e)=>setName(e.target.value)}  required />
                        <Input 
                        type = 'email'
                        name = 'email'
                        value = {email}
                        onChange={(e)=>setEmail(e.target.value)}required  />

                        
                    </React.Fragment>
                )}
                <Button
                type='submit'
                className='w-full'
                disabled={isSubmitting || submitted}
                >
                    {isSubmitting ? (
                        <>
                        <Loader2 className='w-4 h-4 animate-spin mr-2'/>
                        {webinarStatus === WebinarStatusEnum.LIVE 
                        ? 'Joining Now...' 
                        : 'Registering...'
                        }</>
                    ) : submitted ? (
                        webinarStatus === WebinarStatusEnum.LIVE ? (
                                "You're all set to join !"
                            ):(
                                "You're successfully joined the waitlist !"
                            ) 
                       
                    ): webinarStatus === WebinarStatusEnum.LIVE ? ('Join Now'):('Join Waitlist')}

                </Button>
                
            </form>
        </DialogHeader>
    </DialogContent>

  </Dialog>
}

export default WaitListComponent