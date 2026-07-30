import { ArrowRightIcon } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import { cn } from '@/lib/utils'

type Props = {
    children: React.ReactNode
    heading: string
    link: string
    className?: string
}

const FeatureSectionLayout = ({ children, heading, link, className }: Props) => {
  return (
    <div className={cn(
      'relative p-8 sm:p-10 flex flex-col justify-between gap-12 border rounded-3xl border-border bg-card/10 backdrop-blur-md overflow-hidden min-h-[420px]',
      className
    )}>
      {/* Visual background accent */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/30 via-primary to-transparent opacity-40" />

      {/* Main content slot */}
      <div className="w-full flex-1 flex items-center justify-center">
        {children}
      </div>

      {/* Footer text and navigation */}
      <div className="w-full flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 pt-6 border-t border-border/40">
        <h3 className='sm:w-[75%] font-bold text-xl sm:text-2xl text-foreground tracking-tight leading-snug'>
          {heading}
        </h3>
        <Link
          href={link}
          className='inline-flex items-center justify-center px-4 py-2 rounded-xl bg-secondary text-primary font-semibold text-sm border border-border/50 hover:bg-primary hover:text-primary-foreground hover:border-transparent transition-all duration-300 group shrink-0'
        >
          View 
          <ArrowRightIcon className='ml-2 w-4 h-4 transition-transform duration-300 group-hover:translate-x-1' />
        </Link>
      </div>
    </div>
  )
}

export default FeatureSectionLayout