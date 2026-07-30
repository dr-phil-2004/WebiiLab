import React from 'react'
import OnBoarding from './_components/onBoarding'
import { Upload, Webcam, Sparkle, BarChart3, TrendingUp } from 'lucide-react'
import FeatureCard from './_components/FeatureCard'
import FeatureSectionLayout from './_components/FeatureSectionLayout'
import UserInfoCard from '@/components/UserInfoCard'
import { potentialCustomer } from '@/lib/data'
import { cn } from '@/lib/utils'

type Props = {}

const page = (props: Props) => {
  return (
    <div className='w-full mx-auto pb-10 space-y-12 px-2 sm:px-6'>
      {/* Hero Section */}
      <div className="w-full flex flex-col xl:flex-row justify-between items-start gap-12 mt-6">
        <div className="space-y-6 max-w-xl">
          {/* <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider">
            <Sparkle className="w-3.5 h-3.5 text-primary" /> 
            <span>Builder Studio</span>
          </div> */}
          
          <h2 className="text-gray-900 dark:text-neutral-100 font-bold text-3xl sm:text-4xl leading-tight">
            Let&apos;s Create Your First <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-orange-500">Webinar Funnel!</span>
          </h2>
          
          <p className='text-muted-foreground text-lg sm:text-xl font-normal leading-relaxed max-w-lg'>  
            Watch how easy it is to create your first webinar funnel and start converting your leads automatically.
          </p>
          
          <div className="pt-2">
            <OnBoarding />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full xl:max-w-2xl">
          <FeatureCard
            Icon={<Upload className='w-6 h-6'/>}
            heading="Upload Video — Drag & drop or browse a pre-recorded webinar file."
            link= '#'
          />

          <FeatureCard
            Icon={<Webcam className='w-6 h-6'/>}
            heading="Record Live — Stream and record a webinar directly using your webcam."
            link='/webinars'
          />
        </div>
      </div>

      {/* Analytics & Showcase Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Card 1: Conversion Tracker Mockup */}
        <FeatureSectionLayout
          heading="See how far along are your potential customers"
          link="/lead"
        >
          <div className="relative w-full max-w-sm p-6 rounded-2xl border border-border bg-card/60 backdrop-blur-xl shadow-xl space-y-6">
            {/* Glowing background circles for visual depth */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full bg-primary/15 blur-3xl -z-10 pointer-events-none" />
            <div className="absolute -top-10 -left-10 w-24 h-24 rounded-full bg-orange-500/10 blur-2xl -z-10 pointer-events-none" />

            <div className="w-full flex justify-between items-center border-b border-border/40 pb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                  <BarChart3 className="w-4 h-4" />
                </div>
                <p className="text-foreground font-semibold text-sm">
                  Conversions
                </p>
              </div>
              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-green-500/10 text-green-500 text-[10px] font-bold">
                <TrendingUp className="w-3 h-3" />
                <span>+12.4%</span>
              </div>
            </div>

            {/* Simulated Funnel Stats */}
            <div className="space-y-4">
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-muted-foreground">1. Registration Page Visited</span>
                  <span className="text-foreground font-bold">120 Leads</span>
                </div>
                <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                  <div className="h-full bg-primary/45 w-full rounded-full" />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-muted-foreground">2. Webinar Attended</span>
                  <span className="text-foreground font-bold">85 Leads</span>
                </div>
                <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                  <div className="h-full bg-primary/75 w-[70%] rounded-full" />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-muted-foreground">3. Product Offer Clicked</span>
                  <span className="text-foreground font-bold">50 Converted</span>
                </div>
                <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-primary to-orange-500 w-[42%] rounded-full" />
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
          <div className="relative w-full max-w-sm p-4 flex flex-col gap-4 items-center justify-center">
            {/* Soft decorative glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-56 h-56 rounded-full bg-gradient-to-tr from-primary/10 to-transparent blur-3xl -z-10 pointer-events-none" />
            
            {potentialCustomer.slice(0, 2).map((customer, index) => (
              <UserInfoCard
                key={index}
                customer={customer}
                tags={customer.tags}
                className={cn(
                  "w-full transition-all duration-300",
                  index === 1 ? "sm:-translate-y-3 sm:translate-x-6 rotate-0 sm:rotate-2 shadow-2xl" : "shadow-md"
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