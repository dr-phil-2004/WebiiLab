"use client"
import Logo from "@/components/ui/logo"
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { sidebarData } from "@/lib/data"
import { UserButton } from "@clerk/nextjs"
import Link from "next/link"
import { usePathname } from "next/navigation"
import React from "react"

const SideBar = () => {
  const pathname = usePathname()
  return (
    <div className="sticky top-0 flex h-screen w-18 flex-col items-center justify-start gap-10 border border-border bg-background px-2 py-10 sm:w-28 sm:px-6">
      <div className="">
        <Logo />
      </div>
      <div className="flex h-full w-full flex-col items-center justify-between">
        <div className="w-ful flex h-fit flex-col items-center justify-center gap-4">
          {sidebarData.map((item) => (
            <TooltipProvider key={item.id}>
              <Tooltip>
                <TooltipTrigger>
                  <Link
                    href={item.link}
                    className={`rouded-lg flex cursor-pointer items-center gap-2 p-2 ${pathname.includes(item.link) ? "iconBackground" : ""} `}
                  >
                    <item.icon
                      className={`h-4 w-4 ${
                        pathname.includes(item.link) ? "" : "opacity-80"
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
