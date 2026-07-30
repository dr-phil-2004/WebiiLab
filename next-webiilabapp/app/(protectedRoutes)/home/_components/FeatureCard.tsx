import Link from 'next/link'
import React from 'react'
import { ArrowUpRight } from 'lucide-react'

type Props = {
    Icon: React.ReactNode
    heading: string
    link: string
}

const FeatureCard = ({ Icon, heading, link }: Props) => {
  return (
    <Link
      href={link}
      className='group relative px-8 py-8 flex flex-col items-start justify-between min-h-[220px] w-full
      rounded-2xl border border-border bg-card/30 backdrop-blur-md transition-all duration-300 
      hover:-translate-y-1.5 hover:shadow-2xl hover:border-primary/50 hover:bg-card/50 overflow-hidden'
    >
      {/* Decorative background glow */}
      <div className="absolute -right-10 -top-10 w-32 h-32 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-all duration-500" />
      
      <div className="flex justify-between items-start w-full">
        <div className="p-3.5 rounded-xl border border-border bg-secondary/80 text-primary transition-all duration-300 group-hover:scale-110 group-hover:border-primary/30 group-hover:bg-primary/5">
          {Icon}
        </div>
        <div className="text-muted-foreground group-hover:text-primary transition-colors duration-300 p-1">
          <ArrowUpRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </div>
      </div>

      <div className="space-y-2 mt-8">
        <p className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors duration-300 leading-snug">
          {heading}
        </p>
        <span className="inline-block text-xs font-semibold text-primary/70 group-hover:text-primary transition-colors">
          Configure Flow
        </span>
      </div>
    </Link>
  )
}

export default FeatureCard