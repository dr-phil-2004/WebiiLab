import React from "react"
import PurpleIcon from "./PurpleIcon"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"

type Props = {
  heading?: string
  mainIcon: React.ReactNode
  leftIcon: React.ReactNode
  rightIcon: React.ReactNode
  children?: React.ReactNode
  placeholder?: string
}

const PageHeader = ({
  heading,
  mainIcon,
  leftIcon,
  rightIcon,
  children,
  placeholder,
}: Props) => {
  return (
    <div className="flex w-full flex-col gap-8">
      <div className="flex w-full flex-wrap items-center justify-center gap-8 sm:justify-between">
        <p className="text-stone text-4xl font-semibold">{heading}</p>

        <div className="relative md:mr-28">
          <PurpleIcon className="absolute -top-3 -left-4 -z-10 -rotate-45 py-3">
            {leftIcon}
          </PurpleIcon>
          <PurpleIcon className="z-10 backdrop-blur">{mainIcon}</PurpleIcon>
          <PurpleIcon className="absolute -top-3 -right-4 -z-10 rotate-45 py-3">
            {rightIcon}
          </PurpleIcon>
        </div>
      </div>

      <div className="flex w-full flex-wrap items-center justify-center gap-6">
        <div className="relative w-full flex-1 md:max-w-3/4">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-500" />

          <Input
            type="text"
            placeholder={placeholder || "Search..."}
            className="rounded-md pl-10"
          />
        </div>
        <div className="w-full overflow-x-auto md:max-w-1/4">{children}</div>
      </div>
    </div>
  )
}

export default PageHeader
