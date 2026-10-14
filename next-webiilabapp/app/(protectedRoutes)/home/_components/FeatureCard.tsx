import Link from "next/link"
import React from "react"
import { ArrowUpRight } from "lucide-react"

type Props = {
  Icon: React.ReactNode
  heading: string
  link: string
}

const FeatureCard = ({ Icon, heading, link }: Props) => {
  return (
    <Link
      href={link}
      className="group relative flex min-h-[220px] w-full flex-col items-start justify-between overflow-hidden rounded-2xl border border-border bg-card/30 px-8 py-8 backdrop-blur-md transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/50 hover:bg-card/50 hover:shadow-2xl"
    >
      {/* Decorative background glow */}
      <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-primary/5 blur-2xl transition-all duration-500 group-hover:bg-primary/10" />

      <div className="flex w-full items-start justify-between">
        <div className="rounded-xl border border-border bg-secondary/80 p-3.5 text-primary transition-all duration-300 group-hover:scale-110 group-hover:border-primary/30 group-hover:bg-primary/5">
          {Icon}
        </div>
        <div className="p-1 text-muted-foreground transition-colors duration-300 group-hover:text-primary">
          <ArrowUpRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </div>
      </div>

      <div className="mt-8 space-y-2">
        <p className="text-lg leading-snug font-semibold text-foreground transition-colors duration-300 group-hover:text-primary">
          {heading}
        </p>
        <span className="inline-block text-xs font-semibold text-primary/70 transition-colors group-hover:text-primary">
          Configure Flow
        </span>
      </div>
    </Link>
  )
}

export default FeatureCard
