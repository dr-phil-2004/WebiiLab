"use client"
import type { User } from "@/lib/generated/prisma/client"
import React, { useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import { toast } from "sonner"
import { StreamRecording, WebinarWithPresenter } from "@/lib/type"

type Props = {
  apiKey: string
  token: string
  callId: string
  user: User | null
  userId: string
  error: string | undefined
  webinar: WebinarWithPresenter
  recording?: StreamRecording | null
}

// Refactor in progress: only `error` is used for now; the other props are
// already passed by the page for the upcoming live/upcoming/ended views.
const RenderWebinar = ({ error }: Props) => {
  const router = useRouter()
  const pathname = usePathname()
  useEffect(() => {
    if (error) {
      toast.error(error)
      router.push(pathname)
    }
  }, [error, pathname, router])
  return <React.Fragment></React.Fragment>
}

export default RenderWebinar
