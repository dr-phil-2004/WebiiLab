import { cn } from '@/lib/utils'
import React from 'react'

type Props = {
  children: React.ReactNode
  className?: string
}

const PurpleIcon = ({ children, className }: Props) => {
  return (
    <div
      className={cn(
        // Base shape & layout
        'flex items-center justify-center rounded-xl p-3',
        // Purple radial gradient border + background
        'border border-orange-500/30',
        'bg-[radial-gradient(ellipse_80%_120%_at_50%_45%,rgba(9,9,11,0.08)_0%,rgba(249,115,22,0.65)_100%)]',
        // Subtle inner glow
        'shadow-[inset_0_1px_0_rgba(252,112,10,0.12),0_4px_24px_rgba(249,115,22,0.15)]',
        // Text colour for child icons
        'text-orange-100',
        className
      )}
    >
      {children}
    </div>
  )
}

export default PurpleIcon
