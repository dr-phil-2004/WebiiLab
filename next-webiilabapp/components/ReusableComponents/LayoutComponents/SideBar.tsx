'use client'
import { Tooltip, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { sidebarData} from '@/lib/data'
import { UserButton } from '@clerk/nextjs'
import { Home } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

type Props = {}

const SideBar = (props: Props) => {
    const pathname = usePathname()
  return (
    <div className='w-18 sm:w-28 h-screen sticky  top-0  py-10
    px-2 sm:px-6  border bg-background border-border flex flex-col  items-center  justify-start
    gap-10
    '> 
        <div className="">
            <Home />
        </div>
        <div className="w-full h-full justify-between items-center flex flex-col">
            <div className="w-ful h-fit flex flex-col gap-4 items-center justify-center"> 

            {sidebarData.map((item)=>(
                <TooltipProvider key={item.id}>
                    <Tooltip>
                        <TooltipTrigger>
                            <Link 
                            href={item.link}
                            className={`flex items-center gap-2
                                cursor-pointer rouded-lg p-2
                                ${pathname.includes(item.link) ? 'iconBackground' : ''}
                                `}
                            >
                            <item.icon
                            className ={`w-4 h-4  ${
                                pathname.includes(item.link) ? '' : 'opacity-80'
                                }`}
                            />
                            </Link>
                        </TooltipTrigger>
                    </Tooltip>
                </TooltipProvider>
            ))}



            </div>

            <UserButton />
        </div>
     </div>
  )
}

export default SideBar