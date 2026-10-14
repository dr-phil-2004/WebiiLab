import { onAuthenticateUser } from "@/app/actions/auth"
import { getWebinarByPresenterId } from "@/app/actions/webinar"
import PageHeader from "@/components/ReusableComponents/PageHeader"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Webinar } from "@/lib/generated/prisma/client"
import { HomeIcon, User, Webcam } from "lucide-react"
import Link from "next/link"
import { redirect } from "next/navigation"
import React from "react"
import WebinarCards from "./_components/WebinarCards"

type Props = {
  searchParams: Promise<{
    webinarStatus?: string
  }>
}

const page = async ({ searchParams }: Props) => {
  const { webinarStatus } = await searchParams
  const checkUser = await onAuthenticateUser()
  if (!checkUser.user) {
    redirect("/")
  }

  const webinars = await getWebinarByPresenterId(
    checkUser.user.id,
    webinarStatus
  )

  return (
    <Tabs defaultValue="all" className="flex w-full flex-col gap-8">
      <PageHeader
        leftIcon={<HomeIcon className="h-3 w-3" />}
        mainIcon={<Webcam className="h-12 w-12" />}
        rightIcon={<User className="w-4h-4" />}
        heading="The home to all your webinars "
        placeholder="Search Option..."
      />

      <TabsList className="space-x-3 bg-transparent">
        <TabsTrigger
          value="all"
          className="bg-secondary px-6 py-3 opacity-50 data-[state=active]:opacity-100"
        >
          <Link href="?webinarStatus=all">All</Link>
        </TabsTrigger>
        <TabsTrigger value="upcoming" className="bg-secondary px-6 py-3">
          <Link href="?webinarStatus=upcoming">Upcoming</Link>
        </TabsTrigger>
        <TabsTrigger value="ended" className="bg-secondary px-6 py-3">
          <Link href="?webinarStatus=ended">All</Link>
        </TabsTrigger>
      </TabsList>

      <TabsContent
        value="all"
        className="grid w-full grid-cols-1 place-content-start place-items-start gap-x-6 gap-y-10 sm:grid-cols-3 xl:grid-cols-4"
      >
        {webinars && webinars.length > 0 ? (
          webinars.map((webinar: Webinar) => (
            <WebinarCards key={webinar.id} webinar={webinar} />
          ))
        ) : (
          <div className="col-span-12 flex h-[200px] w-full items-center justify-center text-2xl font-semibold text-foreground/60">
            No Webinars Found
          </div>
        )}
      </TabsContent>
      <TabsContent
        value="upcoming"
        className="grid w-full grid-cols-1 place-content-start place-items-start gap-x-6 gap-y-10 sm:grid-cols-3 xl:grid-cols-4"
      >
        {webinars && webinars.length > 0 ? (
          webinars.map((webinar: Webinar) => (
            <WebinarCards key={webinar.id} webinar={webinar} />
          ))
        ) : (
          <div className="col-span-12 flex h-[200px] w-full items-center justify-center text-2xl font-semibold text-foreground/60">
            No Webinars Found
          </div>
        )}
      </TabsContent>
      <TabsContent
        value="ended"
        className="grid w-full grid-cols-1 place-content-start place-items-start gap-x-6 gap-y-10 sm:grid-cols-3 xl:grid-cols-4"
      >
        {webinars && webinars.length > 0 ? (
          webinars.map((webinar: Webinar) => (
            <WebinarCards key={webinar.id} webinar={webinar} />
          ))
        ) : (
          <div className="col-span-12 flex h-[200px] w-full items-center justify-center text-2xl font-semibold text-foreground/60">
            No Webinars Found
          </div>
        )}
      </TabsContent>
    </Tabs>
  )
}

export default page
