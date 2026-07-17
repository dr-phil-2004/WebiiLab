import React from 'react'
import { redirect } from 'next/navigation'
import { auth } from '@clerk/nextjs/server'
import SideBar from '@/components/ReusableComponents/LayoutComponents/SideBar'
import Header from '@/components/ReusableComponents/LayoutComponents/Header'
import { onAuthenticateUser } from '../actions/auth'

type Props = {
    children: React.ReactNode
}

const layout = async ({ children }: Props) => {
    // const { userId } = await auth()

    // if (!userId) {
    //     redirect('/')
    // }
    const userExists = await onAuthenticateUser()
    if(!userExists.user){
        redirect('/sign-in')
    }

    return (
        <div className='flex w-full min-h-screen'>
            {/* Sidebar  */}
            <SideBar />
            <div className="flex flex-col w-full h-screen
             overflow-auto px-4 scrollbar-hide container mx-auto">

                {/* Header*/}
                <Header user={userExists.user}/>
            {children}
            </div>

        </div>
    )
}

export default layout