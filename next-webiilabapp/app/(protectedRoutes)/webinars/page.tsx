import { onAuthenticateUser } from '@/app/actions/auth'
import { getWebinarByPresenterId } from '@/app/actions/webinar'
import PageHeader from '@/components/ReusableComponents/PageHeader'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Webinar } from '@/lib/generated/prisma/client'
import { HomeIcon, User, Webcam } from 'lucide-react'
import { redirect } from 'next/navigation'
import React from 'react'
import WebinarCards from './_components/WebinarCards'

type Props = {}

const page = async (props: Props) => {
    const checkUser = await onAuthenticateUser()
    if(!checkUser.user){
        redirect('/')
    }

    const webinars = await getWebinarByPresenterId(checkUser?.user?.id)
    
  return (
    <Tabs
    defaultValue="all"
    className="w-full flex flex-col gap-8"
    
    >


        <PageHeader
        leftIcon={<HomeIcon className="w-3 h-3"/>}
        mainIcon={<Webcam className="w-12 h-12"/>}
        rightIcon={<User className="w-4h-4"/>}
        heading="The home to all your webinars "
        placeholder="Search Option..."
        
        
        
        
        />


            <TabsList className='bg-transparent  space-x-3'>
                <TabsTrigger
                value='all'
                    className='bg-secondary opacity-50 data-[state=active]:opacity-100
                    px-6 py-3'
                >All

                </TabsTrigger>
                <TabsTrigger
                value='upcoming'
                    className='bg-secondary px-6 py-3'
                >
                    Upcoming

                </TabsTrigger>
                                <TabsTrigger
                value='ended'
                    className='bg-secondary px-6 py-3'
                >
                    Ended

                </TabsTrigger>


                
            </TabsList>

        

        <TabsContent
          value='all'
          className='w-full grid grid-cols-1 sm:grid-cols-3 xl:grid-cols-4
          place-items-start place-content-start gap-x-6 gap-y-10'
        >
          {webinars && webinars.length > 0 ? (
            webinars.map((webinar: Webinar) => (
              <WebinarCards
                key={webinar.id}
                webinar={webinar}
              />
            ))
          ) : (
            <div className="w-full h-[200px] flex justify-center
            items-center text-foreground/60 font-semibold text-2xl col-span-12">
              No Webinars Found
            </div>
          )}
        </TabsContent>
    </Tabs>
  )
}

export default page