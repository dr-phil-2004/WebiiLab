import type { Webinar } from "@/lib/generated/prisma/client"
import { format } from "date-fns"
import { Calendar } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import React from "react"
import { PipelineIcon } from "../[webinarId]/pipeline/page"

type Props = {
  webinar: Webinar
}

const WebinarCards = ({ webinar }: Props) => {
  return (
    <div className="flex w-full flex-col items-start gap-3">
      <Link href={`/webinars/${webinar.id}`} className="w-full max-w-[400px]">
        <Image
          src={"/darkthumnail.png"}
          alt="webinar"
          width={400}
          height={200}
          className="w-[400px] rounded-md"
        />
      </Link>
      <div className="flex w-full items-center justify-between gap-3">
        <Link
          href={`/webinars/${webinar.id}`}
          className="flex flex-col items-start gap-2"
        >
          <div className="">
            <p className="text-stone text-sm font-semibold">{webinar.title}</p>
            <p className="text-stone text-sm">{webinar.description}</p>
          </div>
          <div className="flex items-center justify-start gap-2">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Calendar size={15} />
              <p>{format(new Date(webinar?.startTime), "dd/MM/yyyy")}</p>
            </div>
          </div>
        </Link>

        <Link
          href={`/webinars/${webinar.id}/pipeline`}
          className="flex rounded-md border-[0.5px] border-border bg-secondary px-4 py-2"
        >
          <PipelineIcon className="h-4 w-4" />
        </Link>
      </div>
    </div>
  )
}

export default WebinarCards
