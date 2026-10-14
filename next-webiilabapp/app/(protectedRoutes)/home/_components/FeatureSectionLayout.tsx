import { ArrowRightIcon } from "lucide-react"
import Link from "next/link"
import React from "react"
import { cn } from "@/lib/utils"

type Props = {
  children: React.ReactNode
  heading: string
  link: string
  className?: string
}

const FeatureSectionLayout = ({
  children,
  heading,
  link,
  className,
}: Props) => {
  return (
    <div
      className={cn(
        "relative flex min-h-[420px] flex-col justify-between gap-12 overflow-hidden rounded-3xl border border-border bg-card/10 p-8 backdrop-blur-md sm:p-10",
        className
      )}
    >
      {/* Visual background accent */}
      <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-primary/30 via-primary to-transparent opacity-40" />

      {/* Main content slot */}
      <div className="flex w-full flex-1 items-center justify-center">
        {children}
      </div>

      {/* Footer text and navigation */}
      <div className="flex w-full flex-col items-start justify-between gap-6 border-t border-border/40 pt-6 sm:flex-row sm:items-center">
        <h3 className="text-xl leading-snug font-bold tracking-tight text-foreground sm:w-[75%] sm:text-2xl">
          {heading}
        </h3>
        <Link
          href={link}
          className="group inline-flex shrink-0 items-center justify-center rounded-xl border border-border/50 bg-secondary px-4 py-2 text-sm font-semibold text-primary transition-all duration-300 hover:border-transparent hover:bg-primary hover:text-primary-foreground"
        >
          View
          <ArrowRightIcon className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
      </div>
    </div>
  )
}

export default FeatureSectionLayout
