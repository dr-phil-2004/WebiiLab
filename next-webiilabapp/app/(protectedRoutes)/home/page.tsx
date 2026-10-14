import React from "react"
import OnBoarding from "./_components/onBoarding"
import { Upload, Webcam, BarChart3, TrendingUp } from "lucide-react"
import FeatureCard from "./_components/FeatureCard"
import FeatureSectionLayout from "./_components/FeatureSectionLayout"
import UserInfoCard from "@/components/UserInfoCard"
import { potentialCustomer } from "@/lib/data"
import { cn } from "@/lib/utils"

const page = () => {
  return (
    <div className="mx-auto w-full space-y-12 px-2 pb-10 sm:px-6">
      {/* Hero Section */}
      <div className="mt-6 flex w-full flex-col items-start justify-between gap-12 xl:flex-row">
        <div className="max-w-xl space-y-6">
          {/* <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider">
            <Sparkle className="w-3.5 h-3.5 text-primary" /> 
            <span>Builder Studio</span>
          </div> */}

          <h2 className="text-3xl leading-tight font-bold text-gray-900 sm:text-4xl dark:text-neutral-100">
            Let&apos;s Create Your First{" "}
            <span className="bg-gradient-to-r from-primary to-orange-500 bg-clip-text text-transparent">
              Webinar Funnel!
            </span>
          </h2>

          <p className="max-w-lg text-lg leading-relaxed font-normal text-muted-foreground sm:text-xl">
            Watch how easy it is to create your first webinar funnel and start
            converting your leads automatically.
          </p>

          <div className="pt-2">
            <OnBoarding />
          </div>
        </div>

        <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 xl:max-w-2xl">
          <FeatureCard
            Icon={<Upload className="h-6 w-6" />}
            heading="Upload Video — Drag & drop or browse a pre-recorded webinar file."
            link="#"
          />

          <FeatureCard
            Icon={<Webcam className="h-6 w-6" />}
            heading="Record Live — Stream and record a webinar directly using your webcam."
            link="/webinars"
          />
        </div>
      </div>

      {/* Analytics & Showcase Cards */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Card 1: Conversion Tracker Mockup */}
        <FeatureSectionLayout
          heading="See how far along are your potential customers"
          link="/lead"
        >
          <div className="relative w-full max-w-sm space-y-6 rounded-2xl border border-border bg-card/60 p-6 shadow-xl backdrop-blur-xl">
            {/* Glowing background circles for visual depth */}
            <div className="pointer-events-none absolute top-1/2 left-1/2 -z-10 h-48 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/15 blur-3xl" />
            <div className="pointer-events-none absolute -top-10 -left-10 -z-10 h-24 w-24 rounded-full bg-orange-500/10 blur-2xl" />

            <div className="flex w-full items-center justify-between border-b border-border/40 pb-4">
              <div className="flex items-center gap-2">
                <div className="rounded-lg bg-primary/10 p-2 text-primary">
                  <BarChart3 className="h-4 w-4" />
                </div>
                <p className="text-sm font-semibold text-foreground">
                  Conversions
                </p>
              </div>
              <div className="flex items-center gap-1.5 rounded-full bg-green-500/10 px-2 py-0.5 text-[10px] font-bold text-green-500">
                <TrendingUp className="h-3 w-3" />
                <span>+12.4%</span>
              </div>
            </div>

            {/* Simulated Funnel Stats */}
            <div className="space-y-4">
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-muted-foreground">
                    1. Registration Page Visited
                  </span>
                  <span className="font-bold text-foreground">120 Leads</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                  <div className="h-full w-full rounded-full bg-primary/45" />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-muted-foreground">
                    2. Webinar Attended
                  </span>
                  <span className="font-bold text-foreground">85 Leads</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                  <div className="h-full w-[70%] rounded-full bg-primary/75" />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-muted-foreground">
                    3. Product Offer Clicked
                  </span>
                  <span className="font-bold text-foreground">
                    50 Converted
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                  <div className="h-full w-[42%] rounded-full bg-gradient-to-r from-primary to-orange-500" />
                </div>
              </div>
            </div>
          </div>
        </FeatureSectionLayout>

        {/* Card 2: Interactive Sales Agent Showcase */}
        <FeatureSectionLayout
          heading="Your website is your best salesperson. Let’s make sure it’s working 24/7."
          link="/pipeline"
        >
          <div className="relative flex w-full max-w-sm flex-col items-center justify-center gap-4 p-4">
            {/* Soft decorative glow */}
            <div className="pointer-events-none absolute top-1/2 left-1/2 -z-10 h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-tr from-primary/10 to-transparent blur-3xl" />

            {potentialCustomer.slice(0, 2).map((customer, index) => (
              <UserInfoCard
                key={index}
                customer={customer}
                tags={customer.tags}
                className={cn(
                  "w-full transition-all duration-300",
                  index === 1
                    ? "rotate-0 shadow-2xl sm:translate-x-6 sm:-translate-y-3 sm:rotate-2"
                    : "shadow-md"
                )}
              />
            ))}
          </div>
        </FeatureSectionLayout>
      </div>
    </div>
  )
}

export default page
