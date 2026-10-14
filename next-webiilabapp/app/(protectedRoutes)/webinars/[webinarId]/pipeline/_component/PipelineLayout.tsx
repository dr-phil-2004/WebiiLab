import UserInfoCard from "@/components/UserInfoCard"
import { Badge } from "@/components/ui/badge"
import type { AttendanceData } from "@/lib/type"
import React from "react"

type Props = {
  title: string
  count: number
  users: AttendanceData["users"]
  tags: string[]
}

const PipelineLayout = ({ title, count, users, tags }: Props) => {
  return (
    <div className="w-[350px] flex-shrink-0 rounded-xl border border-border bg-background/10 p-5 backdrop-blur-2xl">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-medium">{title}</h2>
        <Badge variant="secondary">{count}</Badge>
      </div>

      <div className="scrollbar-hide max-h-[70vh] space-y-3 overflow-auto pr-2">
        {users.map((user, index) => (
          <UserInfoCard key={index} customer={user} tags={tags} />
        ))}
      </div>
    </div>
  )
}

export default PipelineLayout
