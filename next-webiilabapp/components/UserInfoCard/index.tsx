import type { Attendee } from "@/lib/generated/prisma/client"
import { cn } from "@/lib/utils"
import React from "react"
import Image from "next/image"

// The pipeline only loads id/name/email; avatar and status are optional
// until the Attendee model stores them.
export type UserInfoCardCustomer = Pick<Attendee, "id" | "name" | "email"> & {
  profileImage?: string | null
  isActive?: boolean
}

type Props = {
  customer: UserInfoCardCustomer
  tags: string[]
  className?: string
}

const UserInfoCard = ({ customer, tags, className }: Props) => {
  // Get initials for the fallback avatar
  const initials = customer.name
    ? customer.name
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U"

  return (
    <div
      className={cn(
        "flex min-w-[280px] items-start gap-4 rounded-2xl border border-border/80 bg-card/40 p-4 shadow-md backdrop-blur-xl transition-all duration-300 hover:border-primary/30 hover:shadow-lg",
        className
      )}
    >
      {/* Avatar Container */}
      <div className="relative shrink-0">
        {customer.profileImage &&
        !customer.profileImage.includes("vercel.svg") ? (
          <div className="h-11 w-11 overflow-hidden rounded-full border border-border bg-secondary">
            <Image
              src={customer.profileImage}
              alt={customer.name || "User Profile"}
              width={44}
              height={44}
              className="h-full w-full object-cover"
            />
          </div>
        ) : (
          <div className="flex h-11 w-11 items-center justify-center rounded-full border border-primary/20 bg-primary/10 text-sm font-bold tracking-wider text-primary">
            {initials}
          </div>
        )}
        {/* Active Status Dot */}
        {customer.isActive && (
          <span className="absolute right-0 bottom-0 h-3 w-3 animate-pulse rounded-full border-2 border-background bg-green-500" />
        )}
      </div>

      {/* Profile Details */}
      <div className="flex min-w-0 flex-1 flex-col gap-2.5">
        <div className="space-y-0.5">
          <h3 className="truncate text-sm font-bold text-foreground">
            {customer.name}
          </h3>
          <p className="truncate text-xs text-muted-foreground">
            {customer.email}
          </p>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5">
          {tags.map((tag, index) => (
            <span
              key={index}
              className="rounded-full border border-border bg-secondary/50 px-2 py-0.5 text-[10px] font-semibold text-foreground/80 backdrop-blur-sm"
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
