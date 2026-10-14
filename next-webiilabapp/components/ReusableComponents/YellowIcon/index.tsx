import { cn } from "@/lib/utils"
import React from "react"

type Props = {
  className?: string
  children: React.ReactNode
}

const YellowIcon = ({ className, children }: Props) => {
  return (
    <div className={cn("iconBackground px-4 py-2", className)}>{children}</div>
  )
}

export default YellowIcon
