import { Attendee } from '@/lib/generated/prisma/client'
import { cn } from '@/lib/utils'
import React from 'react'
import Image from 'next/image'

type Props = {
    customer: Attendee
    tags: string[]
    className?: string
}

const UserInfoCard = ({ customer, tags, className }: Props) => {
  // Get initials for the fallback avatar
  const initials = customer.name
    ? customer.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : 'U'

  return (
    <div className={cn(
      'flex items-start gap-4 p-4 rounded-2xl border border-border/80 bg-card/40 backdrop-blur-xl shadow-md min-w-[280px] transition-all duration-300 hover:shadow-lg hover:border-primary/30',
      className
    )}>
      {/* Avatar Container */}
      <div className="relative shrink-0">
        {customer.profileImage && !customer.profileImage.includes('vercel.svg') ? (
          <div className="w-11 h-11 rounded-full overflow-hidden border border-border bg-secondary">
            <Image 
              src={customer.profileImage} 
              alt={customer.name || 'User Profile'} 
              width={44} 
              height={44}
              className="object-cover w-full h-full"
            />
          </div>
        ) : (
          <div className="w-11 h-11 rounded-full flex items-center justify-center bg-primary/10 border border-primary/20 text-primary font-bold text-sm tracking-wider">
            {initials}
          </div>
        )}
        {/* Active Status Dot */}
        {customer.isActive && (
          <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 border-2 border-background animate-pulse" />
        )}
      </div>

      {/* Profile Details */}
      <div className="flex flex-col gap-2.5 flex-1 min-w-0">
        <div className="space-y-0.5">
          <h3 className="font-bold text-sm text-foreground truncate">{customer.name}</h3>
          <p className="text-xs text-muted-foreground truncate">{customer.email}</p>
        </div>

        {/* Tags */}
        <div className="flex gap-1.5 flex-wrap">
          {tags.map((tag, index) => (
            <span
              key={index}
              className="text-[10px] font-semibold text-foreground/80 px-2 py-0.5 rounded-full border border-border bg-secondary/50 backdrop-blur-sm"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

export default UserInfoCard