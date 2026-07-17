import { Manrope} from "next/font/google"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils";
import { ClerkProvider } from "@clerk/nextjs";


const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope'
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider>
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("antialiased", manrope.variable, "font-sans")}
    >
      <body suppressHydrationWarning >
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange>
          {children}
          </ThemeProvider>
      </body>
    </html>
    </ClerkProvider>
  )
}
